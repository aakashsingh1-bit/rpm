import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, PhoneCall, PhoneIncoming, Truck, Building2, MessageSquare, FileText,
  Heart, AlertTriangle, ChevronDown, MapPin, Clock, User, Phone, Stethoscope,
  Plus, Cloud, Hospital, Navigation,
  Compass, Layers, Locate, Wifi, BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type UnitStatus = "En Route" | "On Scene" | "Available" | "At Hospital";

interface Call {
  id: string;
  timer: string;
  type: string;
  priority: Priority;
  address: string;
  patient: string;
  icon: typeof Heart;
}

interface Unit {
  id: string;
  kind: "ALS" | "BLS";
  driver: string;
  emt: string;
  status: UnitStatus;
  eta: string;
  colorVar: string;
  x: number;
  y: number;
}

const CALLS: Call[] = [
  { id: "MED-25-05124", timer: "00:01:32", type: "Cardiac Arrest",       priority: "CRITICAL", address: "123 Main St, Downtown",       patient: "Male, 62 y/o",   icon: Heart },
  { id: "MED-25-05123", timer: "00:03:47", type: "Difficulty Breathing", priority: "HIGH",     address: "456 Oak Ave, North District", patient: "Female, 45 y/o", icon: AlertTriangle },
  { id: "MED-25-05122", timer: "00:06:15", type: "Chest Pain",           priority: "HIGH",     address: "789 Pine Rd, East District",  patient: "Male, 55 y/o",   icon: Heart },
  { id: "MED-25-05121", timer: "00:10:22", type: "Fall Injury",          priority: "MEDIUM",   address: "321 Elm St, West District",   patient: "Female, 78 y/o", icon: ChevronDown },
];

const UNITS: Unit[] = [
  { id: "A-01", kind: "ALS", driver: "Mike Johnson", emt: "Sarah Davis",  status: "En Route",  eta: "00:02 · 0.8 mi", colorVar: "var(--primary)",       x: 28, y: 42 },
  { id: "M-03", kind: "ALS", driver: "Tom Williams", emt: "Lisa Brown",   status: "On Scene",  eta: "00:01:20",       colorVar: "var(--success)",       x: 60, y: 55 },
  { id: "B-02", kind: "BLS", driver: "Chris Lee",    emt: "David Wilson", status: "En Route",  eta: "00:04 · 1.3 mi", colorVar: "var(--info)",          x: 76, y: 30 },
  { id: "M-05", kind: "ALS", driver: "Emily Clark",  emt: "Kevin Taylor", status: "Available", eta: "Standby",        colorVar: "var(--brand-purple)",  x: 45, y: 70 },
  { id: "B-06", kind: "BLS", driver: "Ryan Miller",  emt: "Amanda White", status: "En Route",  eta: "00:05 · 2.1 mi", colorVar: "var(--brand-teal)",    x: 74, y: 76 },
];

const priorityChip: Record<Priority, string> = {
  CRITICAL: "bg-destructive text-destructive-foreground",
  HIGH:     "bg-warning text-white",
  MEDIUM:   "bg-info text-white",
  LOW:      "bg-muted text-muted-foreground",
};
const priorityText: Record<Priority, string> = {
  CRITICAL: "text-destructive",
  HIGH:     "text-warning",
  MEDIUM:   "text-info",
  LOW:      "text-muted-foreground",
};

