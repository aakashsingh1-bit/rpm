import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, BedDouble, Activity, Phone, MapPin, X, Send, Ambulance, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/portal/cad/hospital")({
  component: HospitalPage,
});

interface Hospital {
  id: string;
  name: string;
  dist: string;
  status: "Green" | "Yellow" | "Red";
  edBeds: number;
  edTotal: number;
  icuBeds: number;
  icuTotal: number;
  trauma: string;
  phone: string;
  address: string;
  incoming: number;
  specialties: string[];
  contact: string;
  incomingUnits: { id: string; type: string; eta: string }[];
}

const HOSPITALS: Hospital[] = [
  { id: "H01", name: "Metro Medical Center",  dist: "3.4 mi", status: "Green",  edBeds: 12, edTotal: 24, icuBeds: 4,  icuTotal: 12, trauma: "Level I",  phone: "+971 4 555 7700", address: "Al Wasl Rd, Downtown",       incoming: 2, specialties: ["Cardiology", "Trauma", "Stroke"],          contact: "Dr. Amir Al-Hashimi", incomingUnits: [{ id: "A-01", type: "Cardiac Arrest", eta: "6 min" }, { id: "M-03", type: "Chest Pain", eta: "12 min" }] },
  { id: "H02", name: "Saint Mary Hospital",   dist: "4.7 mi", status: "Yellow", edBeds: 3,  edTotal: 20, icuBeds: 1,  icuTotal: 10, trauma: "Level II", phone: "+971 4 555 4400", address: "Jumeirah Beach Rd",           incoming: 1, specialties: ["Pediatrics", "OB/GYN"],                     contact: "Dr. Nadia Karim",     incomingUnits: [{ id: "B-02", type: "Fall Injury", eta: "9 min" }] },
  { id: "H03", name: "City General Hospital", dist: "2.1 mi", status: "Green",  edBeds: 18, edTotal: 30, icuBeds: 7,  icuTotal: 14, trauma: "Level I",  phone: "+971 4 555 9020", address: "Sheikh Zayed Rd",             incoming: 0, specialties: ["Trauma", "Neuro", "Cardiac"],               contact: "Dr. Samir Patel",     incomingUnits: [] },
  { id: "H04", name: "Rashid Trauma Center",  dist: "5.9 mi", status: "Red",    edBeds: 0,  edTotal: 18, icuBeds: 0,  icuTotal: 10, trauma: "Level I",  phone: "+971 4 555 3300", address: "Deira",                       incoming: 3, specialties: ["Trauma", "Burn"],                            contact: "Dr. Hana Rahman",     incomingUnits: [{ id: "A-08", type: "MVA", eta: "3 min" }, { id: "M-05", type: "Trauma", eta: "8 min" }, { id: "B-06", type: "Chest Pain", eta: "14 min" }] },
  { id: "H05", name: "Al Zahra Hospital",     dist: "6.2 mi", status: "Green",  edBeds: 9,  edTotal: 22, icuBeds: 3,  icuTotal: 8,  trauma: "Level II", phone: "+971 4 555 8811", address: "Al Barsha",                   incoming: 1, specialties: ["Cardiology", "OB/GYN"],                     contact: "Dr. Fatima Noor",     incomingUnits: [{ id: "B-06", type: "Difficulty Breathing", eta: "10 min" }] },
  { id: "H06", name: "Mediclinic City",       dist: "3.8 mi", status: "Yellow", edBeds: 4,  edTotal: 18, icuBeds: 2,  icuTotal: 8,  trauma: "Level II", phone: "+971 4 555 6644", address: "Dubai Healthcare City",       incoming: 0, specialties: ["General", "Ortho"],                          contact: "Dr. Yousef Al-Marri", incomingUnits: [] },
];

const statusColor: Record<Hospital["status"], string> = {
  Green:  "bg-success/10 text-success border-success/30",
  Yellow: "bg-warning/15 text-warning border-warning/30",
  Red:    "bg-destructive/10 text-destructive border-destructive/30",
};

