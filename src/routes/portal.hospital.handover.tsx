import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { HeartPulse, ClipboardCheck, ArrowRight } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { INCOMING } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/hospital/handover")({
  component: HandoverPage,
});

function HandoverPage() {
  const [selectedId, setSelectedId] = useState(INCOMING[0].incident);
  const active = INCOMING.find((r) => r.incident === selectedId) ?? INCOMING[0];
  const [ack, setAck] = useState(false);
  const [receiver, setReceiver] = useState("Dr. Reem Al Suwaidi");

  const complete = () => {
    if (!ack) return toast.error("Digital acknowledgement required");
    toast.success(`${active.incident} handover completed by ${receiver}`);
  };

  return (
    <div>
      <ModuleHeader module="hospital" actions={<Link to="/portal/hospital/epcr-viewer" className="text-xs px-3 py-1.5 rounded-md border border-border bg-card hover:border-primary/50">View ePCR</Link>} />

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Panel title="Select patient" subtitle="Awaiting handover">
          <div className="space-y-1.5">
            {INCOMING.map((r) => (
              <button key={r.incident} onClick={() => setSelectedId(r.incident)}
                className={`w-full text-left rounded-md border p-2.5 transition-all ${
                  active.incident === r.incident ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/40"
                }`}>
                <div className="text-xs font-medium">{r.patient.name}</div>
                <div className="text-[10px] text-muted-foreground">{r.incident} · Unit {r.unit} · {r.priority}</div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Incident information">
            <div className="grid md:grid-cols-4 gap-3 text-xs">
              <Field label="Incident #" value={active.incident} />
              <Field label="Dispatch time" value="09:04" />
              <Field label="Ambulance" value={active.unit} />
              <Field label="Crew members" value={active.crew} />
            </div>
          </Panel>

          <Panel title="Patient summary">
            <div className="grid md:grid-cols-4 gap-3 text-xs mb-3">
              <Field label="Name" value={active.patient.name} />
              <Field label="Age / Gender" value={`${active.patient.age} · ${active.patient.gender}`} />
              <Field label="Priority" value={active.priority} />
              <Field label="Chief complaint" value={active.patient.complaint} />
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <Field label="Allergies" value="Penicillin" />
              <Field label="Medical history" value="HTN · Type II DM" />
            </div>
          </Panel>

          <Panel title="Clinical summary" actions={<HeartPulse className="h-4 w-4 text-destructive" />}>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <Field label="Treatments provided" value="Oxygen 15L NRM · IV access · 12-lead ECG" />
              <Field label="Procedures performed" value="Cardiac monitoring · Splinting" />
              <Field label="Medications administered" value="Aspirin 300mg PO · GTN 400mcg SL · Morphine 5mg IV" />
              <Field label="Latest vitals" value={active.vitals} />
            </div>
          </Panel>

          <Panel title="Handover" subtitle="Digital receipt & acknowledgement">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Receiving doctor / nurse</Label>
                <Input className="h-9 mt-1" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Handover time</Label>
                <Input className="h-9 mt-1" defaultValue={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Clinical notes</Label>
                <Textarea rows={3} className="mt-1 text-xs" placeholder="Additional clinical notes…" />
              </div>
              <label className="md:col-span-2 flex items-center gap-2 text-xs cursor-pointer">
                <Checkbox checked={ack} onCheckedChange={(v) => setAck(!!v)} />
                Digital acknowledgement — I confirm patient handover received and clinical information reviewed.
              </label>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button onClick={complete} className="bg-gradient-primary text-primary-foreground shadow-glow">
                <ClipboardCheck className="h-4 w-4 mr-2" /> Complete handover
              </Button>
              <Link to="/portal/hospital/queue" className="text-xs px-3 py-2 rounded-md border border-border hover:border-primary/50 flex items-center gap-1">Back to queue <ArrowRight className="h-3 w-3" /></Link>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface/40 p-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-xs mt-0.5">{value}</div>
    </div>
  );
}