export function CadDashboard() {
  const [selectedCall, setSelectedCall] = useState<Call>(CALLS[0]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [dialogPanel, setDialogPanel] = useState<Panel>("overview");
  const [ongoingIds, setOngoingIds] = useState<Set<string>>(new Set());
  const [callStatuses, setCallStatuses] = useState<Record<string, typeof STATUS_OPTIONS[number]>>({});
  const openCall = (c: Call) => { setSelectedCall(c); setDialogPanel("overview"); setDetailOpen(true); };
  const openCallPanel = (p: Panel) => { setDialogPanel(p); setDetailOpen(true); };
  const markOngoing = (id: string) => {
    setOngoingIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev); next.add(id); return next;
    });
  };
  const updateStatus = (id: string, s: typeof STATUS_OPTIONS[number]) => {
    setCallStatuses((prev) => ({ ...prev, [id]: s }));
    if (s === "Closed") {
      setOngoingIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev); next.delete(id); return next;
      });
    }
    toast.success(`${id} → ${s}`, { description: "Broadcast to crew, ops, hospital coord." });
  };
  const closeCall = (id: string) => {
    updateStatus(id, "Closed");
  };

  return (
    <div className="flex flex-col gap-3 p-3 flex-1 min-h-0 overflow-y-auto">
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_360px] gap-3 min-h-0">
      <div className="flex flex-col gap-3 min-h-0">
        <ActiveCallsCard calls={CALLS} selected={selectedCall} onSelect={openCall} ongoingIds={ongoingIds} statuses={callStatuses} />
        <UnitStatusCard />
        <SystemStatusCard />
      </div>
      <div className="flex flex-col gap-3 min-h-0">
        <MapDeck selectedCall={selectedCall} ongoingCalls={CALLS.filter((c) => ongoingIds.has(c.id))} />
        <UnitPanel />
      </div>
      <div className="flex flex-col gap-3 min-h-0 overflow-y-auto">
        <CallDetailsCard
          call={selectedCall}
          isOngoing={ongoingIds.has(selectedCall.id)}
          currentStatus={callStatuses[selectedCall.id]}
          onOpenDialog={() => openCallPanel("overview")}
          onOpenPanel={openCallPanel}
          onOpenStatus={() => setStatusOpen(true)}
          onCloseCall={() => closeCall(selectedCall.id)}
        />
        <CallTimelineCard />
        <QuickActionsCard />
      </div>

      <CallDetailsDialog
        call={selectedCall}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        initialPanel={dialogPanel}
        onAccept={(id) => markOngoing(id)}
        currentStatus={callStatuses[selectedCall.id]}
        onStatusChange={(s) => updateStatus(selectedCall.id, s)}
      />
      <StatusUpdateDialog
        call={selectedCall}
        open={statusOpen}
        onOpenChange={setStatusOpen}
        currentStatus={callStatuses[selectedCall.id]}
        onStatusChange={(s) => updateStatus(selectedCall.id, s)}
      />
    </div>
    </div>
  );
}

