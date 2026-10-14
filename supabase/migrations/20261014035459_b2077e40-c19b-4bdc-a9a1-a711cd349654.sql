DROP POLICY "Clients read own company" ON public.companies;
CREATE POLICY "Clients read own company" ON public.companies
  FOR SELECT TO authenticated
  USING (id IN (SELECT p.company_id FROM public.profiles p WHERE p.id = auth.uid()));
DROP FUNCTION public.current_company_id();