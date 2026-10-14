import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { UserRound, LogOut, Loader2, Save } from "lucide-react";
import { PortalHeading } from "@/components/thump/portal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery, profileSchema, signOutClient } from "@/lib/thump/account";
import { pageHead } from "@/lib/thump/data";

export const Route = createFileRoute("/_authenticated/portal/profile")({
  head: () => pageHead("Client profile", "Manage your THUMP client account details."),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: Profile,
});

function Profile() {
  const { data: profile } = useSuspenseQuery(profileQuery);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const save = useMutation({
    mutationFn: async (values: { fullName: string; phone: string }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: values.fullName, phone: values.phone })
        .eq("id", profile!.id)
        .select("id")
        .maybeSingle();
      if (error || !data) throw new Error("We couldn't save your changes. Please try again.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: profileQuery.queryKey });
      setSaved(true);
    },
    onError: (e: Error) => setError(e.message),
  });
  if (!profile) return null; // shell shows the not-provisioned state

  return (
    <>
      <PortalHeading title="Your client profile." subtitle="Your account and company details." />
      <div className="max-w-2xl">
        <div className="flex gap-5 items-center border-b border-border pb-8">
          <div className="size-16 bg-background border border-border grid place-items-center rounded-md">
            <UserRound className="size-7 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold break-words">{profile.fullName}</h2>
            <p className="text-sm text-muted-foreground mt-2">{profile.companyName}</p>
          </div>
        </div>
        <form
          key={`${profile.fullName}|${profile.phone}`}
          className="grid sm:grid-cols-2 gap-5 py-8"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            setSaved(false);
            const form = new FormData(e.currentTarget);
            const result = profileSchema.safeParse({
              fullName: form.get("fullName"),
              phone: form.get("phone"),
            });
            if (!result.success) return setError(result.error.issues[0]!.message);
            save.mutate(result.data);
          }}
        >
          <label className="field-label">
            Full name *
            <Input
              name="fullName"
              required
              maxLength={100}
              defaultValue={profile.fullName}
              autoComplete="name"
              className="mt-2 h-12 bg-background"
            />
          </label>
          <label className="field-label">
            Phone number *
            <Input
              name="phone"
              type="tel"
              required
              maxLength={20}
              defaultValue={profile.phone}
              autoComplete="tel"
              className="mt-2 h-12 bg-background"
            />
          </label>
          <label className="field-label">
            Email address
            <Input value={profile.email} readOnly disabled className="mt-2 h-12" />
          </label>
          <label className="field-label">
            Company name
            <Input value={profile.companyName} readOnly disabled className="mt-2 h-12" />
          </label>
          <p className="sm:col-span-2 text-xs text-muted-foreground">
            Your email and company are managed by THUMP. Contact us to change them.
          </p>
          {error && (
            <p role="alert" className="sm:col-span-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {saved && (
            <p role="status" className="sm:col-span-2 notice">
              Profile saved.
            </p>
          )}
          <div className="sm:col-span-2">
            <Button type="submit" className="h-12" disabled={save.isPending}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
              {save.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
        <Button
          variant="outline"
          onClick={() =>
            signOutClient(queryClient, () => navigate({ to: "/login", replace: true }))
          }
        >
          <LogOut />
          Sign out
        </Button>
      </div>
    </>
  );
}