function HospitalPage() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  const openHospital = HOSPITALS.find((h) => h.id === openId) ?? null;

  return (
    <div className="p-4 flex-1 min-h-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">Hospital Coordination</h1>
          <p className="text-sm text-muted-foreground">Live bed status and receiving capacity</p>
        </div>
        <Button onClick={() => navigate({ to: "/portal/cad" })} variant="outline">Back to Command Deck</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {HOSPITALS.map((h) => (
          <div key={h.id} className="rounded-xl border border-border bg-card shadow-sm p-4">
            <button
              onClick={() => setOpenId(h.id)}
              className="w-full text-left flex items-start gap-3 mb-3 group"
            >
              <div className="h-10 w-10 rounded-lg bg-info/10 text-info grid place-items-center shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">{h.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.dist} · {h.trauma}</div>
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${statusColor[h.status]}`}>
                {h.status.toUpperCase()}
              </span>
            </button>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] uppercase tracking-widest"><BedDouble className="h-3 w-3" /> ED</div>
                <div className="text-lg font-display font-bold text-foreground">{h.edBeds}</div>
              </div>
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground text-[10px] uppercase tracking-widest"><Activity className="h-3 w-3" /> ICU</div>
                <div className="text-lg font-display font-bold text-foreground">{h.icuBeds}</div>
              </div>
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <div className="text-muted-foreground text-[10px] uppercase tracking-widest">Incoming</div>
                <div className="text-lg font-display font-bold text-primary">{h.incoming}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" onClick={() => setOpenId(h.id)}>
                <Phone className="h-3.5 w-3.5 mr-1.5" /> Call
              </Button>
              <Button size="sm" onClick={() => setOpenId(h.id)}>
                Pre-notify
              </Button>
            </div>
          </div>
        ))}
      </div>

      <HospitalDetailDialog hospital={openHospital} onOpenChange={(o) => !o && setOpenId(null)} />
    </div>
  );
}

function HospitalDetailDialog({ hospital, onOpenChange }: { hospital: Hospital | null; onOpenChange: (o: boolean) => void }) {
  const [note, setNote] = useState("");
  if (!hospital) return null;

  const send = () => {
    if (!note.trim()) return toast("Add a pre-notification note first");
    toast.success(`Pre-notification sent to ${hospital.name}`, { description: note });
    setNote("");
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-info/10 text-info grid place-items-center">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-display">{hospital.name}</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor[hospital.status]}`}>
              {hospital.status.toUpperCase()}
            </span>
          </DialogTitle>
          <DialogDescription>{hospital.trauma} · {hospital.dist} · {hospital.address}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <Capacity icon={<BedDouble className="h-3.5 w-3.5" />} label="ED Beds"  free={hospital.edBeds}  total={hospital.edTotal} />
          <Capacity icon={<Activity className="h-3.5 w-3.5" />}  label="ICU Beds" free={hospital.icuBeds} total={hospital.icuTotal} />
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center justify-center gap-1"><Ambulance className="h-3 w-3" /> Incoming</div>
            <div className="text-2xl font-display font-bold text-primary tabular-nums">{hospital.incoming}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Contact</div>
            <div className="text-sm text-foreground">{hospital.contact}</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">{hospital.phone}</div>
            <Button size="sm" onClick={() => toast(`Calling ${hospital.name}`, { description: hospital.phone })} className="mt-2 w-full">
              <Phone className="h-3.5 w-3.5 mr-1.5" /> Call ED Desk
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Specialties</div>
            <div className="flex flex-wrap gap-1.5">
              {hospital.specialties.map((s) => (
                <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Incoming Units</div>
          {hospital.incomingUnits.length === 0 ? (
            <div className="text-sm text-muted-foreground">No units currently en route.</div>
          ) : (
            <ul className="space-y-1.5">
              {hospital.incomingUnits.map((u) => (
                <li key={u.id} className="flex items-center gap-3 text-sm">
                  <span className="font-mono font-semibold text-foreground w-14">{u.id}</span>
                  <span className="text-foreground/85 flex-1">{u.type}</span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> ETA {u.eta}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border bg-background p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Send Pre-notification</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={`Notify ${hospital.name} — patient, vitals, ETA, resources needed…`}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-3.5 w-3.5 mr-1.5" /> Close
            </Button>
            <Button size="sm" onClick={send}>
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send Pre-notify
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Capacity({ icon, label, free, total }: { icon: React.ReactNode; label: string; free: number; total: number }) {
  const pct = total ? Math.round((free / total) * 100) : 0;
  const bar = pct >= 40 ? "bg-success" : pct >= 15 ? "bg-warning" : "bg-destructive";
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">{icon} {label}</div>
      <div className="text-2xl font-display font-bold text-foreground tabular-nums">
        {free}<span className="text-sm text-muted-foreground font-normal"> / {total}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
