import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft, PhoneCall, Radio, Mail, Phone, Clock, Award, Languages,
  UserCog, MessageSquare, Headphones, PlayCircle,
} from "lucide-react";
import { ModuleGuard, Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { getDispatcher, DISPATCHERS } from "@/lib/dispatchers";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/dispatchers/$id")({
  component: () => (
    <ModuleGuard module="dispatchers">
      <DispatcherProfilePage />
    </ModuleGuard>
  ),
});

function DispatcherProfilePage() {
  const { id } = useParams({ from: "/portal/dispatchers/$id" });
  const navigate = useNavigate();
  const d = getDispatcher(id);

  if (!d) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h2 className="text-xl font-display font-semibold">Dispatcher not found</h2>
        <Button className="mt-6" onClick={() => navigate({ to: "/portal/dispatchers" })}>
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/portal/dispatchers"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All dispatchers
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-lg font-semibold shadow-glow">
              {d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
                {d.employeeId} · Emergency Dispatcher
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">
                {d.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {d.location} · {d.desk} · Supervisor: {d.supervisor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast(`Radio call → ${d.name} on ${d.channel}`)}>
              <Radio className="h-4 w-4 mr-2" /> Radio
            </Button>
            <Button variant="outline" onClick={() => toast(`Message sent to ${d.name}`)}>
              <MessageSquare className="h-4 w-4 mr-2" /> Message
            </Button>
            <Button className="bg-gradient-primary text-primary-foreground" onClick={() => toast(`Barging into call on ${d.channel}`)}>
              <Headphones className="h-4 w-4 mr-2" /> Monitor call
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Calls this shift" value={d.calls} icon="PhoneCall" tone="info" index={0} />
        <StatCard label="Avg handle time" value={d.avgHandle} icon="Clock" tone="success" index={1} />
        <StatCard label="Status" value={d.status} icon="Activity" tone={d.status === "On call" ? "warning" : "default"} index={2} />
        <StatCard label="Channel" value={d.channel} icon="Radio" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="space-y-6">
          <Panel title="Recent calls" subtitle="Latest handled today · click to open incident">
            <div className="divide-y divide-border/60 -mx-5">
              {d.recentCalls.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-accent/30 transition-colors"
                >
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      c.priority === "P1"
                        ? "text-destructive border-destructive/40 bg-destructive/10"
                        : c.priority === "P2"
                          ? "text-warning border-warning/40 bg-warning/10"
                          : "text-info border-info/40 bg-info/10"
                    }`}
                  >
                    {c.priority}
                  </span>
                  <div className="text-xs font-mono text-muted-foreground w-14">{c.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.type} · {c.caller}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.location}</div>
                  </div>
                  <div className="hidden md:block text-xs text-muted-foreground w-14 text-right font-mono">{c.duration}</div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-surface text-muted-foreground w-20 text-center">
                    {c.outcome}
                  </span>
                  {c.incident ? (
                    <Link
                      to="/portal/cad"
                      className="text-[10px] font-mono text-primary hover:underline w-20 text-right"
                    >
                      {c.incident} →
                    </Link>
                  ) : (
                    <button
                      onClick={() => toast(`Playing recording ${c.id}`)}
                      className="text-primary hover:text-primary/80"
                      title="Play recording"
                    >
                      <PlayCircle className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </Panel>

          <Panel title="Performance · this shift">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PerfCell label="Answered" value={d.calls} />
              <PerfCell label="Dispatched" value={Math.round(d.calls * 0.72)} />
              <PerfCell label="Advice only" value={Math.round(d.calls * 0.18)} />
              <PerfCell label="Transferred" value={Math.round(d.calls * 0.1)} />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Contact & shift">
            <dl className="space-y-3 text-sm">
              <Row icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={d.phone} />
              <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={d.email} />
              <Row icon={<Radio className="h-3.5 w-3.5" />} label="Radio channel" value={d.channel} mono />
              <Row icon={<Clock className="h-3.5 w-3.5" />} label="Shift" value={`${d.shiftStart} – ${d.shiftEnd}`} mono />
              <Row icon={<UserCog className="h-3.5 w-3.5" />} label="Supervisor" value={d.supervisor} />
            </dl>
          </Panel>

          <Panel title="Certifications & languages">
            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <Award className="h-3 w-3" /> Certifications
              </div>
              <div className="flex flex-wrap gap-1.5">
                {d.certifications.map((c) => (
                  <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <Languages className="h-3 w-3" /> Languages
              </div>
              <div className="flex flex-wrap gap-1.5">
                {d.languages.map((l) => (
                  <span key={l} className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </Panel>

          {d.active !== "—" && (
            <Panel title="Active incident">
              <Link
                to="/portal/cad"
                className="block rounded-lg border border-primary/40 bg-primary/5 p-4 hover:bg-primary/10 transition-colors"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1">Currently handling</div>
                <div className="font-mono font-semibold text-lg text-primary">{d.active}</div>
                <div className="text-xs text-muted-foreground mt-1">Open incident in CAD →</div>
              </Link>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value, mono = false }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground flex items-center gap-1.5">{icon} {label}</dt>
      <dd className={`text-sm ${mono ? "font-mono" : ""} truncate`}>{value}</dd>
    </div>
  );
}

function PerfCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-3 text-center">
      <div className="text-2xl font-display font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
