import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Phone, PhoneOff, PhoneForwarded, Mic, MicOff, Volume2, MapPin, User, Truck, Hospital,
  Radio, Clock, Send, Navigation, Circle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/portal/cad/calls/active")({
  component: ActiveCallPage,
});

interface ActiveCall {
  id: string;
  caller: string;
  number: string;
  type: string;
  address?: string;
  patient?: string;
}

const DEFAULT_CALL: ActiveCall = {
  id: "CALL-9031",
  caller: "Anonymous",
  number: "+971 50 ••• 4421",
  type: "Traffic Accident",
  address: "",
  patient: "",
};

interface FleetOpt {
  id: string;
  label: string;
  kind: "ALS" | "BLS";
  station: string;
  distanceMi: number;
  etaMin: number;
  driver: string;
  driverPhone: string;
  available: boolean;
}

const FLEET_OPTIONS: FleetOpt[] = [
  { id: "A-01", kind: "ALS", station: "Sheikh Zayed Rd", distanceMi: 0.8, etaMin: 2, driver: "Mike Johnson",  driverPhone: "+971 50 111 0101", available: true,  label: "A-01 · ALS · Sheikh Zayed Rd · 0.8 mi" },
  { id: "B-02", kind: "BLS", station: "Jumeirah Beach Rd", distanceMi: 1.3, etaMin: 4, driver: "Chris Lee",   driverPhone: "+971 50 111 0202", available: true,  label: "B-02 · BLS · Jumeirah Beach Rd · 1.3 mi" },
  { id: "M-05", kind: "ALS", station: "Station 3",        distanceMi: 2.0, etaMin: 6, driver: "Emily Clark",  driverPhone: "+971 50 111 0505", available: true,  label: "M-05 · ALS · Station 3 · 2.0 mi" },
  { id: "B-06", kind: "BLS", station: "Station 5",        distanceMi: 2.1, etaMin: 7, driver: "Ryan Miller",  driverPhone: "+971 50 111 0606", available: true,  label: "B-06 · BLS · Station 5 · 2.1 mi" },
  { id: "M-03", kind: "ALS", station: "Al Wasl Rd",       distanceMi: 3.4, etaMin: 9, driver: "Tom Williams", driverPhone: "+971 50 111 0303", available: false, label: "M-03 · ALS · Al Wasl Rd · On Scene" },
];

const FORWARD_TARGETS = [
  { id: "sup",   label: "Shift Supervisor" },
  { id: "med",   label: "Medical Director" },
  { id: "ops",   label: "Operations Desk" },
  { id: "hosp",  label: "Hospital Coordination" },
];

const HOSPITAL_OPTIONS = [
  { id: "H01", label: "Metro Medical Center · 3.4 mi · Level I · GREEN" },
  { id: "H03", label: "City General Hospital · 2.1 mi · Level I · GREEN" },
  { id: "H02", label: "Saint Mary Hospital · 4.7 mi · Level II · YELLOW" },
];

const STATUS_STEPS = ["Received", "Dispatched", "En Route", "On Scene", "Transporting", "At Hospital", "Closed"] as const;

