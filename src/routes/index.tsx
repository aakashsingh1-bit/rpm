import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Activity, Radio, HeartPulse } from "lucide-react";
import * as Icons from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ROLE_LIST, type Role } from "@/lib/rbac";
import { LOGO_URL } from "@/lib/assets";
import { Button } from "@/components/ui/button";
import { ECGLifeline } from "@/components/ECGLifeline";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

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

function Landing() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate({ to: "/portal" });
  }, [session, navigate]);

  const handlePick = (role: Role) => {
    if (role === "ambulance_crew") {
      navigate({ to: "/crew-app" });
      return;
    }
    navigate({ to: "/login", search: { role } });
  };

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      {/* ============ DARK TOP HEADER (only on landing top) ============ */}
      <header className="relative z-20 bg-gradient-dark-nav text-white">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-brand opacity-70" />
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-5">
          <div className="flex flex-col items-start gap-2">
          <img src={LOGO_URL} alt="RPM EMS Command" className="h-16 w-auto max-w-[280px] object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#modules" className="hover:text-white transition-colors">Modules</a>
            <a href="#roles" className="hover:text-white transition-colors">Roles</a>
            <a href="#lifeline" className="hover:text-white transition-colors">Lifeline</a>
          </nav>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
            <span className="pulse-dot relative flex h-2 w-2">
              <span className="pulse-ring bg-success/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs text-white/70">Platform online · 99.9% SLA</span>
          </div>
        </div>
      </header>

      {/* ============ HERO with ECG LIFELINE ============ */}
      <section id="lifeline" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-magenta/20 blur-3xl float-slow" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl float-slow" />

        {/* Full-width ECG behind the hero — anchored to the hero grid */}
        <ECGLifeline className="absolute inset-x-0 top-16 h-40 opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-14 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
              <HeartPulse className="h-3.5 w-3.5" />
              Enterprise CAD Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-semibold leading-[1.05] tracking-tight">
              Every second<br />
              <span className="text-gradient-brand">saves a life.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Unified command platform for RPM EMS operations — call intake, computer-aided
              dispatch, fleet, crew, ePCR, hospital handover, billing and AI analytics in a
              single, role-aware workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Stat label="Dispatch SLA" value="<10s" accent="red" />
              <Stat label="Modules" value="10" accent="blue" />
              <Stat label="Roles" value="8" accent="magenta" />
              <Stat label="Availability" value="99.9%" accent="teal" />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => handlePick("super_admin")}
                className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
              >
                Enter as Super Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Choose your role
              </Button>
            </div>
          </motion.div>

          {/* Command preview card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-card shadow-panel overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" />
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                  </div>
                  <span className="ml-2 text-xs font-mono text-muted-foreground">
                    cad.rpm.ae/live
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                  ● LIVE
                </span>
              </div>
              <div className="p-5 space-y-3">
                <IncidentRow priority="P1" title="Chest pain · Al Reem Island" eta="03:42" active />
                <IncidentRow priority="P2" title="RTA · Sheikh Zayed Rd" eta="06:18" />
                <IncidentRow priority="P3" title="IFT · Cleveland → SKMC" eta="12:04" />
                <IncidentRow priority="P1" title="Cardiac arrest · Yas Marina" eta="02:11" active />
              </div>
              <div className="p-5 border-t border-border grid grid-cols-3 gap-3 text-center">
                <MiniStat icon={Activity} label="Active" value="24" tint="red" />
                <MiniStat icon={Radio} label="Dispatched" value="17" tint="blue" />
                <MiniStat icon={ShieldCheck} label="On Scene" value="9" tint="teal" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ============ Role picker ============ */}
      <section id="roles" className="relative px-6 lg:px-10 py-16 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                Role-based access
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
                Sign in as
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Each portal is scoped to the modules your role needs. Super Admin sees the full
                platform, including user management and audit.
              </p>
            </div>
          </div>



          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLE_LIST.map((r, i) => {
              const grads = [
                "bg-gradient-primary",
                "bg-gradient-magenta",
                "bg-gradient-teal",
                "bg-gradient-pink",
                "bg-gradient-sunset",
              ];
              const g = grads[i % grads.length];
              return (
                <motion.button
                  key={r.key}
                  onClick={() => handlePick(r.key)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.04 * i, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="group text-left relative overflow-hidden rounded-xl border border-border bg-card p-5 hover:border-primary/60 hover:shadow-elegant transition-all"
                >
                  {r.key === "super_admin" && (
                    <div className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-widest bg-gradient-primary text-primary-foreground rounded px-1.5 py-0.5">
                      FULL
                    </div>
                  )}
                  <div className={`h-10 w-10 rounded-md ${g} grid place-items-center mb-4 shadow-glow`}>
                    <DynIcon name={roleIcons[r.key]} className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {r.description}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      {r.modules.length} modules
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border py-6 px-6 lg:px-10 bg-sidebar text-sidebar-foreground">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Response Plus Holding PJSC · Delivered by SISGAIN</div>
        </div>
      </footer>

    </div>
  );
}

function Stat({ label, value, accent = "red" }: { label: string; value: string; accent?: "red" | "blue" | "magenta" | "teal" }) {
  const bar = {
    red: "border-brand-red",
    blue: "border-brand-blue",
    magenta: "border-brand-magenta",
    teal: "border-brand-teal",
  }[accent];
  return (
    <div className={`border-l-2 ${bar} pl-3`}>
      <div className="text-xl md:text-2xl font-display font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function BrandTile({ value, label, gradient }: { value: string; label: string; gradient: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`relative overflow-hidden rounded-xl ${gradient} p-4 text-white shadow-elegant aspect-[4/5] flex flex-col justify-between`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_60%)]" />
      <div className="relative text-2xl md:text-3xl font-display font-bold">{value}</div>
      <div className="relative text-[11px] uppercase tracking-widest opacity-90">{label}</div>
    </motion.div>
  );
}

function MiniStat({ icon: I, label, value, tint = "red" }: { icon: Icons.LucideIcon; label: string; value: string; tint?: "red" | "blue" | "teal" }) {
  const c = { red: "text-brand-red", blue: "text-brand-blue", teal: "text-brand-teal" }[tint];
  return (
    <div className="rounded-md bg-surface border border-border p-3">
      <I className={`h-4 w-4 ${c} mx-auto mb-1`} />
      <div className="text-lg font-display font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function IncidentRow({
  priority,
  title,
  eta,
  active,
}: {
  priority: "P1" | "P2" | "P3";
  title: string;
  eta: string;
  active?: boolean;
}) {
  const color =
    priority === "P1"
      ? "bg-destructive/10 text-destructive border-destructive/30"
      : priority === "P2"
        ? "bg-warning/10 text-warning border-warning/40"
        : "bg-info/10 text-info border-info/30";
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
      <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${color}`}>
        {priority}
      </span>
      <span className="flex-1 text-sm truncate">{title}</span>
      {active && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      )}
      <span className="text-xs font-mono text-muted-foreground tabular-nums">{eta}</span>
    </div>
  );
}
