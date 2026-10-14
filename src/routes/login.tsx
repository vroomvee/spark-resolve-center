import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthScreen } from "@/components/thump/auth-screen";
import { pageHead } from "@/lib/thump/data";
export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().max(200).optional() }),
  head: () => pageHead("Client login", "THUMP client account access and maintenance support."),
  component: Login,
});
function Login() {
  const { redirect } = Route.useSearch();
  return <AuthScreen mode="login" redirect={redirect} />;
}
