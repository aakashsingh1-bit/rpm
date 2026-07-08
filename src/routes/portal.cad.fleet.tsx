import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Wifi, Fuel, Navigation, Radio, MapPin, Phone, User, Hospital, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/portal/cad/fleet")({
  component: FleetPage,
});

interface FleetUnit {
  id: string;
  kind: "ALS" | "BLS";
  driver: string;
  driverPhone: string;
  emt: string;
  status: "En Route" | "On Scene" | "Available" | "At Hospital" | "Out of Service";
  eta: string;
  fuel: number;
  location: string;
  colorVar: string;
  assignedCall?: { id: string; type: string; patient: string; address: string };
  route?: { from: string; to: string; distance: string; etaMin: number };
  hospital?: string;
}

const FLEET: FleetUnit[] = [
  { id: "A-01", kind: "ALS", driver: "Mike Johnson", driverPhone: "+971 50 111 0001", emt: "Sarah Davis",  status: "En Route",  eta: "00:02 · 0.8 mi", fuel: 78, location: "Sheikh Zayed Rd",   colorVar: "var(--primary)",
    assignedCall: { id: "MED-25-05124", type: "Cardiac Arrest", patient: "Male, 62 y/o", address: "123 Main St, Downtown" },
    route: { from: "Station 3", to: "123 Main St", distance: "3.2 mi", etaMin: 4 }, hospital: "Metro Medical Center" },
  { id: "M-03", kind: "ALS", driver: "Tom Williams", driverPhone: "+971 50 111 0002", emt: "Lisa Brown",   status: "On Scene",  eta: "On Scene",       fuel: 62, location: "Al Wasl Rd",        colorVar: "var(--success)",
    assignedCall: { id: "MED-25-05123", type: "Difficulty Breathing", patient: "Female, 45 y/o", address: "456 Oak Ave" },
    route: { from: "Al Wasl Rd", to: "City General Hospital", distance: "2.1 mi", etaMin: 6 }, hospital: "City General Hospital" },
  { id: "B-02", kind: "BLS", driver: "Chris Lee",    driverPhone: "+971 50 111 0003", emt: "David Wilson", status: "En Route",  eta: "00:04 · 1.3 mi", fuel: 45, location: "Jumeirah Beach Rd", colorVar: "var(--info)",
    assignedCall: { id: "MED-25-05122", type: "Chest Pain", patient: "Male, 55 y/o", address: "789 Pine Rd" },
    route: { from: "Station 1", to: "789 Pine Rd", distance: "1.3 mi", etaMin: 4 } },
  { id: "M-05", kind: "ALS", driver: "Emily Clark",  driverPhone: "+971 50 111 0004", emt: "Kevin Taylor", status: "Available", eta: "Standby",        fuel: 92, location: "Station 3",         colorVar: "var(--brand-purple)" },
  { id: "B-06", kind: "BLS", driver: "Ryan Miller",  driverPhone: "+971 50 111 0005", emt: "Amanda White", status: "En Route",  eta: "00:05 · 2.1 mi", fuel: 55, location: "Al Barsha",         colorVar: "var(--brand-teal)",
    assignedCall: { id: "MED-25-05121", type: "Fall Injury", patient: "Female, 78 y/o", address: "321 Elm St" },
    route: { from: "Al Barsha", to: "321 Elm St", distance: "2.1 mi", etaMin: 5 } },
  { id: "A-08", kind: "ALS", driver: "Layla Ahmad",  driverPhone: "+971 50 111 0006", emt: "Omar Khan",    status: "At Hospital", eta: "Handover",     fuel: 40, location: "Metro Medical",     colorVar: "var(--warning)",
    hospital: "Metro Medical Center" },
];

const STATUS_STEPS = ["Available", "En Route", "On Scene", "Transporting", "At Hospital", "Out of Service"] as const;

