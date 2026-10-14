CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  full_name text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (phone ~ '^\+?[0-9 ()-]{7,20}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX profiles_company_id_idx ON public.profiles(company_id);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, phone) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;
REVOKE ALL ON FUNCTION public.current_company_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_company_id() TO authenticated;

CREATE POLICY "Clients read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Clients update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Clients read own company" ON public.companies
  FOR SELECT TO authenticated USING (id = public.current_company_id());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.provision_client(_email text, _company_name text, _full_name text, _phone text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid; _cid uuid;
BEGIN
  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(btrim(_email));
  IF _uid IS NULL THEN RAISE EXCEPTION 'No auth user with email %', _email; END IF;
  INSERT INTO public.companies(name) VALUES (btrim(_company_name))
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO _cid;
  INSERT INTO public.profiles(id, company_id, full_name, phone)
    VALUES (_uid, _cid, btrim(_full_name), btrim(_phone))
    ON CONFLICT (id) DO UPDATE SET company_id = EXCLUDED.company_id,
      full_name = EXCLUDED.full_name, phone = EXCLUDED.phone;
  RETURN _uid;
END; $$;
REVOKE ALL ON FUNCTION public.provision_client(text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.provision_client(text, text, text, text) TO service_role;