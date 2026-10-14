import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "./brand";
import { supabase } from "@/integrations/supabase/client";
import { emailSchema, passwordSchema } from "@/lib/thump/account";
import rhino from "@/assets/thump-rhino.jpg";

type Mode = "login" | "forgot" | "reset";

function safeRedirect(path?: string) {
  return path && path.startsWith("/portal") ? path : "/portal";
}

export function AuthScreen({ mode = "login", redirect }: { mode?: Mode; redirect?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // reset mode: wait for the recovery session parsed from the email link
  const [recovery, setRecovery] = useState<"checking" | "ready" | "invalid">("checking");

  useEffect(() => {
    if (mode === "login") {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) navigate({ to: safeRedirect(redirect), replace: true });
      });
    }
    if (mode !== "reset") return;
    const hash = window.location.hash;
    const linkError = new URLSearchParams(hash.slice(1)).get("error_description");
    if (linkError) {
      setRecovery("invalid");
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && hash.includes("type=recovery")))
        setRecovery("ready");
    });
    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setRecovery((r) => (r === "ready" ? r : data.session ? "ready" : "invalid"));
    }, 1200);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [mode, navigate, redirect]);

  const title =
    mode === "login"
      ? "Welcome back."
      : mode === "forgot"
        ? "Forgot password?"
        : "Reset your password.";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const form = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(form.get("email") ?? "");
    const password = passwordSchema.safeParse(form.get("password") ?? "");
    setBusy(true);
    try {
      if (mode === "login") {
        if (!email.success) return setError(email.error.issues[0]!.message);
        if (!form.get("password")) return setError("Enter your password.");
        const { error } = await supabase.auth.signInWithPassword({
          email: email.data,
          password: String(form.get("password")),
        });
        if (error) {
          return setError(
            error.message.toLowerCase().includes("invalid")
              ? "Incorrect email or password."
              : error.message.toLowerCase().includes("confirm")
                ? "This account hasn't been activated yet. Please contact THUMP."
                : "Sign-in failed. Please try again.",
          );
        }
        queryClient.clear();
        navigate({ to: safeRedirect(redirect), replace: true });
      } else if (mode === "forgot") {
        if (!email.success) return setError(email.error.issues[0]!.message);
        const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error && error.status === 429)
          return setError("Too many requests. Please wait a minute and try again.");
        // Same message whether or not the account exists, to avoid revealing registered emails.
        setSuccess(
          "If an account exists for that email, a reset link is on its way. Check your inbox.",
        );
      } else {
        if (!password.success) return setError(password.error.issues[0]!.message);
        if (form.get("password") !== form.get("confirm"))
          return setError("The passwords don't match.");
        const { error } = await supabase.auth.updateUser({ password: password.data });
        if (error)
          return setError(
            error.message.toLowerCase().includes("different")
              ? "Choose a password different from your current one."
              : "We couldn't update your password. Request a new reset link.",
          );
        setSuccess("Password updated. Taking you to your workspace…");
        setTimeout(() => navigate({ to: "/portal", replace: true }), 1200);
      }
    } finally {
      setBusy(false);
    }
  }

  const resetBlocked = mode === "reset" && recovery !== "ready";

  return (
    <div className="auth-layout min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:flex relative bg-hero text-hero-foreground p-12 flex-col justify-between overflow-hidden">
        <img
          src={rhino}
          alt="Metallic geometric rhinoceros"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-50"
          width={1920}
          height={1024}
        />
        <div className="relative">
          <Brand light />
        </div>
        <div className="relative">
          <p className="eyebrow text-primary mb-5">THE THUMP CLIENT PORTAL</p>
          <h2 className="text-5xl font-bold leading-tight">
            Protection.
            <br />
            Always connected.
          </h2>
          <p className="mt-6 text-hero-muted max-w-sm leading-relaxed">
            Your sites. Your equipment. Your maintenance requests. All in one place.
          </p>
        </div>
        <p className="relative text-xs text-hero-muted">
          A Fire Safety & Security Company · Bangalore
        </p>
      </section>
      <main className="flex flex-col p-6 sm:p-12">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back to THUMP
        </Link>
        <div className="w-full max-w-sm m-auto py-14">
          <div className="lg:hidden mb-10">
            <Brand />
          </div>
          <ShieldCheck className="size-8 text-primary mb-6" />
          <p className="eyebrow mb-3">CLIENT ACCESS</p>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-3 mb-7">
            {mode === "login"
              ? "Sign in to your maintenance workspace."
              : mode === "forgot"
                ? "Enter your registered email to request a reset link."
                : "Choose a new password for your client account."}
          </p>
          {mode === "reset" && recovery === "checking" && (
            <p role="status" className="notice mb-6 flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Verifying your reset link…
            </p>
          )}
          {mode === "reset" && recovery === "invalid" && (
            <p role="alert" className="notice mb-6">
              This reset link is invalid or has expired.{" "}
              <Link to="/forgot-password" className="text-primary underline">
                Request a new link
              </Link>
              .
            </p>
          )}
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {mode !== "reset" && (
              <label className="field-label">
                Email address
                <Input
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="mt-2 h-12"
                />
              </label>
            )}
            {mode !== "forgot" && (
              <label className="field-label">
                {mode === "reset" ? "New password" : "Password"}
                <div className="relative mt-2">
                  <Input
                    name="password"
                    type={visible ? "text" : "password"}
                    required
                    maxLength={128}
                    disabled={resetBlocked}
                    autoComplete={mode === "reset" ? "new-password" : "current-password"}
                    placeholder={mode === "reset" ? "At least 8 characters" : "Enter your password"}
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1.5"
                    aria-label={visible ? "Hide password" : "Show password"}
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </label>
            )}
            {mode === "reset" && (
              <label className="field-label">
                Confirm new password
                <Input
                  name="confirm"
                  type="password"
                  required
                  maxLength={128}
                  disabled={resetBlocked}
                  autoComplete="new-password"
                  className="mt-2 h-12"
                />
              </label>
            )}
            {mode === "login" && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-primary">
                  Forgot password?
                </Link>
              </div>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {success && (
              <p role="status" className="notice">
                {success}
              </p>
            )}
            <Button className="w-full h-12" type="submit" disabled={busy || resetBlocked}>
              {busy && <Loader2 className="animate-spin" />}
              {mode === "login"
                ? busy
                  ? "Signing in…"
                  : "Client Login"
                : mode === "forgot"
                  ? busy
                    ? "Sending…"
                    : "Request reset link"
                  : busy
                    ? "Updating…"
                    : "Update password"}
              {!busy && <ArrowRight />}
            </Button>
          </form>
          {mode === "login" ? (
            <p className="text-xs text-muted-foreground text-center mt-8">
              Client accounts are set up by THUMP. Need access?{" "}
              <a href="mailto:mohit@thumpserve.com" className="text-foreground underline">
                Contact THUMP
              </a>
            </p>
          ) : (
            <Link to="/login" className="block text-center mt-6 text-sm text-muted-foreground">
              Back to client login
            </Link>
          )}
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          THUMP Services & Solutions · Client portal
        </p>
      </main>
    </div>
  );
}