function FleetPage() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);
  const openUnit = FLEET.find((u) => u.id === openId) ?? null;

  return (
    <div className="p-4 flex-1 min-h-0 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-foreground">Fleet Overview</h1>
          <p className="text-sm text-muted-foreground">{FLEET.length} ambulances active across the network</p>
        </div>
        <Button onClick={() => navigate({ to: "/portal/cad" })} variant="outline">Back to Command Deck</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {FLEET.map((u) => (
          <div key={u.id} className="rounded-xl border border-border bg-card shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-10 w-16 rounded-md shadow-sm relative"
                style={{ background: `linear-gradient(180deg, ${u.colorVar}, color-mix(in oklab, ${u.colorVar} 55%, black))` }}
              >
                <div className="absolute left-1 right-4 top-1 h-2 rounded-sm bg-white/85" />
                <div className="absolute right-1 top-1 h-3 w-3 rounded-sm bg-white grid place-items-center">
                  <span className="text-destructive text-[8px] font-black leading-none">+</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-semibold text-foreground">{u.id}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{u.kind}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {u.location}
                </div>
              </div>
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                style={{ background: `color-mix(in oklab, ${u.colorVar} 15%, transparent)`, color: u.colorVar, border: `1px solid color-mix(in oklab, ${u.colorVar} 35%, transparent)` }}
              >
                {u.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground mb-3">
              <div>Driver: <span className="text-foreground">{u.driver}</span></div>
              <div>EMT: <span className="text-foreground">{u.emt}</span></div>
            </div>

            <div className="flex items-center gap-3 text-[11px] mb-3">
              <div className="flex items-center gap-1"><Wifi className="h-3 w-3 text-success" /><span className="text-foreground/80">Online</span></div>
              <div className="flex items-center gap-1"><Fuel className="h-3 w-3 text-info" /><span className="text-foreground/80">{u.fuel}%</span></div>
              <div className="ml-auto font-mono text-foreground/80">{u.eta}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="secondary" onClick={() => toast(`Radio patch → ${u.id}`, { description: u.driver })}>
                <Radio className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => toast(`Tracking ${u.id} live on map`)}>
                <Navigation className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" onClick={() => setOpenId(u.id)}>
                <Truck className="h-3.5 w-3.5 mr-1" /> Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      <FleetDetailDialog unit={openUnit} onOpenChange={(o) => !o && setOpenId(null)} />
    </div>
  );
}

function FleetDetailDialog({ unit, onOpenChange }: { unit: FleetUnit | null; onOpenChange: (o: boolean) => void }) {
  const [status, setStatus] = useState<typeof STATUS_STEPS[number] | null>(null);
  if (!unit) return null;
  const currentStatus = status ?? (unit.status as typeof STATUS_STEPS[number]);

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="h-8 w-12 rounded-md shadow-sm relative"
              style={{ background: `linear-gradient(180deg, ${unit.colorVar}, color-mix(in oklab, ${unit.colorVar} 55%, black))` }}
            >
              <div className="absolute left-1 right-3 top-1 h-1.5 rounded-sm bg-white/85" />
            </div>
            <span className="font-display">Ambulance {unit.id}</span>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
              style={{ background: `color-mix(in oklab, ${unit.colorVar} 15%, transparent)`, color: unit.colorVar, border: `1px solid color-mix(in oklab, ${unit.colorVar} 35%, transparent)` }}
            >
              {currentStatus.toUpperCase()}
            </span>
          </DialogTitle>
          <DialogDescription>{unit.kind} Ambulance · {unit.location}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Crew</div>
            <div className="text-sm text-foreground flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /> Driver: <span className="font-medium">{unit.driver}</span></div>
            <div className="text-sm text-foreground flex items-center gap-2 mt-1"><User className="h-3.5 w-3.5 text-muted-foreground" /> EMT: <span className="font-medium">{unit.emt}</span></div>
            <div className="text-xs text-muted-foreground font-mono mt-1">{unit.driverPhone}</div>
          </div>

          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Vehicle</div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5 text-info" /> {unit.fuel}%</div>
              <div className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5 text-success" /> Online</div>
              <div className="ml-auto font-mono text-muted-foreground">{unit.eta}</div>
            </div>
          </div>

          {unit.assignedCall ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 md:col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-destructive mb-2">Assigned Call</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-foreground">{unit.assignedCall.id}</div>
                  <div className="text-sm font-semibold text-destructive">{unit.assignedCall.type}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{unit.assignedCall.patient}</div>
                  <div className="flex items-center gap-1 justify-end"><MapPin className="h-3 w-3" /> {unit.assignedCall.address}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-3 md:col-span-2 text-sm text-muted-foreground">
              No active assignment. Unit is {unit.status.toLowerCase()}.
            </div>
          )}

          {unit.route && (
            <div className="rounded-lg border border-border bg-background p-3 md:col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Route</div>
              <div className="flex items-center gap-3 text-sm text-foreground flex-wrap">
                <span className="font-medium">{unit.route.from}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{unit.route.to}</span>
                <span className="ml-auto font-mono text-muted-foreground text-xs">{unit.route.distance} · ETA {unit.route.etaMin} min</span>
              </div>
              {unit.hospital && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <Hospital className="h-3.5 w-3.5" /> Receiving: <span className="text-foreground">{unit.hospital}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Update status</div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_STEPS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); toast.success(`${unit.id} → ${s}`); }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                  currentStatus === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground/70 border-border hover:border-primary/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button size="sm" onClick={() => toast(`Radio patch → ${unit.id}`)}>
            <Radio className="h-3.5 w-3.5 mr-1.5" /> Radio
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast(`Calling ${unit.driver}`, { description: unit.driverPhone })}>
            <Phone className="h-3.5 w-3.5 mr-1.5" /> Call driver
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast(`Tracking ${unit.id} live`)}>
            <Navigation className="h-3.5 w-3.5 mr-1.5" /> Track
          </Button>
          <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-3.5 w-3.5 mr-1.5" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