function ActiveCallPage() {
  const navigate = useNavigate();
  const [call, setCall] = useState<ActiveCall>(DEFAULT_CALL);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedUnit, setAssignedUnit] = useState<string>("A-01");
  const [assignedHospital, setAssignedHospital] = useState<string>("H01");
  const [status, setStatus] = useState<typeof STATUS_STEPS[number]>("Dispatched");
  const [recording, setRecording] = useState(true);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardTo, setForwardTo] = useState<string>("sup");
  const [driverChat, setDriverChat] = useState<{ from: "me" | "them"; text: string; t: string }[]>([
    { from: "them", text: "A-01 responding. ETA 4 minutes.", t: "0:12" },
  ]);
  const [driverDraft, setDriverDraft] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cad:activeCall");
      if (raw) {
        const c = JSON.parse(raw) as ActiveCall;
        setCall((prev) => ({ ...prev, ...c }));
        if (c.address) setAddress(c.address);
        if (c.patient) setPatientName(c.patient);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const dispatch = () => {
    toast.success(`Dispatched ${assignedUnit} to ${call.id}`, { description: `Notified crew · Coord. w/ ${assignedHospital}` });
    setStatus("En Route");
  };

  const notifyHospital = () => {
    toast.success(`Pre-notification sent to ${assignedHospital}`, { description: "ED prepared for handover." });
  };

  const advance = () => {
    const i = STATUS_STEPS.indexOf(status);
    const next = STATUS_STEPS[Math.min(i + 1, STATUS_STEPS.length - 1)];
    setStatus(next);
    toast.success(`${call.id} → ${next}`);
  };

  const endCall = () => {
    toast(`${call.id} ended`, { description: `Duration ${timer}` });
    try { sessionStorage.removeItem("cad:activeCall"); } catch { /* ignore */ }
    navigate({ to: "/portal/cad" });
  };

  const sendDriver = () => {
    if (!driverDraft.trim()) return;
    const t = timer;
    setDriverChat((prev) => [...prev, { from: "me", text: driverDraft.trim(), t }]);
    setDriverDraft("");
  };

  return (
    <div className="p-3 flex-1 min-h-0 overflow-y-auto">
      {/* Live call header */}
      <div className="rounded-xl border border-success/40 bg-success/5 shadow-sm p-4 mb-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex h-12 w-12 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/40" />
            <span className="relative inline-flex h-12 w-12 rounded-full bg-success grid place-items-center text-white">
              <Phone className="h-5 w-5" />
            </span>
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="text-[10px] uppercase tracking-widest text-success flex items-center gap-2">
              <span>Live Call · {status}</span>
              {recording && (
                <span className="flex items-center gap-1 text-destructive">
                  <Circle className="h-2 w-2 fill-destructive animate-pulse" /> REC
                </span>
              )}
            </div>
            <div className="text-lg font-display font-bold text-foreground">{call.caller} <span className="text-muted-foreground text-sm font-normal">· {call.number}</span></div>
            <div className="text-xs text-muted-foreground">{call.id} · {call.type}</div>
          </div>
          <div className="font-mono text-3xl font-bold text-foreground tabular-nums ml-auto">{timer}</div>
        </div>
        <div className="mt-3 pt-3 border-t border-success/20 flex items-center gap-2 flex-wrap justify-end">
          <Button variant="outline" size="sm" onClick={() => { setMuted((v) => !v); toast(muted ? "Unmuted" : "Muted"); }}>
            {muted ? <MicOff className="h-4 w-4 mr-1.5" /> : <Mic className="h-4 w-4 mr-1.5" />}
            {muted ? "Unmute" : "Mute"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setSpeaker((v) => !v); toast(`Speaker ${speaker ? "off" : "on"}`); }}>
            <Volume2 className={`h-4 w-4 mr-1.5 ${speaker ? "text-primary" : ""}`} />
            Speaker
          </Button>
          <Button
            variant="outline" size="sm"
            onClick={() => { setRecording((v) => !v); toast(recording ? "Recording paused" : "Recording resumed"); }}
            className={recording ? "border-destructive/40 text-destructive" : ""}
          >
            <Circle className={`h-4 w-4 mr-1.5 ${recording ? "fill-destructive text-destructive" : ""}`} />
            {recording ? "Pause Rec" : "Record"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setForwardOpen(true)}>
            <PhoneForwarded className="h-4 w-4 mr-1.5" /> Forward
          </Button>
          <Button size="sm" onClick={endCall} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <PhoneOff className="h-4 w-4 mr-1.5" /> End Call
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* LEFT: Capture */}
        <section className="rounded-xl border border-border bg-card shadow-sm p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Capture</div>

          <FieldLabel icon={<MapPin className="h-3.5 w-3.5" />}>Patient location</FieldLabel>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, city, landmark"
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <FieldLabel icon={<User className="h-3.5 w-3.5" />}>Patient name</FieldLabel>
              <input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full name"
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <FieldLabel icon={<Clock className="h-3.5 w-3.5" />}>Age</FieldLabel>
              <input
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="e.g. 62"
                className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <FieldLabel>Dispatcher notes</FieldLabel>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Chief complaint, scene safety, hazards…"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <Button
            onClick={() => toast.success("Call intake saved", { description: `${patientName || "Patient"} · ${address || "location pending"}` })}
            className="w-full mt-3"
          >
            Save Intake
          </Button>
        </section>

        {/* MIDDLE: CAD dispatch + Fleet + Hospital */}
        <section className="rounded-xl border border-border bg-card shadow-sm p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">CAD Dispatch</div>

          <FieldLabel icon={<Truck className="h-3.5 w-3.5" />}>Assign ambulance</FieldLabel>
          <select
            value={assignedUnit}
            onChange={(e) => setAssignedUnit(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {FLEET_OPTIONS.map((f) => (
              <option key={f.id} value={f.id} disabled={!f.available}>
                {f.label}{!f.available ? " · unavailable" : ""}
              </option>
            ))}
          </select>

          <FieldLabel icon={<Hospital className="h-3.5 w-3.5" />}>Receiving hospital</FieldLabel>
          <select
            value={assignedHospital}
            onChange={(e) => setAssignedHospital(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {HOSPITAL_OPTIONS.map((h) => (
              <option key={h.id} value={h.id}>{h.label}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button onClick={dispatch}>
              <Navigation className="h-4 w-4 mr-1.5" /> Dispatch
            </Button>
            <Button variant="secondary" onClick={notifyHospital}>
              <Hospital className="h-4 w-4 mr-1.5" /> Pre-notify
            </Button>
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Status</div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {STATUS_STEPS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                  status === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground/70 border-border hover:border-primary/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={advance} className="w-full">Advance status</Button>
        </section>

        {/* RIGHT: Ambulance / Hospital connect */}
        <section className="rounded-xl border border-border bg-card shadow-sm p-4 flex flex-col">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Ambulance & Hospital Connect</div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button variant="outline" size="sm" onClick={() => toast(`Radio patch → ${assignedUnit}`)}>
              <Radio className="h-3.5 w-3.5 mr-1.5" /> Radio {assignedUnit}
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast(`Calling ${assignedHospital}`)}>
              <Phone className="h-3.5 w-3.5 mr-1.5" /> Call {assignedHospital}
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-background p-3 mb-3 flex-1 min-h-[180px] overflow-y-auto space-y-2">
            {driverChat.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs shadow-sm ${
                  m.from === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  <div>{m.text}</div>
                  <div className={`text-[9px] mt-0.5 font-mono ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.t}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendDriver(); }} className="flex items-center gap-2">
            <input
              value={driverDraft}
              onChange={(e) => setDriverDraft(e.target.value)}
              placeholder={`Message ${assignedUnit} driver…`}
              className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <Button type="submit" size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>
      </div>

      {/* Nearest fleet to caller */}
      <section className="mt-3 rounded-xl border border-border bg-card shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Nearest Fleet to Caller {address ? <span className="text-foreground/70 normal-case tracking-normal">· {address}</span> : null}
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{FLEET_OPTIONS.filter(f => f.available).length} available</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {[...FLEET_OPTIONS].sort((a, b) => a.distanceMi - b.distanceMi).map((f) => {
            const isAssigned = assignedUnit === f.id;
            return (
              <div
                key={f.id}
                className={`rounded-lg border p-3 transition-colors ${
                  isAssigned ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm font-semibold text-foreground">{f.id}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{f.kind}</span>
                  <span className={`ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    f.available ? "bg-success/15 text-success border border-success/30" : "bg-muted text-muted-foreground border border-border"
                  }`}>
                    {f.available ? "AVAILABLE" : "BUSY"}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  <div>Driver: <span className="text-foreground">{f.driver}</span></div>
                  <div>Station: <span className="text-foreground">{f.station}</span></div>
                  <div className="font-mono">{f.distanceMi.toFixed(1)} mi · ETA {f.etaMin} min</div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  <Button
                    size="sm"
                    variant={isAssigned ? "default" : "secondary"}
                    disabled={!f.available}
                    onClick={() => { setAssignedUnit(f.id); toast.success(`${f.id} assigned to ${call.id}`); }}
                  >
                    <Navigation className="h-3.5 w-3.5 mr-1" /> {isAssigned ? "Assigned" : "Assign"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast(`Calling driver ${f.driver}`, { description: f.driverPhone })}
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" /> Driver
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={forwardOpen} onOpenChange={setForwardOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Forward Call</DialogTitle>
            <DialogDescription className="font-mono text-xs">{call.id} · {call.caller}</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            {FORWARD_TARGETS.map((t) => (
              <button
                key={t.id}
                onClick={() => setForwardTo(t.id)}
                className={`w-full text-left px-3 py-2 rounded-md border text-sm transition-colors ${
                  forwardTo === t.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setForwardOpen(false)}>Cancel</Button>
            <Button
              className="flex-1"
              onClick={() => {
                const t = FORWARD_TARGETS.find((x) => x.id === forwardTo);
                toast.success(`Call forwarded`, { description: `${call.id} → ${t?.label}` });
                setForwardOpen(false);
              }}
            >
              <PhoneForwarded className="h-4 w-4 mr-1.5" /> Forward
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FieldLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
      {icon}<span>{children}</span>
    </div>
  );
}
