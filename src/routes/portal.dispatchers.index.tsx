import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Headphones, PhoneCall, Radio } from "lucide-react";
import { ModuleGuard, ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { Input } from "@/components/ui/input";
import { DISPATCHERS } from "@/lib/dispatchers";

export const Route = createFileRoute("/portal/dispatchers/")({
  component: () => (
    <ModuleGuard module="dispatchers">
      <DispatchersPage />
    </ModuleGuard>
  ),
});

function statusChip(s: string) {
  return s === "On call"
    ? "text-primary border-primary/40 bg-primary/10"
    : s === "Available"
      ? "text-success border-success/40 bg-success/10"
      : "text-muted-foreground border-border bg-surface";
}

function DispatchersPage() {
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      DISPATCHERS.filter(
        (d) =>
          d.name.toLowerCase().includes(q.toLowerCase()) ||
          d.location.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  const onCall = DISPATCHERS.filter((d) => d.status === "On call").length;
  const available = DISPATCHERS.filter((d) => d.status === "Available").length;
  const total = DISPATCHERS.reduce((s, d) => s + d.calls, 0);

  return (
    <div>
      <ModuleHeader
        module="dispatchers"
        actions={
          <Link
            to="/portal/calls"
            className="text-xs px-3 py-1.5 rounded-md border border-border bg-card hover:border-primary/50 transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="h-3.5 w-3.5 text-primary" /> Call center
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="On duty" value={DISPATCHERS.length} icon="Headphones" tone="info" index={0} />
        <StatCard label="On call now" value={onCall} icon="PhoneCall" tone="warning" index={1} />
        <StatCard label="Available" value={available} icon="CircleCheck" tone="success" index={2} />
        <StatCard label="Calls this shift" value={total} icon="Activity" index={3} />
      </div>

      <Panel
        title="Dispatchers on duty"
        subtitle="Click any dispatcher for a full 360° profile"
        actions={
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or desk…"
              className="pl-8 h-8 text-xs"
            />
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Link
                to="/portal/dispatchers/$id"
                params={{ id: d.id }}
                className="group block rounded-lg border border-border bg-surface/50 p-4 hover:border-primary/60 hover:shadow-elegant transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
                    {d.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {d.location} · {d.desk}
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${statusChip(d.status)}`}>
                    {d.status}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-border/60">
                  <MetricCell label="Calls" value={d.calls} />
                  <MetricCell label="Active" value={d.active} mono />
                  <MetricCell label="Radio" value={d.channel} mono />
                  <MetricCell label="AHT" value={d.avgHandle} mono />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MetricCell({ label, value, mono = false }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div>
      <div className={`text-sm ${mono ? "font-mono" : "font-display font-semibold"} tabular-nums`}>{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
