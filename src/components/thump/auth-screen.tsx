import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "./brand";
import rhino from "@/assets/thump-rhino.jpg";
export function AuthScreen({ mode = "login" }: { mode?: "login" | "forgot" | "reset" }) {
  const [notice, setNotice] = useState(false);
  const [visible, setVisible] = useState(false);
  const title =
    mode === "login"
      ? "Welcome back."
      : mode === "forgot"
        ? "Forgot password?"
        : "Reset your password.";
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
          <div className="bg-muted border border-border p-3 mb-6 text-xs text-muted-foreground flex gap-2">
            <Info className="size-4 shrink-0" />
            Live account access is not connected yet. Explore the fictional demo below.
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setNotice(true);
            }}
            className="space-y-5"
          >
            {mode !== "reset" && (
              <label className="field-label">
                Email address
                <Input
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
                    type={visible ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete={mode === "reset" ? "new-password" : "current-password"}
                    placeholder="Enter your password"
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
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
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
            <Button className="w-full h-12" type="submit">
              {mode === "login"
                ? "Client Login"
                : mode === "forgot"
                  ? "Request reset link"
                  : "Update password"}
              <ArrowRight />
            </Button>
            {notice && (
              <p role="status" className="notice">
                {mode === "login"
                  ? "Sign-in is not connected. No account was authenticated."
                  : mode === "forgot"
                    ? "No reset email was sent. Email recovery will be available after live services are connected."
                    : "No password was changed. A valid recovery link and live account connection are required."}
              </p>
            )}
          </form>
          {mode === "login" ? (
            <>
              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                PREVIEW THE WORKSPACE
                <span className="h-px flex-1 bg-border" />
              </div>
              <Button asChild variant="outline" className="w-full h-12">
                <Link to="/portal">
                  Explore demo portal
                  <ArrowUpRightIcon />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-8">
                Need client access?{" "}
                <a href="mailto:mohit@thumpserve.com" className="text-foreground underline">
                  Contact THUMP
                </a>
              </p>
            </>
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
function ArrowUpRightIcon() {
  return <ArrowRight />;
}
