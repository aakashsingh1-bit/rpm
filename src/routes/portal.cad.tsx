import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles, CheckCheck, X, Radio as RadioIcon, Ambulance, Users, Smartphone,
  Building2, ArrowRight, Plus, ArrowUpDown, RefreshCw, MessageSquare, Navigation,
  Send, Hospital, ExternalLink, Clock, MapPin, User, Activity, FileText,
} from "lucide-react";
import { ModuleGuard, ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/cad")({
  component: () => (
    <ModuleGuard module="cad">
      <CadPage />
    </ModuleGuard>
  ),
});

type Priority = "P1" | "P2" | "P3" | "P4" | "P5";
type Status = "Queued" | "Assigned" | "En route" | "On scene" | "Transporting" | "At hospital";

interface Patient {
  name: string;
  age: number;
  sex: "M" | "F";
  complaint: string;
  vitals: { hr: string; bp: string; spo2: string; gcs: string };
}

interface Incident {
  id: string;
  p: Priority;
  type: string;
  loc: string;
  area?: string;
  unit: string | null;
  status: Status;
  eta: string;
  hospital: string | null;
  age: number; // seconds since created
  patient?: Patient;
  distanceKm?: number;
  speedKph?: number;
}

const HOSPITALS = [
  "Sheikh Khalifa Medical City",
  "Cleveland Clinic Abu Dhabi",
  "Mafraq Hospital",
  "Burjeel Medical City",
  "Tawam Hospital",
];

const UNITS = [
  { id: "A-14", crew: "Rashid Al Ameri · Fatima Yousif",  station: "Abu Dhabi Central", dist: "1.8 km", eta: "3:12", skill: "ALS", score: 96, available: false },
  { id: "A-07", crew: "Yusuf Al Mazrouei · Layla Hassan", station: "Abu Dhabi Central", dist: "2.9 km", eta: "4:48", skill: "ALS", score: 88, available: true },
  { id: "A-22", crew: "Omar Al Suwaidi · Nadia Al Falasi", station: "Al Reem",           dist: "3.4 km", eta: "5:20", skill: "BLS", score: 72, available: true },
  { id: "A-31", crew: "Ali Al Kaabi · Mira Al Jaberi",     station: "Corniche",          dist: "4.8 km", eta: "7:04", skill: "ALS", score: 64, available: true },
  { id: "A-09", crew: "Hamad Al Dhaheri · Amina Saleh",    station: "Yas",               dist: "5.6 km", eta: "8:10", skill: "ALS", score: 58, available: true },
];

const INITIAL: Incident[] = [
  { id: "INC-8842", p: "P1", type: "Cardiac arrest",     loc: "Yas Marina",           unit: "A-14", status: "En route",    eta: "02:11", hospital: "Cleveland Clinic Abu Dhabi", age: 132, distanceKm: 1.8, speedKph: 62, patient: { name: "Khalid Al Nuaimi", age: 58, sex: "M", complaint: "STEMI · chest pain 45m", vitals: { hr: "128", bp: "92/58", spo2: "94%", gcs: "14" } } },
  { id: "INC-8841", p: "P1", type: "Chest pain",         loc: "Al Reem Island",       unit: "A-07", status: "Assigned",    eta: "04:48", hospital: null, age: 48, distanceKm: 2.9, speedKph: 0, patient: { name: "Fatima Al Marri", age: 47, sex: "F", complaint: "Chest tightness", vitals: { hr: "104", bp: "138/86", spo2: "97%", gcs: "15" } } },
  { id: "INC-8840", p: "P2", type: "RTA · 2 patients",   loc: "SZR km 42",            unit: "A-22", status: "On scene",    eta: "—",     hospital: "Sheikh Khalifa Medical City", age: 612, distanceKm: 0, speedKph: 0, patient: { name: "Ahmed / Layla", age: 32, sex: "M", complaint: "MVA · blunt trauma", vitals: { hr: "112", bp: "118/74", spo2: "96%", gcs: "13" } } },
  { id: "INC-8839", p: "P3", type: "IFT · post-op",      loc: "Cleveland Clinic AD",  unit: "A-31", status: "Transporting", eta: "05:30", hospital: "Sheikh Khalifa Medical City", age: 890, distanceKm: 4.2, speedKph: 48, patient: { name: "Mariam Al Hosani", age: 63, sex: "F", complaint: "Post-op stable transfer", vitals: { hr: "82", bp: "124/78", spo2: "99%", gcs: "15" } } },
  { id: "INC-8838", p: "P2", type: "Fall injury",        loc: "Marina Mall",          unit: null,   status: "Queued",      eta: "—",     hospital: null, age: 22, distanceKm: undefined, speedKph: 0 },
];

