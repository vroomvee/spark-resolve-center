import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export type ClientProfile = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
};

export const profileQuery = queryOptions({
  queryKey: ["client-profile"],
  queryFn: async (): Promise<ClientProfile | null> => {
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) throw new Error("Your session has expired. Please sign in again.");
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, companies(name)")
      .eq("id", auth.user.id)
      .maybeSingle();
    if (error) throw new Error("We couldn't load your profile. Please try again.");
    if (!data) return null;
    return {
      id: data.id,
      fullName: data.full_name,
      phone: data.phone,
      email: auth.user.email ?? "",
      companyName: data.companies?.name ?? "",
    };
  },
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number, e.g. +91 98765 43210."),
});

export const emailSchema = z.string().trim().email("Enter a valid email address.").max(255);
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be at most 128 characters.");

/** Ordered teardown: stop queries, drop private cache, end session, replace history. */
export async function signOutClient(queryClient: QueryClient, go: () => void) {
  await queryClient.cancelQueries();
  queryClient.clear();
  await supabase.auth.signOut();
  go();
}
