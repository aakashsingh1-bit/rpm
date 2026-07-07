import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Panel, StatCard } from "@/components/portal/Module";
import { CREW, LEAVE_REQUESTS, certStats } from "@/lib/crew-data";
import { AlertTriangle, Award, ArrowRight, Calendar, UserCheck } from "lucide-react";

export const Route = createFileRoute("/portal/crew/")({
  component: CrewDashboard,
});

const shifts = [
  { day: "Mon", d: 22, n: 18 },
  { day: "Tue", d: 24, n: 19 },
  { day: "Wed", d: 26, n: 20 },
  { day: "Thu", d: 25, n: 20 },
  { day: "Fri", d: 20, n: 22 },
  { day: "Sat", d: 18, n: 24 },
  { day: "Sun", d: 19, n: 21 },
];

function CrewDashboard() {
  const onDuty = CREW.filter((c) => c.duty === "On duty").length;
  const onLeave = CREW.filter((c) => c.duty === "Leave").length;
  const stats = certStats();
  const pendingLeave = LEAVE_REQUESTS.filter((l) => l.status === "Pending");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total crew" value={CREW.length} icon="Users" index={0} />
        <StatCard label="On duty" value={onDuty} tone="success" icon="UserCheck" index={1} />
        <StatCard label="Certs expiring" value={stats.expiring + stats.expired} tone="warning" icon="Award" index={2} />
        <StatCard label="Pending leave" value={pendingLeave.length} tone="info" icon="Plane" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Panel
          title="On-duty crew"
          subtitle="Active personnel with unit assignments"
          actions={
            <Link to="/portal/crew/directory" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">
              Full directory →
            </Link>
          }
        >
          <div className="space-y-2">
            {CREW.filter((c) => c.duty === "On duty").slice(0, 6).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to="/portal/crew/$id"
                  params={{ id: c.id }}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface/40 p-3 hover:border-primary/60 hover:shadow-elegant transition-all group"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-[11px] font-semibold text-primary-foreground">
                    {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.role} · {c.station}</div>
                  </div>
                  <div className="text-xs font-mono text-primary">{c.unit}</div>
                  <div className="w-16">
                    <div className="text-[10px] font-mono text-right mb-0.5">{c.perf}%</div>
                    <div className="h-1 rounded-full bg-background overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${c.perf}%` }} />
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </Panel>

        <Panel title="Weekly roster" subtitle="Day / night distribution" actions={
          <Link to="/portal/crew/roster" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">
            Full roster →
          </Link>
        }>
          <div className="space-y-3">
            {shifts.map((s, i) => (
              <motion.div key={s.day} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-muted-foreground">{s.day}</span>
                  <span className="font-mono">{s.d + s.n}</span>
                </div>
                <div className="flex gap-1 h-2">
                  <div className="h-full rounded-l bg-gradient-primary" style={{ width: `${(s.d / 50) * 100}%` }} />
                  <div className="h-full rounded-r bg-info/60" style={{ width: `${(s.n / 50) * 100}%` }} />
                </div>
              </motion.div>
            ))}
            <div className="flex items-center gap-4 pt-3 border-t border-border text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-gradient-primary" /> Day</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-info/60" /> Night</div>
              <div className="ml-auto flex items-center gap-1"><Calendar className="h-3 w-3" /> Sprint 6</div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Alerts" subtitle="Certifications & workforce issues">
          <div className="space-y-2">
            {stats.all.filter((c) => c.status !== "Valid").slice(0, 5).map((c, i) => (
              <div key={`${c.memberId}-${c.name}`} className={`flex items-center gap-3 rounded-md border p-3 ${
                c.status === "Expired" ? "border-destructive/40 bg-destructive/5" : "border-warning/40 bg-warning/5"
              }`}>
                <AlertTriangle className={`h-4 w-4 ${c.status === "Expired" ? "text-destructive" : "text-warning"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name} · {c.member}</div>
                  <div className="text-xs text-muted-foreground">{c.status} · expires {c.expires}</div>
                </div>
                <Link to="/portal/crew/$id" params={{ id: c.memberId }} className="text-[10px] font-mono text-primary hover:underline">
                  Open →
                </Link>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Pending leave requests" subtitle="Awaiting approval" actions={
          <Link to="/portal/crew/leave" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">
            Manage →
          </Link>
        }>
          <div className="space-y-2">
            {pendingLeave.map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-md border border-border p-3">
                <UserCheck className="h-4 w-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.memberName}</div>
                  <div className="text-xs text-muted-foreground">{l.type} · {l.from} → {l.to} · {l.days}d</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-warning/40 bg-warning/10 text-warning">
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
