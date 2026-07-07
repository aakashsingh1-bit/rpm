import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CREW, type CrewMember } from "@/lib/crew-data";
import { toast } from "sonner";
import { ArrowLeftRight, Users } from "lucide-react";

export const Route = createFileRoute("/portal/crew/assignments")({
  component: AssignmentsPage,
});

const UNITS = ["A-14", "A-07", "A-22", "A-31", "A-09", "A-11"];

function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Record<string, string>>(() =>
    Object.fromEntries(CREW.map((c) => [c.id, c.unit])),
  );

  const byUnit = useMemo(() => {
    const map: Record<string, CrewMember[]> = {};
    for (const u of UNITS) map[u] = [];
    for (const c of CREW) {
      const u = assignments[c.id];
      if (!map[u]) map[u] = [];
      map[u].push(c);
    }
    return map;
  }, [assignments]);

  const reassign = (memberId: string, unit: string) => {
    setAssignments((prev) => ({ ...prev, [memberId]: unit }));
    const member = CREW.find((c) => c.id === memberId);
    toast.success(`${member?.name} reassigned to ${unit}`);
  };

  const unassigned = CREW.filter((c) => c.duty === "Leave" || !assignments[c.id]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Ambulances" value={UNITS.length} icon="Ambulance" index={0} />
        <StatCard label="Assigned crew" value={CREW.filter((c) => c.duty === "On duty").length} icon="Users" tone="success" index={1} />
        <StatCard label="On leave" value={CREW.filter((c) => c.duty === "Leave").length} icon="Plane" tone="warning" index={2} />
        <StatCard label="Coverage" value="92%" icon="Percent" tone="info" index={3} />
      </div>

      <Panel title="Unit assignments" subtitle="Reassign crew between ambulances">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNITS.map((u, idx) => (
            <motion.div
              key={u}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * idx }}
              className="rounded-lg border border-border bg-surface/40 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-primary">Unit</div>
                  <div className="text-xl font-display font-semibold">{u}</div>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  byUnit[u].length >= 2 ? "text-success border-success/40 bg-success/10"
                    : byUnit[u].length === 1 ? "text-warning border-warning/40 bg-warning/10"
                    : "text-destructive border-destructive/40 bg-destructive/10"
                }`}>
                  {byUnit[u].length} crew
                </span>
              </div>
              <div className="space-y-2">
                {byUnit[u].length === 0 && (
                  <div className="text-xs text-muted-foreground italic">No crew assigned</div>
                )}
                {byUnit[u].map((c) => (
                  <div key={c.id} className="flex items-center gap-2 rounded border border-border/50 bg-card p-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-primary grid place-items-center text-[10px] font-semibold text-primary-foreground">
                      {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{c.role}</div>
                    </div>
                    <Select value={assignments[c.id]} onValueChange={(v) => reassign(c.id, v)}>
                      <SelectTrigger className="h-7 w-20 text-[10px] font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map((uu) => <SelectItem key={uu} value={uu} className="text-xs">{uu}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>

      <Panel title="Bulk actions" subtitle="Coverage & swaps">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.success("Coverage optimizer suggested 3 swaps")}>
            <ArrowLeftRight className="h-4 w-4 mr-2" /> Auto-balance units
          </Button>
          <Button variant="outline" onClick={() => toast("Coverage gap alert sent to supervisors")}>
            <Users className="h-4 w-4 mr-2" /> Report coverage gaps
          </Button>
        </div>
      </Panel>
    </div>
  );
}
