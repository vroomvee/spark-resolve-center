import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalShell } from "@/components/thump/portal-shell";
export const Route = createFileRoute("/_authenticated/portal")({
  component: () => (
    <PortalShell>
      <Outlet />
    </PortalShell>
  ),
});
