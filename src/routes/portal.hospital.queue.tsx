import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ClipboardCheck, FileText, Search } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INCOMING } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/hospital/queue")({
  component: QueuePage,
});

function QueuePage() {
  const [q, setQ] = useState("");
  const filtered = INCOMING.filter((r) => `${r.patient.name} ${r.incident} ${r.cond}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <ModuleHeader module="hospital" actions={<span className="text-[10px] font-mono uppercase tracking-widest text-primary">Patient Queue</span>} />
      <Panel
        title="All expected patients"
        subtitle="Prioritised queue with actions"
        actions={
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients, incidents…" className="pl-7 h-8 text-xs" />
          </div>
        }
      >
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.incident} className="rounded-lg border border-border bg-surface/40 p-3 flex flex-wrap items-center gap-3">
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                r.priority === "P1" ? "text-destructive border-destructive/40 bg-destructive/10"
                  : r.priority === "P2" ? "text-warning border-warning/40 bg-warning/10"
                  : "text-info border-info/40 bg-info/10"
              }`}>{r.priority}</span>
              <div className="min-w-[220px] flex-1">
                <div className="text-sm font-medium">{r.patient.name} · {r.patient.age}{r.patient.gender}</div>
                <div className="text-[11px] text-muted-foreground">{r.incident} · {r.patient.complaint}</div>
              </div>
              <div className="text-xs font-mono text-primary">ETA {r.eta}</div>
              <div className="text-[11px] text-muted-foreground">Unit {r.unit}</div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                r.status === "En route" ? "text-warning border-warning/40 bg-warning/10"
                  : r.status === "On scene" ? "text-info border-info/40 bg-info/10"
                  : "text-muted-foreground border-border bg-surface"
              }`}>{r.status}</span>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => toast.success(`${r.patient.name} accepted`)}>
                  <Check className="h-3 w-3 mr-1" /> Accept
                </Button>
                <Link to="/portal/hospital/handover" className="text-[11px] px-2 py-1 rounded bg-gradient-primary text-primary-foreground flex items-center gap-1">
                  <ClipboardCheck className="h-3 w-3" /> Handover
                </Link>
                <Link to="/portal/hospital/epcr-viewer" search={{ patient: r.incident }} className="text-[11px] px-2 py-1 rounded border border-border hover:border-primary/50 flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Open ePCR
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
