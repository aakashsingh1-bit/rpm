import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  PhoneCall, PhoneIncoming, PhoneOff, MapPin, Mic, MicOff, Pause, Play,
  Circle, PhoneForwarded, User, Delete, History, Ambulance,
  Volume2, ChevronRight, Radio as RadioIcon, Voicemail,
} from "lucide-react";
import { ModuleGuard, ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/calls")({
  component: () => (
    <ModuleGuard module="calls">
      <CallsPage />
    </ModuleGuard>
  ),
});

const priorities = [
  { p: "P1", label: "Immediate life threat", color: "destructive" },
  { p: "P2", label: "Urgent",                color: "warning" },
  { p: "P3", label: "Non-urgent",            color: "info" },
  { p: "P4", label: "Scheduled IFT",         color: "default" },
  { p: "P5", label: "Advisory",              color: "default" },
];

const callHistory = [
  { id: "CALL-9021", caller: "Ahmed Al Raisi",     num: "+971 50 ••• 2210", p: "P1", loc: "Al Reem Island",       dur: "02:14", rec: true,  time: "09:24", status: "dispatched" },
  { id: "CALL-9020", caller: "Anonymous",          num: "+971 55 ••• 8891", p: "P2", loc: "SZR km 42",            dur: "01:48", rec: true,  time: "09:12", status: "dispatched" },
  { id: "CALL-9019", caller: "Cleveland Clinic",   num: "+971 2 659 0200",  p: "P4", loc: "IFT → SKMC",           dur: "03:02", rec: true,  time: "08:44", status: "scheduled" },
  { id: "CALL-9018", caller: "Mohamed Yousif",     num: "+971 50 ••• 1102", p: "P1", loc: "Yas Marina",           dur: "02:41", rec: true,  time: "08:18", status: "dispatched" },
  { id: "CALL-9017", caller: "Layla Al Fahim",     num: "+971 54 ••• 7712", p: "P3", loc: "Corniche",             dur: "00:58", rec: false, time: "07:55", status: "closed" },
];

const uaeLocations = [
  "Al Reem Island",
  "Yas Marina",
  "Sheikh Zayed Rd km 42",
  "Corniche Rd",
  "Dubai Marina",
  "Khalifa City",
  "Al Ain, Central",
  "Downtown Dubai",
  "Fujairah Corniche",
  "Sharjah, Al Majaz",
];

const nearbyUnits = [
  { id: "A-14", crew: "Rashid Al Ameri",   station: "Abu Dhabi Central", dist: "1.8 km", eta: "3:12", skill: "ALS", score: 96 },
  { id: "A-07", crew: "Yusuf Al Mazrouei", station: "Abu Dhabi Central", dist: "2.9 km", eta: "4:48", skill: "ALS", score: 88 },
  { id: "A-22", crew: "Omar Al Suwaidi",   station: "Al Reem",           dist: "3.4 km", eta: "5:20", skill: "BLS", score: 72 },
];

type ActiveCall = {
  id: string;
  caller: string;
  number: string;
  startedAt: number;
} | null;

