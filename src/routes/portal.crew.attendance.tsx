import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { CREW, type DutyStatus } from "@/lib/crew-data";
import { Clock, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/crew/attendance")({
  component: AttendancePage,
});

const DUTY_OPTIONS: DutyStatus[] = ["On duty", "Off duty", "Break", "Training"];

function AttendancePage() {
  const [duty, setDuty] = useState<Record<string, DutyStatus>>(() =>
    Object.fromEntries(CREW.map((c) => [c.id, c.duty])),
  );
  const [clockIn, setClockIn] = useState<Record<string, string | undefined>>(() =>
    Object.fromEntries(CREW.map((c) => [c.id, c.clockedInAt])),
  );

  const set = (id: string, next: DutyStatus) => {
    setDuty((p) => ({ ...p, [id]: next }));
    const name = CREW.find((c) => c.id === id)?.name;
    toast.success(`${name} · ${next}`);
    if (next === "On duty" && !clockIn[id]) {
      const t = new Date().toTimeString().slice(0, 5);
      setClockIn((p) => ({ ...p, [id]: t }));
    }
    if (next === "Off duty") setClockIn((p) => ({ ...p, [id]: undefined }));
  };

  const onDuty = Object.values(duty).filter((d) => d === "On duty").length;
  const onBreak = Object.values(duty).filter((d) => d === "Break").length;
  const offDuty = Object.values(duty).filter((d) => d === "Off duty").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="On duty" value={onDuty} tone="success" icon="UserCheck" index={0} />
        <StatCard label="On break" value={onBreak} tone="warning" icon="Coffee" index={1} />
        <StatCard label="Off duty" value={offDuty} icon="Moon" index={2} />
        <StatCard label="Attendance today" value="98%" tone="info" icon="Percent" index={3} />
      </div>

      <Panel title="Live duty board" subtitle="Clock-in status and duty controls">
        <div className="grid md:grid-cols-2 gap-2">
          {CREW.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 * i }}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface/40 p-3"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-[11px] font-semibold text-primary-foreground">
                {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <Link to="/portal/crew/$id" params={{ id: c.id }} className="text-sm font-medium hover:text-primary transition-colors truncate block">
                  {c.name}
                </Link>
                <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                  <span>{c.role} · {c.unit}</span>
                  {clockIn[c.id] && (
                    <span className="font-mono flex items-center gap-1"><Clock className="h-3 w-3" /> in {clockIn[c.id]}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {DUTY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => set(c.id, opt)}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                      duty[c.id] === opt
                        ? opt === "On duty" ? "text-success border-success/40 bg-success/10"
                          : opt === "Break" ? "text-warning border-warning/40 bg-warning/10"
                          : opt === "Training" ? "text-info border-info/40 bg-info/10"
                          : "text-primary border-primary/40 bg-primary/10"
                        : "text-muted-foreground border-border hover:border-primary/30"
                    }`}
                    title={opt}
                  >
                    {opt.slice(0, 3)}
                  </button>
                ))}
              </div>
              {clockIn[c.id] ? (
                <Button size="sm" variant="outline" onClick={() => set(c.id, "Off duty")}>
                  <LogOut className="h-3.5 w-3.5 mr-1" /> Out
                </Button>
              ) : (
                <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => set(c.id, "On duty")}>
                  <LogIn className="h-3.5 w-3.5 mr-1" /> In
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