const PRIORITY_STYLES: Record<Priority, string> = {
  P1: "text-destructive border-destructive/40 bg-destructive/10",
  P2: "text-warning border-warning/40 bg-warning/10",
  P3: "text-info border-info/40 bg-info/10",
  P4: "text-muted-foreground border-border bg-surface",
  P5: "text-muted-foreground border-border bg-surface",
};

const STATUS_STYLES: Record<Status, string> = {
  "Queued":       "text-warning border-warning/40 bg-warning/10",
  "Assigned":     "text-info border-info/40 bg-info/10",
  "En route":     "text-primary border-primary/40 bg-primary/10",
  "On scene":     "text-info border-info/40 bg-info/10",
  "Transporting": "text-primary border-primary/40 bg-primary/10",
  "At hospital":  "text-success border-success/40 bg-success/10",
};

function CadPage() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL);
  const [selectedId, setSelectedId] = useState<string>(INITIAL[0].id);
  const [assignUnit, setAssignUnit] = useState<string>("A-07");
  const [msg, setMsg] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [unitDetailId, setUnitDetailId] = useState<string | null>(null);
  const [nType, setNType] = useState("");
  const [nLoc, setNLoc] = useState("");
  const [nPri, setNPri] = useState<Priority>("P2");

  const active = incidents.find((i) => i.id === selectedId) ?? incidents[0];

  const update = (id: string, patch: Partial<Incident>) =>
    setIncidents((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const createIncident = () => {
    if (!nType || !nLoc) return toast.error("Type and location are required");
    const id = `INC-${8843 + incidents.length}`;
    const next: Incident = { id, p: nPri, type: nType, loc: nLoc, unit: null, status: "Queued", eta: "—", hospital: null, age: 0 };
    setIncidents((l) => [next, ...l]);
    setSelectedId(id);
    setCreateOpen(false); setNType(""); setNLoc(""); setNPri("P2");
    toast.success(`${id} created`, { description: "Queued for dispatch" });
  };

  const assign = () => {
    if (!active) return;
    const unit = UNITS.find((u) => u.id === assignUnit);
    update(active.id, { unit: assignUnit, status: "Assigned", eta: unit?.eta ?? "—" });
    toast.success(`${assignUnit} assigned to ${active.id}`, { description: `Crew notified · ETA ${unit?.eta ?? "—"}` });
  };

  const reassign = (unitId: string) => {
    update(active.id, { unit: unitId, status: "Assigned", eta: UNITS.find((u) => u.id === unitId)?.eta ?? "—" });
    toast(`${active.id} reassigned to ${unitId}`, { description: "Previous unit released" });
  };

  const changePriority = (p: Priority) => {
    update(active.id, { p });
    toast(`${active.id} priority → ${p}`);
  };

  const advance = () => {
    const flow: Status[] = ["Queued", "Assigned", "En route", "On scene", "Transporting", "At hospital"];
    const idx = flow.indexOf(active.status);
    const nextStatus = flow[Math.min(idx + 1, flow.length - 1)];
    update(active.id, { status: nextStatus });
    toast(`${active.id} → ${nextStatus}`);
  };

  const sendMsg = () => {
    if (!msg.trim()) return;
    toast.success(`Message sent to ${active.unit ?? "unassigned"}`, { description: msg });
    setMsg("");
  };

  const routeHospital = (h: string) => {
    update(active.id, { hospital: h });
    toast.success(`Destination set: ${h}`, { description: `Pre-alert sent · Hospital coordination notified` });
  };

  return (
    <div>
      <ModuleHeader
        module="cad"
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-action text-white">
                <Plus className="h-4 w-4 mr-2" /> Create incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New incident</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Nature</Label><Input value={nType} onChange={(e) => setNType(e.target.value)} placeholder="e.g. Chest pain" /></div>
                <div><Label>Location</Label><Input value={nLoc} onChange={(e) => setNLoc(e.target.value)} placeholder="Address / landmark" /></div>
                <div>
                  <Label>Priority</Label>
                  <Select value={nPri} onValueChange={(v) => setNPri(v as Priority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1">P1 · Immediate life threat</SelectItem>
                      <SelectItem value="P2">P2 · Urgent</SelectItem>
                      <SelectItem value="P3">P3 · Non-urgent</SelectItem>
                      <SelectItem value="P4">P4 · Scheduled IFT</SelectItem>
                      <SelectItem value="P5">P5 · Advisory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={createIncident} className="bg-gradient-primary text-primary-foreground">Create & queue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Open incidents" value={incidents.length} tone="danger" icon="Siren" index={0} />
        <StatCard label="Available units" value={UNITS.filter((u) => u.available).length} tone="success" icon="Ambulance" index={1} />
        <StatCard label="Avg dispatch" value="8.4s" tone="info" icon="Zap" index={2} />
        <StatCard label="AI accuracy" value="94%" tone="warning" icon="Sparkles" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
        {/* Incident queue */}
        <Panel title="Incident queue" subtitle="Priority-sorted · click to open">
          <div className="space-y-2">
            {incidents.map((i, idx) => (
              <motion.button
                key={i.id}
                onClick={() => setSelectedId(i.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`w-full text-left rounded-lg border p-3 transition-all ${
                  active.id === i.id ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-surface hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[i.p]}`}>{i.p}</span>
                  <span className="text-xs font-mono text-muted-foreground">{i.id}</span>
                  <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[i.status]}`}>{i.status}</span>
                </div>
                <div className="text-sm font-medium mt-2">{i.type}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>{i.loc}</span>
                  <span className="font-mono">{i.unit ?? "—"}</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); setSelectedId(i.id); setDetailsOpen(true); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { setSelectedId(i.id); setDetailsOpen(true); } }}
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-primary hover:underline cursor-pointer"
                  >
                    Open details <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </Panel>

        {/* Active incident */}
        <Panel
          title={`${active.id} · ${active.type}`}
          subtitle={`${active.loc} · Priority ${active.p} · ${active.status}`}
          actions={
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI dispatch
            </div>
          }
        >
          {/* Map surrogate */}
          <div className="relative h-52 rounded-lg overflow-hidden border border-border bg-surface mb-5 bg-grid">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,_oklch(0.58_0.22_255_/_0.25),_transparent_60%)]" />
            <div className="absolute left-[60%] top-[40%]">
              <span className="absolute inline-flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-destructive opacity-60" />
              <span className="relative flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive border-2 border-background" />
              <div className="absolute -top-8 left-2 text-[10px] font-mono bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">INC</div>
            </div>
            {[{ x: 20, y: 25 }, { x: 35, y: 60 }, { x: 75, y: 70 }, { x: 15, y: 80 }].map((pt, i) => (
              <div key={i} className="absolute" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                <div className="h-3 w-3 rounded-full bg-primary/80 shadow-glow border-2 border-background -translate-x-1/2 -translate-y-1/2" />
              </div>
            ))}
            <div className="absolute bottom-2 right-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-background/70 px-2 py-1 rounded">
              LIVE GPS · {UNITS.length} units
            </div>
            {active.unit && (
              <div className="absolute top-2 left-2 text-[10px] font-mono bg-primary text-primary-foreground px-2 py-1 rounded flex items-center gap-1">
                <Navigation className="h-3 w-3" /> {active.unit} · ETA {active.eta}
              </div>
            )}
          </div>

          {/* Dispatcher toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {(["P1","P2","P3","P4","P5"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => changePriority(p)}
                className={`text-[10px] font-mono px-2 py-1 rounded border transition-all ${
                  active.p === p ? PRIORITY_STYLES[p] + " ring-1 ring-primary" : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <ArrowUpDown className="h-3 w-3 inline mr-1" /> {p}
              </button>
            ))}
            <div className="mx-1 h-5 w-px bg-border" />
            <Button size="sm" variant="outline" onClick={advance}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Advance status
            </Button>
          </div>

          {/* Unit assign + reassign */}
          <div className="rounded-lg border border-border bg-surface/40 p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold">Assign / reassign unit</div>
              <span className="text-[10px] font-mono text-muted-foreground">AI-ranked</span>
            </div>
            <div className="space-y-1.5">
              {UNITS.map((u, i) => {
                const isCurrent = active.unit === u.id;
                return (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 rounded-md border p-2 ${
                      isCurrent ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    {i === 0 && !isCurrent && (
                      <span className="text-[9px] font-mono bg-gradient-primary text-primary-foreground px-1 py-0.5 rounded">#1</span>
                    )}
                    <Ambulance className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono font-semibold">
                        {u.id} <span className="text-[10px] font-sans text-primary ml-1">{u.skill}</span>
                        {isCurrent && <span className="ml-2 text-[10px] font-sans text-success">current</span>}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">{u.crew} · {u.station}</div>
                    </div>
                    <div className="text-right w-16">
                      <div className="text-sm font-mono tabular-nums">{u.eta}</div>
                      <div className="text-[10px] text-muted-foreground">{u.dist}</div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setUnitDetailId(u.id)} title="View unit details">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    {isCurrent ? (
                      <Button size="sm" variant="outline" onClick={() => update(active.id, { unit: null, status: "Queued", eta: "—" })}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    ) : active.unit ? (
                      <Button size="sm" variant="outline" onClick={() => reassign(u.id)}>Reassign</Button>
                    ) : (
                      <Button
                        size="sm"
                        className={assignUnit === u.id ? "bg-gradient-primary text-primary-foreground" : ""}
                        variant={assignUnit === u.id ? "default" : "outline"}
                        onClick={() => { setAssignUnit(u.id); assign(); }}
                      >
                        <CheckCheck className="h-3.5 w-3.5 mr-1" /> Assign
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hospital destination */}
          <div className="rounded-lg border border-border bg-surface/40 p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold flex items-center gap-1.5">
                <Hospital className="h-3.5 w-3.5 text-primary" /> Hospital destination
              </div>
              {active.hospital && (
                <Link to="/portal/hospital" className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1">
                  Open handover <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            <Select value={active.hospital ?? ""} onValueChange={routeHospital}>
              <SelectTrigger><SelectValue placeholder="Route patient to…" /></SelectTrigger>
              <SelectContent>{HOSPITALS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {/* Comms */}
          <div className="rounded-lg border border-border bg-surface/40 p-3 mb-4">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Comms · {active.unit ?? "no unit"}
            </div>
            <div className="flex gap-2">
              <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message crew…" onKeyDown={(e) => e.key === "Enter" && sendMsg()} />
              <Button onClick={sendMsg} className="bg-gradient-primary text-primary-foreground"><Send className="h-4 w-4" /></Button>
              <Button variant="outline" onClick={() => toast("Radio channel opened", { description: `Voice to ${active.unit ?? "TAC-1"}` })}>
                <RadioIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Fan-out cross-links (always visible for assigned incidents) */}
          <AnimatePresence>
            {active.unit && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="rounded-lg border border-success/30 bg-success/10 p-3">
                <div className="text-xs text-success flex items-center gap-2 mb-2">
                  <CheckCheck className="h-3.5 w-3.5" />
                  Fan-out active · Fleet · Crew · Field App · Hospital
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { to: "/portal/fleet",    icon: Ambulance,  label: "Fleet",     note: `${active.unit} · GPS live` },
                    { to: "/portal/crew",     icon: Users,      label: "Crew",      note: "Assignment logged" },
                    { to: "/portal/mobile",   icon: Smartphone, label: "Field App", note: "Push sent" },
                    { to: "/portal/hospital", icon: Building2,  label: "Hospital",  note: active.hospital ?? "Pending route" },
                  ].map((l) => (
                    <Link key={l.to} to={l.to} className="group rounded-md border border-border bg-surface p-2.5 hover:border-primary/50 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <l.icon className="h-3.5 w-3.5 text-primary" />
                        <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-[11px] font-medium">{l.label}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{l.note}</div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>
      </div>

      {/* Full incident details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[active.p]}`}>{active.p}</span>
              <span className="font-mono">{active.id}</span>
              <span className="text-muted-foreground">·</span>
              <span>{active.type}</span>
              <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[active.status]}`}>{active.status}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Clickable status stepper */}
          <div className="rounded-lg border border-border bg-surface/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Call status · click to update
              </div>
              <span className="text-[10px] font-mono text-primary">Live</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(["Queued","Assigned","En route","On scene","Transporting","At hospital"] as Status[]).map((s, i, arr) => {
                const flowIdx = arr.indexOf(active.status);
                const done = i <= flowIdx;
                return (
                  <button
                    key={s}
                    onClick={() => { update(active.id, { status: s }); toast(`${active.id} → ${s}`); }}
                    className={`text-[10px] font-mono px-2 py-1 rounded border transition-all ${
                      s === active.status ? "bg-gradient-primary text-primary-foreground border-primary shadow-glow"
                        : done ? "border-success/40 bg-success/10 text-success"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {i + 1}. {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-surface/60 p-3 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Incident</div>
              <DetailRow icon={MapPin} label="Location" value={active.loc} />
              <DetailRow icon={Clock} label="ETA" value={active.eta} />
              <DetailRow icon={Activity} label="Age" value={`${Math.floor(active.age / 60)}m ${active.age % 60}s`} />
            </div>
            <div className="rounded-lg border border-border bg-surface/60 p-3 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Assigned unit & crew</div>
              {active.unit ? (() => {
                const u = UNITS.find((x) => x.id === active.unit);
                return (
                  <>
                    <DetailRow icon={Ambulance} label={active.unit} value={`${u?.skill ?? ""} · ${u?.station ?? ""}`} />
                    <DetailRow icon={User} label="Crew" value={u?.crew ?? "—"} />
                    <DetailRow icon={Navigation} label="Distance" value={u?.dist ?? "—"} />
                  </>
                );
              })() : (
                <div className="text-xs text-muted-foreground">No unit assigned. Use "Assign / reassign unit" panel.</div>
              )}
            </div>

            {/* Pickup location & area (dispatcher-editable, pushed live to driver) */}
            <div className="rounded-lg border border-border bg-surface/60 p-3 md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Patient pickup location · shared live with driver
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-success">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  LIVE GPS
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Address / landmark</Label>
                  <Input
                    value={active.loc}
                    onChange={(e) => update(active.id, { loc: e.target.value })}
                    placeholder="e.g. Al Reem Island, Tower 3, Lobby A"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Area / zone</Label>
                  <Select
                    value={active.area ?? ""}
                    onValueChange={(v) => update(active.id, { area: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select area…" /></SelectTrigger>
                    <SelectContent>
                      {["Abu Dhabi Central", "Al Reem Island", "Yas Island", "Corniche", "Saadiyat", "Khalifa City", "Al Bateen", "Mussafah"].map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-[11px] text-muted-foreground">
                  Driver sees this pin, address and area live in the field app · GPS updates every 3s.
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-primary text-primary-foreground"
                  onClick={() => toast.success(`Pickup pushed to ${active.unit ?? "unassigned unit"}`, { description: `${active.loc} · Live GPS pin shared` })}
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Push pickup to driver
                </Button>
              </div>
            </div>

            {/* Patient info */}
            <div className="rounded-lg border border-border bg-surface/60 p-3 md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Patient · en-route summary</div>
                <Link to="/portal/epcr" className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1">
                  Open ePCR <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {active.patient ? (
                <>
                  <div className="grid md:grid-cols-3 gap-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Name</Label>
                      <Input value={active.patient.name} onChange={(e) => update(active.id, { patient: { ...active.patient!, name: e.target.value } })} />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Age / Sex</Label>
                      <Input value={`${active.patient.age} · ${active.patient.sex}`} readOnly />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Chief complaint</Label>
                      <Input value={active.patient.complaint} onChange={(e) => update(active.id, { patient: { ...active.patient!, complaint: e.target.value } })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(["hr","bp","spo2","gcs"] as const).map((k) => (
                      <div key={k} className="rounded-md border border-border bg-card p-2 text-center">
                        <div className="text-[9px] font-mono uppercase text-muted-foreground">{k}</div>
                        <div className="text-sm font-mono font-semibold tabular-nums">{active.patient!.vitals[k]}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">No patient captured yet — crew will populate at scene.</div>
              )}
            </div>

            {/* Live movement */}
            <div className="rounded-lg border border-border bg-surface/60 p-3 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Live movement · patient on move</div>
                <Button size="sm" variant="outline" onClick={() => { update(active.id, { distanceKm: Math.max(0, (active.distanceKm ?? 3) - 0.4), speedKph: 40 + Math.round(Math.random() * 30) }); toast("GPS refreshed"); }}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh GPS
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-md border border-border bg-card p-2">
                  <div className="text-[9px] font-mono uppercase text-muted-foreground">Distance to dest.</div>
                  <div className="text-sm font-mono font-semibold tabular-nums">{active.distanceKm != null ? `${active.distanceKm.toFixed(1)} km` : "—"}</div>
                </div>
                <div className="rounded-md border border-border bg-card p-2">
                  <div className="text-[9px] font-mono uppercase text-muted-foreground">Speed</div>
                  <div className="text-sm font-mono font-semibold tabular-nums">{active.speedKph != null ? `${active.speedKph} kph` : "—"}</div>
                </div>
                <div className="rounded-md border border-border bg-card p-2">
                  <div className="text-[9px] font-mono uppercase text-muted-foreground">ETA</div>
                  <div className="text-sm font-mono font-semibold tabular-nums">{active.eta}</div>
                </div>
                <div className="rounded-md border border-border bg-card p-2">
                  <div className="text-[9px] font-mono uppercase text-muted-foreground">Status</div>
                  <div className="text-sm font-mono font-semibold">{active.status}</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface/60 p-3 space-y-2 md:col-span-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Hospital destination</div>
              <Select value={active.hospital ?? ""} onValueChange={routeHospital}>
                <SelectTrigger><SelectValue placeholder="Route patient to…" /></SelectTrigger>
                <SelectContent>{HOSPITALS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
              </Select>
            </div>


            <div className="rounded-lg border border-border bg-surface/60 p-3 md:col-span-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Timeline</div>
              <ol className="space-y-2 text-xs">
                {[
                  { at: "09:04", text: `${active.id} created · ${active.type}` },
                  active.unit ? { at: "09:06", text: `${active.unit} assigned · crew notified` } : null,
                  active.status !== "Queued" ? { at: "09:08", text: `Status → ${active.status}` } : null,
                  active.hospital ? { at: "09:10", text: `Pre-alert sent to ${active.hospital}` } : null,
                ].filter(Boolean).map((e, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground w-10 pt-0.5">{e!.at}</span>
                    <span className="flex-1">{e!.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { to: "/portal/fleet",    icon: Ambulance,  label: "Fleet",     note: active.unit ? `${active.unit} · GPS` : "Pending" },
                { to: "/portal/crew",     icon: Users,      label: "Crew",      note: active.unit ? "Assigned" : "—" },
                { to: "/portal/mobile",   icon: Smartphone, label: "Field App", note: active.unit ? "Push sent" : "—" },
                { to: "/portal/hospital", icon: Building2,  label: "Hospital",  note: active.hospital ?? "Pending" },
                { to: "/portal/hospital/handover", icon: FileText, label: "Handover", note: active.hospital ? "Ready" : "—" },
                { to: "/portal/epcr", icon: FileText, label: "ePCR", note: "Open record" },
                { to: "/portal/dispatchers", icon: RadioIcon, label: "Dispatcher", note: "Desk" },
                { to: "/portal/analytics", icon: Sparkles, label: "Analytics", note: "AI insights" },
              ].map((l) => (
                <Link key={l.to + l.label} to={l.to} className="group rounded-md border border-border bg-surface p-2.5 hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <l.icon className="h-3.5 w-3.5 text-primary" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="text-[11px] font-medium">{l.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{l.note}</div>
                </Link>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            <Button className="bg-gradient-primary text-primary-foreground" onClick={advance}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Advance status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unit detail dialog */}
      <Dialog open={!!unitDetailId} onOpenChange={(o) => !o && setUnitDetailId(null)}>
        <DialogContent className="max-w-lg">
          {(() => {
            const u = UNITS.find((x) => x.id === unitDetailId);
            if (!u) return null;
            const assignedIncident = incidents.find((i) => i.unit === u.id);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Ambulance className="h-5 w-5 text-primary" />
                    <span className="font-mono">{u.id}</span>
                    <span className="text-xs font-sans text-primary">{u.skill}</span>
                    <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border ${u.available ? "text-success border-success/40 bg-success/10" : "text-warning border-warning/40 bg-warning/10"}`}>
                      {u.available ? "Available" : "On call"}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="rounded-lg border border-border bg-surface/60 p-3 space-y-2">
                    <DetailRow icon={User} label="Crew" value={u.crew} />
                    <DetailRow icon={Building2} label="Station" value={u.station} />
                    <DetailRow icon={Navigation} label="Distance" value={u.dist} />
                    <DetailRow icon={Clock} label="ETA" value={u.eta} />
                    <DetailRow icon={Sparkles} label="AI score" value={`${u.score}/100`} />
                  </div>
                  <div className="rounded-lg border border-border bg-surface/60 p-3">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Current assignment</div>
                    {assignedIncident ? (
                      <div className="text-xs space-y-1">
                        <div className="font-medium">{assignedIncident.id} · {assignedIncident.type}</div>
                        <div className="text-muted-foreground">{assignedIncident.loc} → {assignedIncident.hospital ?? "route TBD"}</div>
                        <div className="text-muted-foreground">Status: {assignedIncident.status}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">No active incident.</div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUnitDetailId(null)}>Close</Button>
                  {!assignedIncident && (
                    <Button className="bg-gradient-primary text-primary-foreground" onClick={() => { setAssignUnit(u.id); assign(); setUnitDetailId(null); }}>
                      <CheckCheck className="h-4 w-4 mr-1.5" /> Assign to {active.id}
                    </Button>
                  )}
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ icon: I, label, value }: { icon: typeof Ambulance; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <I className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-muted-foreground w-20">{label}</span>
      <span className="flex-1 font-medium truncate">{value}</span>
    </div>
  );
}
