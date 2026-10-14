import { createFileRoute, Link } from "@tanstack/react-router";
import { UserRound, LogOut } from "lucide-react";
import { PortalHeading } from "@/components/thump/portal-shell";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/components/thump/demo-context";
import { pageHead } from "@/lib/thump/data";
export const Route = createFileRoute("/_authenticated/portal/profile")({
  head: () =>
    pageHead("Demo client profile", "Preview the THUMP client profile and organisation workspace."),
  component: Profile,
});
function Profile() {
  const { clearDemo } = useDemo();
  return (
    <>
      <PortalHeading
        title="Your client profile."
        subtitle="Your account and organisation details."
      />
      <div className="max-w-2xl">
        <div className="flex gap-5 items-center border-b border-border pb-8">
          <div className="size-16 bg-background border border-border grid place-items-center rounded-md">
            <UserRound className="size-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Demo Client</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Fictional account · No active authentication
            </p>
          </div>
        </div>
        <dl className="grid sm:grid-cols-2 gap-8 py-8">
          {[
            ["Display name", "Demo Client"],
            ["Email", "client@example.com"],
            ["Organisation", "Demo — Northstar Properties"],
            ["Membership", "Client member"],
            ["Sites", "Orion Business Park, Cedar Heights"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground mb-3">{label}</dt>
              <dd className="text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="notice mb-8">
          Profile updates and password changes will be available when live account access is
          connected.
        </p>
        <Button asChild variant="outline">
          <Link to="/login" onClick={clearDemo}>
            <LogOut />
            Exit demo workspace
          </Link>
        </Button>
      </div>
    </>
  );
}
