import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  Clock,
  HeartPulse,
  PhoneCall,
  Radio,
  Users,
} from "lucide-react";
import { useAuth, useRoleDef } from "@/lib/auth";
import { DISPATCHERS as dispatchers } from "@/lib/dispatchers";
import { StatCard, Panel, DynIcon } from "@/components/portal/Module";
import { MODULES, type ModuleKey } from "@/lib/rbac";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/portal/")({
  component: Dashboard,
});

const responseData = Array.from({ length: 24 }).map((_, i) => ({
  h: `${String(i).padStart(2, "0")}:00`,
  v: Math.round(6 + Math.sin(i / 3) * 2 + Math.random() * 2),
}));

const liveIncidents = [
  { id: "INC-8842", p: "P1", type: "Cardiac arrest", loc: "Yas Marina, AD", crew: "A-14", eta: "02:11", state: "En route" },
  { id: "INC-8841", p: "P1", type: "Chest pain", loc: "Al Reem Island", crew: "A-07", eta: "03:42", state: "En route" },
  { id: "INC-8840", p: "P2", type: "RTA · 2 pax", loc: "Sheikh Zayed Rd km 42", crew: "A-22", eta: "06:18", state: "Assigned" },
  { id: "INC-8839", p: "P3", type: "IFT · SKMC", loc: "Cleveland Clinic AD", crew: "A-31", eta: "12:04", state: "On scene" },
  { id: "INC-8838", p: "P2", type: "Fall injury", loc: "Marina Mall", crew: "A-09", eta: "00:00", state: "Handover" },
];



function Dashboard() {
  const { session } = useAuth();
  const role = useRoleDef();
  const navigate = useNavigate();

  useEffect(() => {
    if (role && !role.modules.includes("dashboard")) {
      const first = role.modules[0];
      if (first) navigate({ to: MODULES[first].path, replace: true });
    }
  }, [role, navigate]);

  if (!session || !role) return null;
  if (!role.modules.includes("dashboard")) return null;

  const allowed = role.modules.filter((m) => m !== "dashboard") as ModuleKey[];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between flex-wrap gap-4"
      >
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
            {role.label} · {session.station}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
            Good shift, {session.name.split(" ")[0]}.
          </h1>
          <p className="text-muted-foreground mt-1">
            {allowed.length} module{allowed.length === 1 ? "" : "s"} available to your role · Live
            operational data below.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Shift time</div>
          <div className="font-mono text-xl text-foreground">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active incidents" value="24" delta="+3" icon="Activity" tone="danger" index={0} />
        <StatCard label="Ambulances on road" value="17/26" delta="+2" icon="Ambulance" tone="info" index={1} />
        <StatCard label="Avg response" value="6:42" delta="-18s" icon="Clock" tone="success" index={2} />
        <StatCard label="Crews on shift" value="52" icon="Users" tone="default" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Live incidents */}
        <Panel
          title="Live incidents"
          subtitle="Real-time CAD feed · WebSocket"
          actions={
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              LIVE
            </div>
          }
        >
          <div className="divide-y divide-border/60 -mx-5">
            {liveIncidents.map((i, idx) => {
              const color =
                i.p === "P1"
                  ? "text-destructive border-destructive/40 bg-destructive/10"
                  : i.p === "P2"
                    ? "text-warning border-warning/40 bg-warning/10"
                    : "text-info border-info/40 bg-info/10";
              return (
                <motion.div
                  key={i.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx }}
                >
                  <Link
                    to="/portal/cad"
                    className="flex items-center gap-4 px-5 py-3 hover:bg-accent/40 transition-colors group"
                  >
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${color}`}
                    >
                      {i.p}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        <span className="text-[10px] font-mono text-muted-foreground mr-2">{i.id}</span>
                        {i.type}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{i.loc}</div>
                    </div>
                    <div className="hidden md:block text-xs font-mono text-muted-foreground">
                      {i.crew}
                    </div>
                    <div className="hidden md:block text-xs">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-surface border border-border text-muted-foreground">
                        {i.state}
                      </span>
                    </div>
                    <div className="text-sm font-mono tabular-nums text-foreground">{i.eta}</div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Panel>

        {/* Response trend */}
        <Panel
          title="Response time · 24h"
          subtitle="Rolling average (minutes)"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 25)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.58 0.22 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="h" tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <RTooltip
                  contentStyle={{
                    background: "oklch(0.20 0.013 20)",
                    border: "1px solid oklch(0.3 0.01 20)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="v" stroke="oklch(0.68 0.22 25)" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            <MiniKpi label="P1" value="4:12" />
            <MiniKpi label="P2" value="7:38" />
            <MiniKpi label="P3" value="14:20" />
          </div>
        </Panel>
      </div>

      {/* Dispatchers on duty */}
      {(role.key === "super_admin" || role.key === "ops_manager") && (
        <Panel
          title="Dispatchers on duty"
          subtitle="Live desk activity · location · calls taken this shift"
          actions={
            <Link to="/portal/dispatchers" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">
              Open dispatchers →
            </Link>
          }
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {dispatchers.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Link
                  to="/portal/dispatchers/$id"
                  params={{ id: d.id }}
                  className="block rounded-lg border border-border bg-surface/50 p-3 hover:border-primary/60 hover:shadow-elegant transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
                      {d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{d.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{d.location} · {d.desk}</div>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      d.status === "On call"
                        ? "text-primary border-primary/40 bg-primary/10"
                        : d.status === "Available"
                          ? "text-success border-success/40 bg-success/10"
                          : "text-muted-foreground border-border bg-surface"
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border/60">
                    <div>
                      <div className="text-lg font-display font-semibold tabular-nums">{d.calls}</div>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Calls</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono truncate">{d.active}</div>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Active</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono">{d.channel}</div>
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Radio</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Panel>
      )}


      {/* Module grid */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold">Your modules</h2>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            RBAC · {role.shortLabel}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allowed.map((k, i) => {
            const m = MODULES[k];
            return (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                <Link
                  to={m.path}
                  className="group block relative overflow-hidden rounded-xl border border-border bg-card p-5 hover:border-primary/60 hover:shadow-elegant transition-all"
                >
                  <div className="h-10 w-10 rounded-md bg-primary/10 border border-primary/30 grid place-items-center mb-4 group-hover:bg-gradient-primary group-hover:border-transparent transition-all">
                    <DynIcon
                      name={m.icon}
                      className="h-5 w-5 text-primary group-hover:text-primary-foreground"
                    />
                  </div>
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.tagline}</div>
                  <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {m.code}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-lg font-display font-semibold tabular-nums mt-1">{value}</div>
    </div>
  );
}
