import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { IFT, HOSPITALS } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/hospital/ift")({
  component: IftPage,
});

function IftPage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ModuleHeader
        module="hospital"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" /> New transfer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create transfer request</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">From hospital</Label><Input defaultValue="Sheikh Khalifa Medical City" className="h-9 mt-1" /></div>
                <div><Label className="text-xs">To hospital</Label><Input defaultValue="Cleveland Clinic AD · Cath Lab" className="h-9 mt-1" /></div>
                <div><Label className="text-xs">Patient</Label><Input placeholder="Khalid Al Nuaimi" className="h-9 mt-1" /></div>
                <div><Label className="text-xs">Requested time</Label><Input placeholder="14:30" className="h-9 mt-1" /></div>
                <div className="col-span-2"><Label className="text-xs">Reason / summary</Label><Input placeholder="Post-stroke transfer for neuro workup" className="h-9 mt-1" /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { toast.success("IFT request submitted to CAD"); setOpen(false); }} className="bg-gradient-primary text-primary-foreground">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Panel title="Inter-facility transfers" subtitle="Scheduled and in-progress patient transfers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3">Ref</th>
                <th className="text-left py-2 pr-3">From</th>
                <th className="text-left py-2 pr-3">To</th>
                <th className="text-left py-2 pr-3">Patient</th>
                <th className="text-left py-2 pr-3">Priority</th>
                <th className="text-left py-2 pr-3">Ambulance</th>
                <th className="text-left py-2 pr-3">ETA</th>
                <th className="text-left py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {IFT.map((t) => (
                <tr key={t.id} className="border-b border-border/60 hover:bg-surface/40">
                  <td className="py-3 pr-3 font-mono text-primary text-xs">{t.id}</td>
                  <td className="py-3 pr-3 text-xs">{t.from}</td>
                  <td className="py-3 pr-3 text-xs flex items-center gap-1">{t.to}</td>
                  <td className="py-3 pr-3 text-xs">{t.pt}</td>
                  <td className="py-3 pr-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      t.priority === "P2" ? "text-warning border-warning/40 bg-warning/10" : "text-info border-info/40 bg-info/10"
                    }`}>{t.priority}</span>
                  </td>
                  <td className="py-3 pr-3 font-mono text-xs">{t.unit}</td>
                  <td className="py-3 pr-3 font-mono text-xs">{t.when}</td>
                  <td className="py-3 pr-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      t.status === "En route" ? "text-warning border-warning/40 bg-warning/10"
                        : t.status === "Confirmed" ? "text-success border-success/40 bg-success/10"
                        : "text-muted-foreground border-border"
                    }`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Receiving hospitals" subtitle="Availability at destination" className="mt-6">
        <div className="grid md:grid-cols-2 gap-3">
          {HOSPITALS.map((h) => (
            <div key={h.name} className="rounded-lg border border-border bg-surface/40 p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{h.name}</div>
                <div className="text-[11px] text-muted-foreground">{h.spec} · {h.beds.free} beds free</div>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                h.status === "Divert" ? "text-destructive border-destructive/40 bg-destructive/10" : "text-success border-success/40 bg-success/10"
              }`}>{h.status}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