function CallsPage() {
  const navigate = useNavigate();

  // Softphone state
  const [dialed, setDialed] = useState("");
  const [active, setActive] = useState<ActiveCall>(null);
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [recording, setRecording] = useState(true);
  const [incoming, setIncoming] = useState<{ id: string; caller: string; number: string } | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Intake form
  const [caller, setCaller] = useState("");
  const [phone, setPhone] = useState("");
  const [loc, setLoc] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>("A-14");

  const timerRef = useRef<number | null>(null);

  // Timer for active call
  useEffect(() => {
    if (active && !held) {
      timerRef.current = window.setInterval(() => setElapsed((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [active, held]);

  // Simulated incoming call
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!active && !incoming) {
        setIncoming({
          id: "CALL-9022",
          caller: "Khalid Al Nuaimi",
          number: "+971 50 ••• 4402",
        });
      }
    }, 5000);
    return () => window.clearTimeout(t);
  }, [active, incoming]);

  const dial = (d: string) => setDialed((v) => (v.length < 15 ? v + d : v));
  const backspace = () => setDialed((v) => v.slice(0, -1));

  const startOutbound = () => {
    if (!dialed) return toast.error("Dial a number first");
    setActive({
      id: `CALL-${Math.floor(9000 + Math.random() * 999)}`,
      caller: "Outbound",
      number: dialed,
      startedAt: Date.now(),
    });
    setElapsed(0);
    setPhone(dialed);
    toast.success("VocalCom SIP · call connected", { description: `Outbound → ${dialed}` });
  };

  const answer = () => {
    if (!incoming) return;
    setActive({
      id: incoming.id,
      caller: incoming.caller,
      number: incoming.number,
      startedAt: Date.now(),
    });
    setCaller(incoming.caller);
    setPhone(incoming.number);
    setLoc(uaeLocations[Math.floor(Math.random() * uaeLocations.length)]);
    setElapsed(0);
    setIncoming(null);
    toast.success("Call answered · reverse-geocoding location");
  };

  const decline = () => {
    setIncoming(null);
    toast("Call declined · sent to voicemail");
  };

  const hangup = () => {
    if (!active) return;
    toast(`Call ended · ${format(elapsed)}${recording ? " · recording saved" : ""}`);
    setActive(null);
    setElapsed(0);
    setMuted(false);
    setHeld(false);
  };

  const dispatch = () => {
    if (!priority) return toast.error("Assign a priority first");
    if (!caller) return toast.error("Caller name required");
    toast.success(`Incident created · routing to CAD`, {
      description: `${selectedUnit} recommended · dispatch in progress`,
    });
    // reset
    setCaller(""); setPhone(""); setLoc(""); setNotes(""); setPriority(null);
    if (active) hangup();
    setTimeout(() => navigate({ to: "/portal/cad" }), 500);
  };

  return (
    <div>
      <ModuleHeader
        module="calls"
        actions={
          <div className="flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5 text-xs text-success">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            VocalCom SIP · connected
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Calls today"   value="342"    tone="info"    icon="PhoneCall"     index={0} />
        <StatCard label="In queue"      value="4"      tone="warning" icon="ListTodo"      index={1} />
        <StatCard label="Avg intake"    value="00:38"  tone="success" icon="Timer"         index={2} />
        <StatCard label="P1 rate"       value="18%"    tone="danger"  icon="AlertOctagon"  index={3} />
      </div>

      {/* Incoming banner */}
      <AnimatePresence>
        {incoming && !active && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 rounded-xl border border-primary bg-gradient-primary text-primary-foreground p-4 flex items-center gap-4 shadow-glow"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="h-12 w-12 rounded-full bg-white/20 grid place-items-center border border-white/30"
            >
              <PhoneIncoming className="h-6 w-6" />
            </motion.div>
            <div className="flex-1">
              <div className="text-[10px] font-mono uppercase tracking-widest opacity-80">
                Incoming · {incoming.id}
              </div>
              <div className="text-lg font-display font-semibold">{incoming.caller}</div>
              <div className="text-xs opacity-90">{incoming.number}</div>
            </div>
            <Button className="bg-success text-white hover:bg-success/90" onClick={answer}>
              <PhoneCall className="h-4 w-4 mr-2" /> Answer
            </Button>
            <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10" onClick={decline}>
              <PhoneOff className="h-4 w-4 mr-2" /> Decline
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid xl:grid-cols-[380px_1fr_360px] lg:grid-cols-[380px_1fr] gap-6">
        {/* ============ LEFT · Softphone ============ */}
        <div className="space-y-6">
          <Panel
            title="Softphone"
            subtitle="VocalCom · SIP · WebRTC"
            actions={
              <div className="text-[10px] font-mono uppercase tracking-widest text-success">
                ● Live
              </div>
            }
          >
            {/* Active call widget */}
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg border border-primary/40 bg-primary/5 p-4 mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground">
                      <User className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{active.caller}</div>
                      <div className="text-xs text-muted-foreground truncate">{active.number}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-semibold tabular-nums text-primary">
                        {format(elapsed)}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {held ? "on hold" : "live"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-5 gap-2">
                    <IconBtn active={muted} onClick={() => setMuted((v) => !v)} label="Mute" icon={muted ? MicOff : Mic} />
                    <IconBtn active={held} onClick={() => setHeld((v) => !v)} label="Hold" icon={held ? Play : Pause} />
                    <IconBtn active={recording} onClick={() => setRecording((v) => !v)} label="Rec" icon={Circle} danger />
                    <IconBtn onClick={() => toast("Transfer to supervisor")} label="Xfer" icon={PhoneForwarded} />
                    <IconBtn onClick={hangup} label="End" icon={PhoneOff} destructive />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Number display */}
            <div className="rounded-lg border border-border bg-surface px-4 py-3 flex items-center gap-2 mb-3">
              <span className="text-lg font-mono tracking-wider flex-1 text-right truncate">
                {dialed || <span className="text-muted-foreground text-sm">Enter number</span>}
              </span>
              <button
                onClick={backspace}
                className="text-muted-foreground hover:text-primary p-1 rounded"
              >
                <Delete className="h-4 w-4" />
              </button>
            </div>

            {/* Dialpad */}
            <div className="grid grid-cols-3 gap-2">
              {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
                <button
                  key={k}
                  onClick={() => dial(k)}
                  className="h-11 rounded-lg border border-border bg-card font-mono text-lg hover:bg-primary/10 hover:border-primary/40 transition-colors active:scale-95"
                >
                  {k}
                </button>
              ))}
            </div>

            <Button
              onClick={active ? hangup : startOutbound}
              className={`mt-3 w-full h-11 ${active ? "bg-destructive text-destructive-foreground" : "bg-gradient-primary text-primary-foreground shadow-glow"}`}
            >
              {active ? <><PhoneOff className="h-4 w-4 mr-2" /> End call</> : <><PhoneCall className="h-4 w-4 mr-2" /> Call</>}
            </Button>
          </Panel>

          <Panel title="Voicemail" subtitle="Unattended overflow">
            <div className="space-y-2">
              {[
                { from: " ", num: "+971 50 ••• 3311", len: "0:22", time: "07:14" },
                { from: "Anonymous",     num: "+971 55 ••• 9977", len: "0:41", time: "06:02" },
              ].map((v) => (
                <div key={v.num} className="flex items-center gap-3 rounded-md border border-border p-2.5">
                  <div className="h-8 w-8 rounded-md bg-primary/10 text-primary grid place-items-center border border-primary/30">
                    <Voicemail className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{v.from}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{v.num} · {v.time}</div>
                  </div>
                  <button className="text-primary hover:text-primary/80"><Play className="h-4 w-4" /></button>
                  <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{v.len}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ============ CENTER · Intake ============ */}
        <div className="space-y-6">
          <Panel
            title="Caller intake"
            subtitle="Live during call · auto-saves every 3 s"
            actions={
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
                Target &lt; 10s to CAD
              </div>
            }
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Caller name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={caller} onChange={(e) => setCaller(e.target.value)} className="pl-9" placeholder="Full name" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <div className="relative">
                    <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" placeholder="+971" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Location(auto-geocoded)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                  <Input value={loc} onChange={(e) => setLoc(e.target.value)} className="pl-9" placeholder="Address / landmark" />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {uaeLocations.slice(0, 4).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLoc(l)}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {l.split(" · ")[1] ?? l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Priority</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {priorities.map((p) => {
                    const isActive = priority === p.p;
                    return (
                      <button
                        key={p.p}
                        onClick={() => setPriority(p.p)}
                        className={`relative rounded-lg border p-2.5 text-center transition-all ${
                          isActive
                            ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                            : "border-border bg-surface hover:border-primary/50"
                        }`}
                      >
                        <div className="text-base font-display font-semibold">{p.p}</div>
                        <div className="text-[9px] mt-0.5 opacity-80 line-clamp-2">{p.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Chief complaint</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Symptoms, mechanism of injury, patient count…"
                  rows={2}
                />
              </div>

              {/* Nearby ambulances */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Nearest units</Label>
                  <span className="text-[10px] font-mono text-muted-foreground">AI-ranked</span>
                </div>
                <div className="space-y-1.5">
                  {nearbyUnits.map((u, i) => (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUnit(u.id)}
                      className={`w-full flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all ${
                        selectedUnit === u.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface hover:border-primary/40"
                      }`}
                    >
                      {i === 0 && (
                        <span className="text-[9px] font-mono bg-gradient-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          #1
                        </span>
                      )}
                      <Ambulance className="h-4 w-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-mono font-semibold">{u.id} <span className="text-[10px] font-sans text-primary ml-1">{u.skill}</span></div>
                        <div className="text-[11px] text-muted-foreground truncate">{u.crew} · {u.station}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono tabular-nums">{u.eta}</div>
                        <div className="text-[10px] text-muted-foreground">{u.dist}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-primary text-primary-foreground shadow-glow"
                  onClick={dispatch}
                >
                  <RadioIcon className="h-4 w-4 mr-2" /> Create incident & dispatch {selectedUnit}
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/portal/cad"><ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </Panel>
        </div>

        {/* ============ RIGHT · Call history / recordings ============ */}
        <div className="space-y-6 xl:block">
          <Panel
            title="Call history"
            subtitle="Last 30 minutes"
            actions={<History className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-2">
              {callHistory.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="rounded-lg border border-border/70 bg-surface/40 p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                        c.p === "P1"
                          ? "text-destructive border-destructive/40 bg-destructive/10"
                          : c.p === "P2"
                            ? "text-warning border-warning/40 bg-warning/10"
                            : "text-info border-info/40 bg-info/10"
                      }`}
                    >
                      {c.p}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{c.id}</span>
                    <span className="ml-auto text-[10px] font-mono text-muted-foreground">{c.time}</span>
                  </div>
                  <div className="text-sm font-medium truncate">{c.caller}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{c.loc}</div>
                  <div className="mt-2 flex items-center gap-2">
                    {c.rec ? (
                      <button
                        onClick={() => toast.success("Playing recording", { description: `${c.id} · ${c.dur}` })}
                        className="flex-1 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 hover:bg-primary/10 px-2 py-1.5 transition-colors"
                      >
                        <Play className="h-3 w-3 text-primary" />
                        <div className="flex-1 h-1 rounded-full bg-primary/20 overflow-hidden">
                          <div className="h-full bg-gradient-primary" style={{ width: `${30 + i * 15}%` }} />
                        </div>
                        <Volume2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] font-mono text-muted-foreground">{c.dur}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">Not recorded</span>
                    )}
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      c.status === "dispatched"
                        ? "bg-success/10 text-success"
                        : c.status === "scheduled"
                          ? "bg-info/10 text-info"
                          : "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  icon: I, label, onClick, active, destructive, danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  active?: boolean;
  destructive?: boolean;
  danger?: boolean;
}) {
  const cls = destructive
    ? "bg-destructive text-destructive-foreground border-destructive/70"
    : active
      ? danger
        ? "bg-destructive/10 border-destructive/60 text-destructive"
        : "bg-primary/10 border-primary/60 text-primary"
      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary";
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 rounded-md border py-2 text-[10px] transition-all active:scale-95 ${cls}`}>
      <I className={`h-4 w-4 ${active && danger ? "fill-destructive" : ""}`} />
      {label}
    </button>
  );
}

function format(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