function DeckCard({ title, badge, children, action }: { title: string; badge?: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</div>
        <div className="flex items-center gap-2">{badge}{action}</div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}

function ActiveCallsCard({ calls, selected, onSelect, ongoingIds, statuses }: { calls: Call[]; selected: Call; onSelect: (c: Call) => void; ongoingIds: Set<string>; statuses: Record<string, typeof STATUS_OPTIONS[number]> }) {
  const navigate = useNavigate();
  return (
    <DeckCard
      title="Active Calls"
      badge={<span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/30">{calls.length}</span>}
    >
      <div className="p-2 space-y-2">
        {calls.map((c) => {
          const Icon = c.icon;
          const isSel = selected.id === c.id;
          const isOn = ongoingIds.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className={`w-full text-left rounded-lg border p-3 transition-all ${
                isSel ? "border-destructive/60 bg-destructive/5 ring-1 ring-destructive/30" : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`h-7 w-7 rounded-full grid place-items-center shrink-0 ${
                  c.priority === "CRITICAL" ? "bg-destructive/10 text-destructive" :
                  c.priority === "HIGH" ? "bg-warning/15 text-warning" : "bg-info/10 text-info"
                }`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-foreground">{c.id}</span>
                      {isOn && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-success/15 text-success border border-success/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> ONGOING
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-muted-foreground">{c.timer}</span>
                  </div>
                  <div className={`text-sm font-semibold mt-0.5 ${priorityText[c.priority]}`}>{c.type}</div>
                  {statuses[c.id] && (
                    <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-primary">Status: {statuses[c.id]}</div>
                  )}
                  <div className="text-[11px] text-muted-foreground mt-0.5">{c.address}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-muted-foreground">{c.patient}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${priorityChip[c.priority]}`}>{c.priority}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
        <button
          onClick={() => navigate({ to: "/portal/cad/calls" })}
          className="w-full text-center text-[11px] font-semibold uppercase tracking-widest text-primary py-2 rounded-md border border-border hover:bg-muted transition-colors"
        >
          Open Call Center
        </button>
      </div>
    </DeckCard>
  );
}

function UnitStatusCard() {
  const cells = [
    { label: "Available",     value: 12, color: "text-success",         bg: "bg-success/10 border-success/30" },
    { label: "En Route",      value: 3,  color: "text-info",            bg: "bg-info/10 border-info/30" },
    { label: "On Scene",      value: 1,  color: "text-destructive",     bg: "bg-destructive/10 border-destructive/30" },
    { label: "At Hospital",   value: 0,  color: "text-primary",         bg: "bg-primary/10 border-primary/30" },
    { label: "Out of Service", value: 1, color: "text-muted-foreground", bg: "bg-muted border-border" },
  ];
  return (
    <DeckCard title="Fleet Status">
      <div className="p-3 grid grid-cols-5 gap-2">
        {cells.map((c) => (
          <div key={c.label} className={`rounded-md border ${c.bg} py-2 px-1 text-center`}>
            <div className={`text-lg font-display font-bold tabular-nums ${c.color}`}>{c.value}</div>
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground leading-tight mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
    </DeckCard>
  );
}

function SystemStatusCard() {
  const rows = ["CAD System", "Radio System", "GPS Tracking", "Phone System", "Records", "Mapping"];
  return (
    <DeckCard title="System Status">
      <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        {rows.map((label) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_6px_var(--success)]" />
            <span className="text-foreground/80">{label}</span>
            <span className="ml-auto text-[10px] font-mono text-success">Online</span>
          </div>
        ))}
      </div>
    </DeckCard>
  );
}

const ONGOING_POSITIONS: Array<{ x: number; y: number }> = [
  { x: 38, y: 32 }, { x: 62, y: 40 }, { x: 30, y: 60 }, { x: 68, y: 66 },
];

function MapDeck({ selectedCall, ongoingCalls }: { selectedCall: Call; ongoingCalls: Call[] }) {
  const navigate = useNavigate();
  const [mapMode, setMapMode] = useState<string>("PAN");
  const [zoom, setZoom] = useState(1);
  const [is3D, setIs3D] = useState(true);

  const onMode = (m: string) => {
    setMapMode(m);
    toast(`Map mode: ${m}`);
  };

  return (
    <div className="relative flex-1 min-h-[420px] rounded-xl border border-border overflow-hidden bg-muted/40">
      <div className="absolute inset-0 bg-gradient-to-br from-muted/60 via-background to-muted/40" />
      <div
        className="absolute inset-0 opacity-40 transition-transform"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: `${48 * zoom}px ${48 * zoom}px`,
          transform: is3D ? "perspective(900px) rotateX(35deg)" : "none",
          transformOrigin: "center 60%",
        }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-25" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M -5 60 Q 30 40 55 45 T 105 30" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.6" />
        <path d="M 15 -5 Q 30 30 45 45 T 60 105" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.6" />
        <path d="M -5 20 L 105 90" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.4" strokeDasharray="0.6 0.6" />
      </svg>

      <div className="absolute top-3 left-3 right-3 flex items-center gap-2 flex-wrap z-10">
        <ChipCard icon={<Cloud className="h-5 w-5 text-info" />} title="72°F" sub="Partly Cloudy" />
        <button onClick={() => navigate({ to: "/portal/cad/fleet" })} className="focus:outline-none">
          <ChipCard icon={<Truck className="h-4 w-4 text-primary" />} title="FLEET" sub="17 Active" />
        </button>
        <button onClick={() => navigate({ to: "/portal/cad/hospital" })} className="focus:outline-none">
          <ChipCard icon={<Hospital className="h-4 w-4 text-success" />} title="HOSPITALS" sub="6 Online" />
        </button>
        <button onClick={() => navigate({ to: "/portal/cad/calls" })} className="focus:outline-none">
          <ChipCard icon={<Navigation className="h-4 w-4 text-warning" />} title="CALLS" sub="7 Active" />
        </button>
        <div className="ml-auto flex flex-col gap-1.5">
          <MapBtn onClick={() => { setIs3D((v) => !v); toast(`${is3D ? "2D" : "3D"} view`); }} active={is3D}>3D</MapBtn>
          <MapBtn onClick={() => toast("Map layers toggled")}><Layers className="h-4 w-4" /></MapBtn>
          <MapBtn onClick={() => toast("Recentered on incident")}><Locate className="h-4 w-4" /></MapBtn>
          <MapBtn onClick={() => setZoom((z) => Math.min(2, +(z + 0.2).toFixed(1)))}><Plus className="h-4 w-4" /></MapBtn>
          <MapBtn onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))}><span className="text-lg leading-none">−</span></MapBtn>
        </div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          transform: is3D ? "perspective(900px) rotateX(28deg)" : "none",
          transformOrigin: "center 60%",
        }}
      >
        <HospitalPin x={82} y={20} name="Metro Medical Center" dist="3.4 mi" />
        <HospitalPin x={72} y={62} name="Saint Mary Hospital"  dist="4.7 mi" />
        <HospitalPin x={22} y={72} name="City General Hospital" dist="2.1 mi" />

        <IncidentMarker x={50} y={48} label={selectedCall.id} type={selectedCall.type} />

        {ongoingCalls
          .filter((c) => c.id !== selectedCall.id)
          .map((c, i) => {
            const p = ONGOING_POSITIONS[i % ONGOING_POSITIONS.length];
            return <IncidentMarker key={c.id} x={p.x} y={p.y} label={c.id} type={c.type} ongoing />;
          })}

        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {UNITS.filter((u) => u.status !== "Available").map((u) => (
            <line key={u.id} x1={u.x} y1={u.y} x2={50} y2={48} stroke={u.colorVar} strokeWidth="0.4" strokeDasharray="1.2 0.8" opacity="0.9" />
          ))}
        </svg>

        {UNITS.map((u, i) => (
          <VehicleMarker key={u.id} unit={u} index={i} />
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-lg border border-border bg-card/95 px-2 py-1.5 backdrop-blur shadow-sm z-10">
        {[
          { l: "PAN",      i: <Navigation className="h-4 w-4" /> },
          { l: "ROTATE",   i: <RefreshIcon /> },
          { l: "ZOOM IN",  i: <Plus className="h-4 w-4" />, action: () => setZoom((z) => Math.min(2, +(z + 0.2).toFixed(1))) },
          { l: "ZOOM OUT", i: <span className="text-lg leading-none">−</span>, action: () => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1))) },
          { l: "TILT",     i: <Layers className="h-4 w-4" />, action: () => setIs3D((v) => !v) },
          { l: "LAYERS",   i: <Layers className="h-4 w-4" /> },
          { l: "TRAFFIC",  i: <BarChart3 className="h-4 w-4" /> },
          { l: "FLEET",    i: <Truck className="h-4 w-4" />, action: () => navigate({ to: "/portal/cad/fleet" }) },
          { l: "PLACES",   i: <MapPin className="h-4 w-4" /> },
        ].map((b) => (
          <button
            key={b.l}
            onClick={() => (b.action ? b.action() : onMode(b.l))}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded ${
              mapMode === b.l ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {b.i}
            <span className="text-[9px] font-semibold tracking-widest">{b.l}</span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 right-3 h-12 w-12 rounded-full border border-border bg-card/90 grid place-items-center text-muted-foreground backdrop-blur shadow-sm z-10">
        <Compass className="h-5 w-5" />
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
    </svg>
  );
}

function ChipCard({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card/95 px-3 py-1.5 backdrop-blur shadow-sm">
      {icon}
      <div className="leading-tight">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function MapBtn({ children, onClick, active }: { children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 w-8 grid place-items-center rounded-md border text-xs font-semibold backdrop-blur shadow-sm transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card/95 text-muted-foreground hover:text-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

function HospitalPin({ x, y, name, dist }: { x: number; y: number; name: string; dist: string }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="flex flex-col items-center">
        <div className="h-7 w-7 rounded-full bg-info grid place-items-center text-white text-xs font-bold shadow-md">H</div>
        <div className="mt-1 text-center">
          <div className="text-[11px] font-semibold text-foreground bg-card/90 px-1.5 rounded border border-border">{name}</div>
          <div className="text-[10px] text-muted-foreground font-mono">{dist}</div>
        </div>
      </div>
    </div>
  );
}

function IncidentMarker({ x, y, label, type, ongoing = false }: { x: number; y: number; label: string; type: string; ongoing?: boolean }) {
  const tone = ongoing ? "success" : "destructive";
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="relative -translate-y-10">
        <div className={`rounded-md border bg-card px-2.5 py-1 text-center shadow-md ${ongoing ? "border-success/60" : "border-destructive/60"}`}>
          <div className="text-[10px] font-mono text-foreground flex items-center gap-1 justify-center">
            {ongoing && <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />}
            {label}
          </div>
          <div className={`text-[11px] font-semibold ${ongoing ? "text-success" : "text-destructive"}`}>
            {ongoing ? `ONGOING · ${type}` : type}
          </div>
        </div>
      </div>
      <div className="relative">
        <span className={`absolute inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping ${ongoing ? "bg-success/25" : "bg-destructive/25"}`} />
        <span className={`absolute inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full ${ongoing ? "bg-success/40" : "bg-destructive/40"}`} />
        <MapPin className={`relative h-7 w-7 -translate-x-1/2 -translate-y-full drop-shadow-md ${ongoing ? "text-success fill-success/80" : "text-destructive fill-destructive/80"}`} />
      </div>
    </div>
  );
}

function VehicleMarker({ unit, index }: { unit: Unit; index: number }) {
  // Moving 3D ambulances: en-route units drift toward the incident.
  const moving = unit.status === "En Route";
  const dx = moving ? (50 - unit.x) * 0.35 : 0;
  const dy = moving ? (48 - unit.y) * 0.35 : 0;

  return (
    <motion.div
      className="absolute"
      initial={{ left: `${unit.x}%`, top: `${unit.y}%` }}
      animate={
        moving
          ? {
              left: [`${unit.x}%`, `${unit.x + dx * 0.5}%`, `${unit.x + dx}%`],
              top:  [`${unit.y}%`, `${unit.y + dy * 0.5}%`, `${unit.y + dy}%`],
            }
          : { left: `${unit.x}%`, top: `${unit.y}%` }
      }
      transition={moving ? { duration: 8 + index, ease: "linear", repeat: Infinity, repeatType: "reverse" } : undefined}
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className="rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold bg-card/95 shadow-sm"
          style={{ borderColor: unit.colorVar, color: unit.colorVar }}
        >
          <div className="leading-tight">{unit.id}</div>
          <div className="text-[9px] opacity-80 -mt-0.5">{unit.status}</div>
        </div>
        {/* 3D-ish ambulance body */}
        <motion.div
          className="relative h-7 w-11 rounded-md shadow-md"
          style={{
            background: `linear-gradient(180deg, ${unit.colorVar}, color-mix(in oklab, ${unit.colorVar} 55%, black))`,
            transform: "perspective(120px) rotateX(35deg)",
            transformStyle: "preserve-3d",
          }}
          animate={moving ? { rotateZ: [-2, 2, -2] } : undefined}
          transition={moving ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : undefined}
        >
          {/* windshield */}
          <div className="absolute left-1 right-4 top-1 h-2.5 rounded-sm bg-white/85" />
          {/* red cross */}
          <div className="absolute right-1 top-1 h-3 w-3 rounded-sm bg-white grid place-items-center">
            <span className="text-destructive text-[8px] font-black leading-none">+</span>
          </div>
          {/* wheels */}
          <div className="absolute -bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-foreground" />
          <div className="absolute -bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-foreground" />
          {/* light bar */}
          {moving && (
            <motion.div
              className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full"
              animate={{ backgroundColor: ["#ef4444", "#3b82f6", "#ef4444"] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </motion.div>
        <span className="h-1.5 w-6 rounded-full blur-[2px] opacity-50" style={{ background: unit.colorVar }} />
      </div>
    </motion.div>
  );
}

function UnitPanel() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="px-4 py-2.5 border-b border-border text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Fleet Panel
      </div>
      <div className="grid grid-cols-5 gap-3 p-3">
        {UNITS.map((u) => (
          <div key={u.id} className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-8 w-12 rounded-sm shrink-0 shadow-sm"
                style={{ background: `linear-gradient(180deg, ${u.colorVar}, color-mix(in oklab, ${u.colorVar} 55%, white))` }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono font-semibold text-foreground">{u.id}</div>
                <div className="text-[10px] text-muted-foreground">{u.kind} Ambulance</div>
              </div>
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                style={{ background: `color-mix(in oklab, ${u.colorVar} 15%, transparent)`, color: u.colorVar, border: `1px solid color-mix(in oklab, ${u.colorVar} 35%, transparent)` }}
              >
                {u.status.toUpperCase()}
              </span>
            </div>
            <div className="space-y-0.5 text-[11px] text-muted-foreground">
              <div>Driver: <span className="text-foreground">{u.driver}</span></div>
              <div>EMT: <span className="text-foreground">{u.emt}</span></div>
              <div className="flex items-center gap-1.5 pt-1.5 mt-1.5 border-t border-border">
                <Wifi className="h-3 w-3 text-success" />
                <BarChart3 className="h-3 w-3 text-primary" />
                <span className="ml-auto font-mono text-foreground/80">{u.eta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ["Received", "Dispatched", "En Route", "On Scene", "Transporting", "At Hospital", "Closed"] as const;

function CallDetailsCard({
  call, isOngoing, currentStatus, onOpenDialog, onOpenPanel, onOpenStatus, onCloseCall,
}: {
  call: Call;
  isOngoing: boolean;
  currentStatus?: typeof STATUS_OPTIONS[number];
  onOpenDialog: () => void;
  onOpenPanel: (p: Panel) => void;
  onOpenStatus: () => void;
  onCloseCall: () => void;
}) {
  return (
    <DeckCard
      title="Call Details"
      badge={isOngoing ? (
        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-success/15 text-success border border-success/30">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> ONGOING
        </span>
      ) : undefined}
      action={<button onClick={onOpenDialog} className="text-[10px] font-semibold uppercase tracking-widest text-primary hover:underline">Full view</button>}
    >
      <div className="p-3">
        <button
          onClick={onOpenDialog}
          className="w-full text-left rounded-lg bg-destructive/5 border border-destructive/30 p-3 mb-3 hover:bg-destructive/10 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-destructive" />
              <span className="text-[11px] font-mono text-foreground">{call.id}</span>
            </div>
            <span className="text-[11px] font-mono tabular-nums text-muted-foreground">{call.timer}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-destructive">{call.type}</div>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${priorityChip[call.priority]}`}>{call.priority}</span>
          </div>
        </button>
        {currentStatus && (
          <div className="mb-3 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Current status</span>
            <span className="text-[11px] font-mono font-bold text-primary">{currentStatus}</span>
          </div>
        )}
        <ul className="space-y-2 text-xs text-foreground/85">
          <Row icon={<MapPin className="h-3.5 w-3.5" />} label={call.address} />
          <Row icon={<Clock className="h-3.5 w-3.5" />} label="Time Received: 14:30:45" />
          <Row icon={<User className="h-3.5 w-3.5" />} label={`Patient: ${call.patient}`} />
          <Row icon={<Stethoscope className="h-3.5 w-3.5" />} label="Symptoms: Unresponsive, not breathing" />
        </ul>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button onClick={onOpenStatus} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-[11px] font-semibold uppercase tracking-widest">
            Update Status
          </Button>
          <Button onClick={onCloseCall} variant="outline" className="text-[11px] font-semibold uppercase tracking-widest">
            Close Call
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button onClick={() => onOpenPanel("hospital")} variant="secondary" size="sm" className="text-[10px] font-semibold uppercase tracking-widest">
            <Hospital className="h-3.5 w-3.5 mr-1" /> Hospital
          </Button>
          <Button onClick={() => onOpenPanel("fleet")} variant="secondary" size="sm" className="text-[10px] font-semibold uppercase tracking-widest">
            <Truck className="h-3.5 w-3.5 mr-1" /> Fleet
          </Button>
          <Button onClick={() => onOpenPanel("messages")} variant="secondary" size="sm" className="text-[10px] font-semibold uppercase tracking-widest">
            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Messages
          </Button>
        </div>
      </div>
    </DeckCard>
  );
}

type Panel = "overview" | "call" | "fleet" | "hospital" | "messages";

const DIALOG_FLEET = [
  { id: "A-01", kind: "ALS", station: "Sheikh Zayed Rd",   dist: 0.8, eta: 2, driver: "Mike Johnson",  available: true },
  { id: "B-02", kind: "BLS", station: "Jumeirah Beach Rd", dist: 1.3, eta: 4, driver: "Chris Lee",     available: true },
  { id: "M-05", kind: "ALS", station: "Station 3",         dist: 2.0, eta: 6, driver: "Emily Clark",   available: true },
  { id: "M-03", kind: "ALS", station: "Al Wasl Rd",        dist: 3.4, eta: 9, driver: "Tom Williams",  available: false },
];
const DIALOG_HOSPITALS = [
  { id: "H01", name: "Metro Medical Center", dist: 3.4, level: "I",  status: "GREEN"  },
  { id: "H03", name: "City General Hospital", dist: 2.1, level: "I",  status: "GREEN"  },
  { id: "H02", name: "Saint Mary Hospital",   dist: 4.7, level: "II", status: "YELLOW" },
];

function CallDetailsDialog({
  call, open, onOpenChange, initialPanel = "overview", onAccept, currentStatus, onStatusChange,
}: {
  call: Call;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialPanel?: Panel;
  onAccept?: (id: string) => void;
  currentStatus?: typeof STATUS_OPTIONS[number];
  onStatusChange?: (s: typeof STATUS_OPTIONS[number]) => void;
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>(currentStatus ?? "Dispatched");
  useEffect(() => { if (currentStatus) setStatus(currentStatus); }, [currentStatus, call.id]);
  const [panel, setPanel] = useState<Panel>(initialPanel);
  const [assignedUnit, setAssignedUnit] = useState<string>("A-01");
  const [assignedHospital, setAssignedHospital] = useState<string>("H01");
  const [onCall, setOnCall] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [recording, setRecording] = useState(true);
  const [chat, setChat] = useState<{ from: "me" | "them"; text: string }[]>([
    { from: "them", text: `${assignedUnit} responding. ETA 4 minutes.` },
  ]);
  const [draft, setDraft] = useState("");

  useEffect(() => { if (open) setPanel(initialPanel); }, [open, initialPanel]);

  useEffect(() => {
    if (!onCall) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [onCall]);
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const startCall = () => {
    try {
      sessionStorage.setItem("cad:activeCall", JSON.stringify({
        id: call.id,
        caller: "John Doe",
        number: "(555) 123-4567",
        type: call.type,
        address: call.address,
        patient: call.patient,
      }));
    } catch { /* ignore */ }
    onAccept?.(call.id);
    onOpenChange(false);
    toast.success(`Call ${call.id} accepted`, { description: "Ongoing on map · Opening call control." });
    navigate({ to: "/portal/cad/calls/active" });
  };
  const endCall = () => { setOnCall(false); setSeconds(0); toast(`${call.id} ended`, { description: `Duration ${timer}` }); };
  const applyStatus = () => { onStatusChange?.(status); };
  const assignFleet = (id: string) => { setAssignedUnit(id); toast.success(`${id} assigned to ${call.id}`); };
  const notifyHospital = (id: string) => { setAssignedHospital(id); toast.success(`Pre-notification sent to ${id}`); };
  const send = () => {
    if (!draft.trim()) return;
    setChat((prev) => [...prev, { from: "me", text: draft.trim() }]);
    setDraft("");
  };

  const tabs: { key: Panel; label: string; icon: typeof PhoneCall }[] = [
    { key: "overview", label: "Overview",     icon: FileText },
    { key: "call",     label: onCall ? `On Call · ${timer}` : "Accept Call", icon: PhoneCall },
    { key: "fleet",    label: "Assign Fleet", icon: Truck },
    { key: "hospital", label: "Hospital",     icon: Hospital },
    { key: "messages", label: "Messages",     icon: MessageSquare },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="text-base font-display">{call.type}</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${priorityChip[call.priority]}`}>{call.priority}</span>
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">{call.id} · {call.timer}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = panel === t.key;
            const isCall = t.key === "call" && onCall;
            return (
              <button
                key={t.key}
                onClick={() => t.key === "call" && !onCall ? startCall() : setPanel(t.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-widest border transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : isCall
                    ? "bg-success/10 text-success border-success/40"
                    : "bg-background text-foreground/70 border-border hover:border-primary/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {panel === "overview" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoTile icon={<MapPin className="h-4 w-4 text-destructive" />} label="Address"  value={call.address} />
                <InfoTile icon={<User    className="h-4 w-4 text-primary" />}     label="Patient"  value={call.patient} />
                <InfoTile icon={<User    className="h-4 w-4 text-primary" />}     label="Caller"   value="John Doe" />
                <InfoTile icon={<Phone   className="h-4 w-4 text-primary" />}     label="Phone"    value="(555) 123-4567" />
                <InfoTile icon={<Stethoscope className="h-4 w-4 text-warning" />} label="Symptoms" value="Unresponsive, not breathing" />
                <InfoTile icon={<FileText className="h-4 w-4 text-muted-foreground" />} label="Notes" value="Bystander CPR in progress." />
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Update Call Status</div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {STATUS_OPTIONS.map((s) => (
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
                <Button onClick={applyStatus} className="w-full" size="sm">Apply Status</Button>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                Assigned: <span className="text-foreground font-mono">{assignedUnit}</span> · Hospital: <span className="text-foreground font-mono">{assignedHospital}</span>
              </div>
            </div>
          )}

          {panel === "call" && (
            <div className="space-y-3">
              <div className={`rounded-lg border p-3 flex items-center gap-3 flex-wrap ${
                onCall ? "border-success/40 bg-success/5" : "border-border bg-muted/40"
              }`}>
                <div className={`h-10 w-10 rounded-full grid place-items-center ${onCall ? "bg-success text-white" : "bg-muted text-muted-foreground"}`}>
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Caller</div>
                  <div className="text-sm font-semibold text-foreground">John Doe · <span className="font-mono text-muted-foreground">(555) 123-4567</span></div>
                </div>
                <div className="font-mono text-2xl tabular-nums text-foreground">{onCall ? timer : "00:00"}</div>
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => setMuted((v) => !v)} disabled={!onCall}>
                    {muted ? "Unmute" : "Mute"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRecording((v) => !v)} disabled={!onCall}
                    className={recording && onCall ? "border-destructive/40 text-destructive" : ""}>
                    {recording ? "● REC" : "Rec"}
                  </Button>
                  {onCall ? (
                    <Button size="sm" onClick={endCall} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">End</Button>
                  ) : (
                    <Button size="sm" onClick={startCall} className="bg-success hover:bg-success/90 text-white">Answer</Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" onClick={() => toast(`Forwarded to Shift Supervisor`)}>Forward call</Button>
                <Button variant="secondary" size="sm" onClick={() => toast(`Calling driver of ${assignedUnit}`)}>Call {assignedUnit} driver</Button>
              </div>
            </div>
          )}

          {panel === "fleet" && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Nearest fleet to caller</div>
              {[...DIALOG_FLEET].sort((a, b) => a.dist - b.dist).map((f) => {
                const isAssigned = assignedUnit === f.id;
                return (
                  <div key={f.id} className={`rounded-lg border p-3 flex items-center gap-3 ${isAssigned ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                    <Truck className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono font-semibold text-foreground">{f.id} <span className="text-[10px] text-muted-foreground">{f.kind}</span></div>
                      <div className="text-[11px] text-muted-foreground">{f.driver} · {f.station} · {f.dist.toFixed(1)} mi · ETA {f.eta} min</div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      f.available ? "bg-success/15 text-success border border-success/30" : "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {f.available ? "AVAILABLE" : "BUSY"}
                    </span>
                    <Button size="sm" variant={isAssigned ? "default" : "secondary"} disabled={!f.available} onClick={() => assignFleet(f.id)}>
                      {isAssigned ? "Assigned" : "Assign"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast(`Calling driver ${f.driver}`)}>
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {panel === "hospital" && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Nearest receiving hospitals</div>
              {DIALOG_HOSPITALS.map((h) => {
                const isSel = assignedHospital === h.id;
                return (
                  <div key={h.id} className={`rounded-lg border p-3 flex items-center gap-3 ${isSel ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                    <Hospital className="h-5 w-5 text-info" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{h.name}</div>
                      <div className="text-[11px] text-muted-foreground">Level {h.level} · {h.dist.toFixed(1)} mi</div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      h.status === "GREEN" ? "bg-success/15 text-success border-success/30" :
                      h.status === "YELLOW" ? "bg-warning/15 text-warning border-warning/30" :
                      "bg-destructive/15 text-destructive border-destructive/30"
                    }`}>{h.status}</span>
                    <Button size="sm" variant={isSel ? "default" : "secondary"} onClick={() => notifyHospital(h.id)}>
                      {isSel ? "Notified" : "Pre-notify"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {panel === "messages" && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Crew · Ops · Hospital thread</div>
              <div className="rounded-lg border border-border bg-background p-3 h-[220px] overflow-y-auto space-y-2">
                {chat.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${
                      m.from === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                    }`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${assignedUnit} crew…`}
                  className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <Button type="submit" size="sm">Send</Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatusUpdateDialog({
  call, open, onOpenChange, currentStatus, onStatusChange,
}: {
  call: Call;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  currentStatus?: typeof STATUS_OPTIONS[number];
  onStatusChange?: (s: typeof STATUS_OPTIONS[number]) => void;
}) {
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>(currentStatus ?? "Dispatched");
  const [note, setNote] = useState("");
  useEffect(() => { if (open) setStatus(currentStatus ?? "Dispatched"); }, [open, currentStatus, call.id]);
  const apply = () => {
    onStatusChange?.(status);
    if (note) toast(`Note logged`, { description: note });
    onOpenChange(false);
    setNote("");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span className="text-base font-display">Update Call Status</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${priorityChip[call.priority]}`}>{call.priority}</span>
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">{call.id} · {call.type}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Select status</div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {STATUS_OPTIONS.map((s) => (
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
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Optional note</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Additional context for crew / ops…"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="flex gap-2 mt-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1" onClick={apply}>Apply Status</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {icon}<span>{label}</span>
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
    </li>
  );
}

function CallTimelineCard() {
  const items = [
    ["14:30:45", "Call Received"],
    ["14:30:46", "Call Created: MED-25-05124"],
    ["14:30:48", "A-01 Dispatched (ALS)"],
    ["14:30:51", "A-01 En Route"],
    ["14:31:15", "A-01 On Scene"],
    ["14:32:00", "Transporting to Hospital"],
    ["14:32:18", "ETA at Hospital: 14:38"],
  ];
  return (
    <DeckCard title="Call Timeline">
      <ul className="p-3 space-y-1.5 text-xs">
        {items.map(([t, l]) => (
          <li key={t} className="flex items-center gap-3">
            <span className="font-mono text-muted-foreground w-16 tabular-nums">{t}</span>
            <span className="text-foreground/85">{l}</span>
          </li>
        ))}
      </ul>
    </DeckCard>
  );
}

function QuickActionsCard() {
  const navigate = useNavigate();
  const actions = [
    { l: "New Call",   icon: PhoneCall,       color: "text-destructive", bg: "bg-destructive/10 border-destructive/30 hover:bg-destructive/15", to: "/portal/cad/calls" },
    { l: "Active Call",icon: PhoneIncoming,   color: "text-warning",     bg: "bg-warning/10 border-warning/30 hover:bg-warning/15",             to: "/portal/cad/calls/active" },
    { l: "Fleet",      icon: Truck,           color: "text-primary",     bg: "bg-primary/10 border-primary/30 hover:bg-primary/15",             to: "/portal/cad/fleet" },
    { l: "Hospitals",  icon: Building2,       color: "text-info",        bg: "bg-info/10 border-info/30 hover:bg-info/15",                     to: "/portal/cad/hospital" },
    { l: "Messages",   icon: MessageSquare,   color: "text-success",     bg: "bg-success/10 border-success/30 hover:bg-success/15",             to: "/portal/cad/messages" },
    { l: "Dashboard",  icon: LayoutDashboard, color: "text-foreground",  bg: "bg-muted border-border hover:bg-muted/70",                        to: "/portal/cad" },
  ] as const;
  return (
    <DeckCard title="Quick Actions">
      <div className="p-3 grid grid-cols-3 gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.l}
              onClick={() => navigate({ to: a.to })}
              className={`flex flex-col items-center gap-1 rounded-lg border py-3 transition-colors ${a.bg}`}
            >
              <Icon className={`h-5 w-5 ${a.color}`} />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/85">{a.l}</span>
            </button>
          );
        })}
      </div>
    </DeckCard>
  );
}

