import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { z } from "zod";
import * as Icons from "lucide-react";
import { ArrowRight, Mail, Lock, ShieldCheck, HeartPulse, Activity, Radio } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ROLES, ROLE_LIST, type Role } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ECGLifeline } from "@/components/ECGLifeline";
import { LOGO_URL } from "@/lib/assets";
import { toast } from "sonner";

const roleIcons: Record<Role, string> = {
  super_admin: "Crown",
  ops_manager: "Compass",
  dispatcher: "Radio",
  fleet_manager: "Ambulance",
  crew_supervisor: "Users",
  ambulance_crew: "Siren",
  hospital_coordinator: "Building2",
  finance: "Receipt",
};

function DynIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Circle;
  return <I className={className} />;
}

const searchSchema = z.object({
  role: z
    .enum([
      "super_admin",
      "ops_manager",
      "dispatcher",
      "fleet_manager",
      "crew_supervisor",
      "hospital_coordinator",
      "finance",
      "ambulance_crew",
    ])
    .optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (search) => searchSchema.parse(search),
  component: LoginPage,
});

function LoginPage() {
  const { role: roleParam } = Route.useSearch();
  const role: Role = (roleParam as Role) ?? "super_admin";
  const roleDef = ROLES[role];
  const { signIn, session } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(`${role}@rpm.ae`);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const pickRole = (r: Role) => {
    setRoleOpen(false);
    if (r === "ambulance_crew") { navigate({ to: "/crew-app" }); return; }
    setEmail(`${r}@rpm.ae`);
    navigate({ to: "/login", search: { role: r } });
  };

  useEffect(() => {
    if (session) navigate({ to: "/portal" });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");
    setBusy(true);
    setTimeout(() => {
      signIn(role);
      toast.success(`Welcome, ${roleDef.shortLabel}`);
      navigate({ to: "/portal" });
    }, 550);
  };

  const forgot = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reset link sent", { description: `Check ${email} for a secure link.` });
    setShowForgot(false);
  };

  return (
    <div className="h-dvh grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* ============ LEFT · Form ============ */}
      <div className="relative flex flex-col px-6 md:px-14 py-6 overflow-y-auto lg:overflow-hidden">

        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to overview
          </Link>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            RPM · EMS Command
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-5 self-start">
            <ShieldCheck className="h-3.5 w-3.5" /> {roleDef.label}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
            {showForgot ? "Reset password" : "Sign in"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {showForgot
              ? "Enter your work email. We'll send a secure reset link valid for 15 minutes."
              : `Signing in as ${roleDef.label}. ${roleDef.description}`}
          </p>

          {!showForgot ? (
            <form onSubmit={submit} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-11"
                    placeholder="name@rpm.ae"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-11"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                  Remember me on this device
                </label>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  SSO · MFA ready
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={busy}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow h-12"
              >
                {busy ? "Authenticating…" : `Sign in as ${roleDef.shortLabel}`}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="text-center text-xs text-muted-foreground pt-2">
                Not the right role?{" "}
                <button
                  type="button"
                  onClick={() => setRoleOpen(true)}
                  className="text-primary hover:underline"
                >
                  Choose a different role
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={forgot} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fmail">Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground h-12">
                Send reset link
              </Button>
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary"
              >
                ← Back to sign in
              </button>
            </form>
          )}
        </motion.div>

        <div className="text-[11px] text-muted-foreground text-center mt-6 font-mono">
          © {new Date().getFullYear()} Response Plus Holding PJSC · Secure by design
        </div>
      </div>

      {/* ============ RIGHT · Brand panel ============ */}
      <div className="relative hidden lg:block overflow-hidden bg-gradient-login text-white">
        <ECGLifeline className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-64 opacity-30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl float-slow" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand-red/30 blur-3xl float-slow" />
        <div className="absolute inset-0 bg-grid opacity-25" />

        <div className="relative z-10 h-full flex flex-col items-center px-6 xl:px-10 overflow-y-auto">
          {/* Logo at the very top, centered */}
          <div className="pt-4 pb-4 w-full flex justify-center">
            <img src={LOGO_URL} alt="Response Plus Holding PJSC" className="h-16 w-auto max-w-[300px] object-contain" />
          </div>

          {/* Content starts from the top, centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] mb-3 backdrop-blur">
              <HeartPulse className="h-3.5 w-3.5" />
              Enterprise CAD · UAE-wide
            </div>
            <h2 className="text-xl xl:text-2xl font-display font-semibold leading-tight text-center w-full">
              Every second saves a life.
            </h2>
            <p className="mt-2 text-white/70 text-xs leading-relaxed text-center w-full max-w-xs mx-auto">
              Unified command for emergency intake, dispatch, fleet, crew, hospital
              handover and analytics — across all seven Emirates.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
              <MiniTile icon={Radio} label="Dispatch SLA" value="<10s" />
              <MiniTile icon={Activity} label="Availability" value="99.9%" />
              <MiniTile icon={ShieldCheck} label="ADHICS" value="Level 2" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ Role picker dialog ============ */}
      <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose your role</DialogTitle>
            <DialogDescription>
              Each portal is scoped to the modules your role needs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            {ROLE_LIST.map((r) => {
              const active = r.key === role;
              return (
                <button
                  key={r.key}
                  onClick={() => pickRole(r.key)}
                  className={`text-left rounded-xl border p-4 transition-all hover:border-primary/60 hover:shadow-elegant ${
                    active ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-md bg-gradient-primary grid place-items-center shadow-glow">
                      <DynIcon name={roleIcons[r.key]} className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {r.label}
                        {active && <span className="text-[9px] font-mono uppercase tracking-widest text-primary">Current</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-2">
                        {r.modules.length} modules
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniTile({ icon: I, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 backdrop-blur p-2">
      <I className="h-3.5 w-3.5 text-white/80 mb-1" />
      <div className="text-sm font-display font-semibold">{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-white/60">{label}</div>
    </div>
  );
}
