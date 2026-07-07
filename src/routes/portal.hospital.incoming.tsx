import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, FileText, Phone, User } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { INCOMING } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/hospital/incoming")({
  component: IncomingPage,
});

function IncomingPage() {
  return (
    <div>
      <ModuleHeader module="hospital" actions={<span className="text-[10px] font-mono uppercase tracking-widest text-primary">Live · CAD sync</span>} />
      <Panel title="Incoming ambulances" subtitle="Units currently assigned to this hospital">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3">Ambulance</th>
                <th className="text-left py-2 pr-3">Incident</th>
                <th className="text-left py-2 pr-3">Priority</th>
                <th className="text-left py-2 pr-3">Patient</th>
                <th className="text-left py-2 pr-3">Crew</th>
                <th className="text-left py-2 pr-3">ETA</th>
                <th className="text-left py-2 pr-3">Status</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {INCOMING.map((r, i) => (
                <motion.tr key={r.incident} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-border/60 hover:bg-surface/40">
                  <td className="py-3 pr-3 font-mono text-primary">{r.unit}</td>
                  <td className="py-3 pr-3 font-mono text-xs">{r.incident}</td>
                  <td className="py-3 pr-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      r.priority === "P1" ? "text-destructive border-destructive/40 bg-destructive/10"
                        : r.priority === "P2" ? "text-warning border-warning/40 bg-warning/10"
                        : "text-info border-info/40 bg-info/10"
                    }`}>{r.priority}</span>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="text-sm">{r.patient.name}</div>
                    <div className="text-[11px] text-muted-foreground">{r.patient.age}{r.patient.gender} · {r.patient.complaint}</div>
                  </td>
                  <td className="py-3 pr-3 text-xs">{r.crew}</td>
                  <td className="py-3 pr-3 font-mono text-xs flex items-center gap-1"><Clock className="h-3 w-3 text-primary" />{r.eta}</td>
                  <td className="py-3 pr-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      r.status === "En route" ? "text-warning border-warning/40 bg-warning/10"
                        : r.status === "On scene" ? "text-info border-info/40 bg-info/10"
                        : "text-muted-foreground border-border bg-surface"
                    }`}>{r.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link to="/portal/hospital/epcr-viewer" search={{ patient: r.incident }} className="text-[11px] px-2 py-1 rounded border border-border hover:border-primary/50 flex items-center gap-1"><FileText className="h-3 w-3" /> Open ePCR</Link>
                      <Link to="/portal/hospital/handover" className="text-[11px] px-2 py-1 rounded border border-border hover:border-primary/50 flex items-center gap-1"><User className="h-3 w-3" /> Record</Link>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => toast(`Calling dispatcher ${r.dispatcher}`)}><Phone className="h-3 w-3 mr-1" /> Dispatcher</Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
