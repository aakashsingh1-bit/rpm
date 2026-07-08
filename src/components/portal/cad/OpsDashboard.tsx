import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, Ambulance, Clock, Users, PhoneCall, Headphones,
  AlertTriangle, Heart, ChevronDown, MapPin, Hospital, Radio,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import { DispatcherPanel } from "./DispatcherPanel";
import { DISPATCHERS } from "./dispatcherData";

type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const LIVE_CALLS = [
  { id: "MED-25-05124", timer: "00:01:32", type: "Cardiac Arrest",       priority: "CRITICAL" as Priority, address: "123 Main St, Downtown",       patient: "Male, 62 y/o",   crew: "A-01", dispatcher: "S. Ahmed",   state: "En Route",  icon: Heart },
  { id: "MED-25-05123", timer: "00:03:47", type: "Difficulty Breathing", priority: "HIGH" as Priority,     address: "456 Oak Ave, North District", patient: "Female, 45 y/o", crew: "A-07", dispatcher: "M. Karim",   state: "Dispatched", icon: AlertTriangle },
  { id: "MED-25-05122", timer: "00:06:15", type: "Chest Pain",           priority: "HIGH" as Priority,     address: "789 Pine Rd, East District",  patient: "Male, 55 y/o",   crew: "A-22", dispatcher: "L. Chen",    state: "On Scene",  icon: Heart },
  { id: "MED-25-05121", timer: "00:10:22", type: "Fall Injury",          priority: "MEDIUM" as Priority,   address: "321 Elm St, West District",   patient: "Female, 78 y/o", crew: "A-09", dispatcher: "S. Ahmed",   state: "Transporting", icon: ChevronDown },
];

const responseData = Array.from({ length: 24 }).map((_, i) => ({
  h: `${String(i).padStart(2, "0")}:00`,
  v: Math.round(6 + Math.sin(i / 3) * 2 + Math.random() * 2),
}));

const priorityChip: Record<Priority, string> = {
  CRITICAL: "bg-destructive text-destructive-foreground",
  HIGH:     "bg-warning text-white",
  MEDIUM:   "bg-info text-white",
  LOW:      "bg-muted text-muted-foreground",
};

export function OpsDashboard() {
  const availableDispatchers = DISPATCHERS.filter(d => d.status === "Available").length;
  const onCallDispatchers = DISPATCHERS.filter(d => d.status === "On Call").length;

  return (
    <div className="p-3 flex-1 min-h-0 overflow-y-auto space-y-3">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Operations · Command Overview</div>
        <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Full oversight of dispatchers, live emergency traffic, and fleet performance.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <OpsKpi label="Active Calls"      value={LIVE_CALLS.length.toString()} delta="+2" tone="danger"  icon={<Activity className="h-4 w-4" />} />
        <OpsKpi label="Dispatchers On"    value={`${onCallDispatchers + availableDispatchers}/${DISPATCHERS.length}`} delta={`${availableDispatchers} avail`} tone="info" icon={<Headphones className="h-4 w-4" />} />
        <OpsKpi label="Fleet on Road"     value="17/26" delta="+2"    tone="info"     icon={<Ambulance className="h-4 w-4" />} />
        <OpsKpi label="Avg Response"      value="6:42" delta="-18s"  tone="success"  icon={<Clock className="h-4 w-4" />} />
      </div>

      {/* Live calls + Response chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3">
        <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-primary" /> Live Calls · Dispatcher Assignments
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                LIVE
              </span>
              <Link to="/portal/cad/calls" className="text-[10px] font-semibold uppercase tracking-widest text-primary hover:underline">
                Open Calls →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-border">
            {LIVE_CALLS.map((c, idx) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * idx }}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${
                    c.priority === "CRITICAL" ? "bg-destructive/10 text-destructive" :
                    c.priority === "HIGH" ? "bg-warning/15 text-warning" : "bg-info/10 text-info"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-muted-foreground">{c.id}</span>
                      <span className="text-sm font-semibold text-foreground truncate">{c.type}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${priorityChip[c.priority]}`}>{c.priority}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">{c.state}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {c.address} · {c.patient}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Ambulance className="h-3 w-3" /> <span className="font-mono text-foreground">{c.crew}</span></span>
                      <span className="flex items-center gap-1"><Headphones className="h-3 w-3" /> <span className="text-foreground">{c.dispatcher}</span></span>
                    </div>
                  </div>
                  <div className="text-sm font-mono tabular-nums text-foreground">{c.timer}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-4 flex flex-col">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Response Time · 24h</div>
          <div className="text-xs text-muted-foreground mb-3">Rolling average (minutes)</div>
          <div className="h-48 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={responseData}>
                <defs>
                  <linearGradient id="opsg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 25)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.58 0.22 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="h" tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <RTooltip contentStyle={{ background: "oklch(0.20 0.013 20)", border: "1px solid oklch(0.3 0.01 20)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.68 0.22 25)" strokeWidth={2} fill="url(#opsg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border">
            <MiniKpi label="P1" value="4:12" />
            <MiniKpi label="P2" value="7:38" />
            <MiniKpi label="P3" value="14:20" />
          </div>
        </div>
      </div>

      {/* Dispatcher panel */}
      <DispatcherPanel />

      {/* Quick jumps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickLink to="/portal/cad/calls"       icon={<PhoneCall className="h-4 w-4" />} label="Call Center" sub="History & filters" />
        <QuickLink to="/portal/cad/dispatchers" icon={<Users className="h-4 w-4" />}     label="Dispatchers" sub="Manage floor" />
        <QuickLink to="/portal/cad/fleet"       icon={<Ambulance className="h-4 w-4" />} label="Fleet"       sub="Live vehicles" />
        <QuickLink to="/portal/cad/hospital"    icon={<Hospital className="h-4 w-4" />}  label="Hospitals"   sub="Coordination" />
      </div>
    </div>
  );
}

function OpsKpi({ label, value, delta, tone, icon }: { label: string; value: string; delta?: string; tone: "danger" | "info" | "success" | "default"; icon: React.ReactNode }) {
  const toneClass =
    tone === "danger"  ? "text-destructive bg-destructive/10 border-destructive/30" :
    tone === "info"    ? "text-info bg-info/10 border-info/30" :
    tone === "success" ? "text-success bg-success/10 border-success/30" :
                         "text-foreground bg-muted border-border";
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-4">
      <div className="flex items-center justify-between">
        <span className={`h-8 w-8 grid place-items-center rounded-md border ${toneClass}`}>{icon}</span>
        {delta && <span className="text-[10px] font-mono text-muted-foreground">{delta}</span>}
      </div>
      <div className="text-2xl font-display font-bold tabular-nums mt-3">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
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

function QuickLink({ to, icon, label, sub }: { to: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <Link to={to} className="rounded-xl border border-border bg-card shadow-sm p-4 hover:border-primary/60 hover:shadow-elegant transition-all group">
      <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/30 grid place-items-center text-primary mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </Link>
  );
}
