import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ambulance, Bell, Phone, MessageSquare, MapPin, Navigation as NavIcon,
  HeartPulse, ClipboardCheck, User, Settings, Home, ListChecks, Menu,
  Signal, Wifi, Battery, Fingerprint, LogOut, ChevronRight, ChevronLeft,
  Play, Pause, Check, AlertCircle, Building2, Radio, Clock, Activity,
  Shield, Languages, KeyRound, Info, Search, PhoneCall, Send, Volume2,
  Circle, CheckCircle2,
} from "lucide-react";
import { ModuleGuard, ModuleHeader } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/mobile")({
  component: () => (
    <ModuleGuard module="mobile">
      <MobilePage />
    </ModuleGuard>
  ),
});

type Screen =
  | "dashboard" | "dispatches" | "active" | "navigation" | "patient"
  | "epcr" | "hospital" | "comms" | "notifications" | "profile" | "more";

const DISPATCHES = [
  { id: "INC-8842", type: "STEMI · cardiac", priority: "P1", patient: "Khalid Al Nuaimi", pickup: "Al Reem, Tower 3", hospital: "Cleveland Clinic AD", dispatch: "09:04", eta: "3:12", status: "New" as const },
  { id: "INC-8841", type: "Chest pain", priority: "P1", patient: "Fatima Al Marri", pickup: "Corniche Rd, Bldg 7", hospital: "SKMC", dispatch: "09:22", eta: "5:44", status: "Accepted" as const },
  { id: "INC-8836", type: "Fall · elderly", priority: "P3", patient: "Rashid Al Ali", pickup: "Al Bateen Villa 21", hospital: "Burjeel", dispatch: "08:41", eta: "—", status: "Completed" as const },
];

const STATUS_STEPS = [
  "Accepted", "En route", "Arrived at scene", "Patient on board",
  "En route to hospital", "Arrived at hospital", "Handover completed", "Available",
] as const;

const NOTIFS = [
  { at: "09:41", kind: "dispatch", text: "New P1 assigned · INC-8842" },
  { at: "09:38", kind: "hospital", text: "SKMC Bay 3 ready · trauma team standing by" },
  { at: "09:22", kind: "dispatch", text: "Pre-alert sent to Cleveland Clinic AD" },
  { at: "08:55", kind: "shift", text: "Shift begins in 5 min · Station 14" },
  { at: "08:10", kind: "system", text: "App updated to v2.4.1" },
];

const MESSAGES = [
  { from: "Dispatch · Sara", at: "09:41", text: "STEMI activation for INC-8842. Cath lab ready.", me: false },
  { from: "You", at: "09:41", text: "Copy. En route in 30s.", me: true },
  { from: "SKMC ER", at: "09:39", text: "Bay 3 ready, team on standby.", me: false },
];

export function CrewPhone() {
  const [signedIn, setSignedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>("dashboard");

  return (
    <div className="relative w-[380px] h-[780px] rounded-[46px] border-[10px] border-neutral-900 bg-black shadow-elegant overflow-hidden">
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-6 w-32 bg-black rounded-b-2xl" />
      {/* Status bar */}
      <div className="absolute top-0 inset-x-0 h-8 z-20 flex items-center justify-between px-6 text-[10px] font-mono text-foreground/80 bg-background">
        <span>09:42</span>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-3 w-3" />
        </div>
      </div>

      {/* App body */}
      <div className="h-full pt-8 pb-16 bg-background flex flex-col">
        <AnimatePresence mode="wait">
          {!signedIn ? (
            <LoginScreen key="login" onLogin={() => { setSignedIn(true); toast.success("Signed in · Unit A-14"); }} />
          ) : (
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex-1 overflow-y-auto"
            >
              {screen === "dashboard" && <DashboardScreen go={setScreen} />}
              {screen === "dispatches" && <DispatchesScreen go={setScreen} />}
              {screen === "active" && <ActiveScreen go={setScreen} />}
              {screen === "navigation" && <NavigationScreen back={() => setScreen("active")} />}
              {screen === "patient" && <PatientScreen back={() => setScreen("active")} />}
              {screen === "epcr" && <EpcrScreen back={() => setScreen("more")} />}
              {screen === "hospital" && <HospitalScreen back={() => setScreen("more")} />}
              {screen === "comms" && <CommsScreen back={() => setScreen("more")} />}
              {screen === "notifications" && <NotificationsScreen back={() => setScreen("dashboard")} />}
              {screen === "profile" && <ProfileScreen back={() => setScreen("more")} onSignOut={() => { setSignedIn(false); setScreen("dashboard"); toast("Signed out"); }} />}
              {screen === "more" && <MoreScreen go={setScreen} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      {signedIn && (
        <div className="absolute bottom-0 inset-x-0 z-20 h-16 bg-card/95 backdrop-blur border-t border-border grid grid-cols-5">
          <TabBtn icon={Home} label="Home" active={screen === "dashboard"} onClick={() => setScreen("dashboard")} />
          <TabBtn icon={ListChecks} label="Dispatch" active={screen === "dispatches"} onClick={() => setScreen("dispatches")} />
          <TabBtn icon={Ambulance} label="Active" active={screen === "active"} onClick={() => setScreen("active")} highlight />
          <TabBtn icon={Bell} label="Alerts" active={screen === "notifications"} onClick={() => setScreen("notifications")} />
          <TabBtn icon={Menu} label="More" active={["more", "epcr", "hospital", "comms", "profile", "patient", "navigation"].includes(screen)} onClick={() => setScreen("more")} />
        </div>
      )}

      {/* Home indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-foreground/60" />
    </div>
  );
}

function MobilePage() {
  return (
    <div>
      <ModuleHeader
        module="mobile"
        actions={
          <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary">
            <Ambulance className="h-3.5 w-3.5" /> Field crew · mobile only
          </div>
        }
      />

      <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
        <div className="mx-auto"><CrewPhone /></div>

        {/* Side info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-widest text-primary font-mono mb-2">Prototype · mobile app</div>
            <h3 className="text-xl font-display font-semibold mb-2">Ambulance User App</h3>
            <p className="text-sm text-muted-foreground">
              Interactive preview of the field crew mobile experience — login, dispatches, active incident status flow,
              in-app navigation, ePCR, hospital handover, phone dialer comms, notifications & settings.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h4 className="text-sm font-semibold mb-3">Modules included</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["Login", Fingerprint], ["Dashboard", Home], ["My Dispatches", ListChecks],
                ["Active Incident", Ambulance], ["Navigation", NavIcon], ["Patient Info", User],
                ["ePCR", HeartPulse], ["Hospital", Building2], ["Comms Center", Radio],
                ["Notifications", Bell], ["Profile", Settings],
              ].map(([label, Icon]) => {
                const I = Icon as typeof Fingerprint;
                return (
                  <div key={label as string} className="flex items-center gap-2 rounded-lg border border-border/60 bg-surface/40 px-2.5 py-2">
                    <I className="h-3.5 w-3.5 text-primary" />
                    <span>{label as string}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- shared -------------------- */

function TabBtn({ icon: I, label, active, onClick, highlight }: {
  icon: typeof Home; label: string; active: boolean; onClick: () => void; highlight?: boolean;
}) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}>
      <div className={`grid place-items-center h-7 w-7 rounded-full ${highlight && active ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""}`}>
        <I className="h-4 w-4" />
      </div>
      <span>{label}</span>
    </button>
  );
}

function ScreenHeader({ title, subtitle, back, right }: {
  title: string; subtitle?: string; back?: () => void; right?: React.ReactNode;
}) {
  return (
    <div className="px-4 pt-3 pb-3 border-b border-border flex items-center gap-2">
      {back && (
        <button onClick={back} className="h-8 w-8 grid place-items-center rounded-full hover:bg-surface">
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-base font-display font-semibold truncate">{title}</div>
        {subtitle && <div className="text-[11px] text-muted-foreground truncate">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const c = p === "P1" ? "text-destructive border-destructive/40 bg-destructive/10"
    : p === "P2" ? "text-warning border-warning/40 bg-warning/10"
    : "text-info border-info/40 bg-info/10";
  return <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${c}`}>{p}</span>;
}

/* -------------------- screens -------------------- */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [empId, setEmpId] = useState("A14-2033");
  const [pw, setPw] = useState("••••••••");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col px-6 pb-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow mb-4">
          <Ambulance className="h-8 w-8 text-primary-foreground" />
        </div>
        <div className="text-center mb-8">
          <div className="text-lg font-display font-semibold">EMS Field Crew</div>
          <div className="text-xs text-muted-foreground">Secure crew authentication</div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Employee ID</Label>
            <Input value={empId} onChange={(e) => setEmpId(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Password</Label>
            <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center gap-1.5 text-muted-foreground">
              <input type="checkbox" defaultChecked className="accent-primary" /> Remember device
            </label>
            <button className="text-primary">Forgot?</button>
          </div>
          <Button onClick={onLogin} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
            Sign in
          </Button>
          <Button onClick={onLogin} variant="outline" className="w-full">
            <Fingerprint className="h-4 w-4 mr-2" /> Biometric login
          </Button>
        </div>
      </div>
      <div className="text-center text-[10px] text-muted-foreground">
        v2.4.1 · MDM enrolled · Station 14
      </div>
    </motion.div>
  );
}

function DashboardScreen({ go }: { go: (s: Screen) => void }) {
  const [onDuty, setOnDuty] = useState(true);
  return (
    <div className="pb-4">
      <div className="bg-gradient-primary text-primary-foreground px-4 pt-4 pb-5 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest opacity-80">Field crew</div>
          <div className="font-display font-semibold truncate">Rashid Al Ameri</div>
          <div className="text-[11px] opacity-90 truncate">Unit A-14 · Station 14 · Shift 06:00–18:00</div>
        </div>
        <div className={`shrink-0 flex items-center gap-1.5 rounded-full px-2 py-1 border ${onDuty ? "border-white/40 bg-white/15 text-white" : "border-white/20 bg-white/5 text-white/70"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${onDuty ? "bg-white animate-pulse" : "bg-white/50"}`} />
          <span className="text-[10px]">{onDuty ? "On duty" : "Off duty"}</span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Active card */}
        <motion.button
          onClick={() => go("active")}
          animate={{ boxShadow: ["0 0 0 rgba(30,80,220,0)", "0 0 24px rgba(30,80,220,0.35)", "0 0 0 rgba(30,80,220,0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-full text-left rounded-2xl bg-gradient-primary p-4 text-primary-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-90">P1 · Active</span>
            <ChevronRight className="h-4 w-4" />
          </div>
          <div className="mt-1 text-lg font-display font-semibold">Cardiac arrest · STEMI</div>
          <div className="text-xs opacity-90">Al Reem Island, Tower 3</div>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> 1.8 km</div>
            <div className="flex items-center gap-1"><NavIcon className="h-3 w-3" /> ETA 3:12</div>
            <div className="flex items-center gap-1"><Building2 className="h-3 w-3" /> CCAD</div>
          </div>
        </motion.button>

        {/* Quick status */}
        <div className="grid grid-cols-4 gap-2">
          <QuickChip icon={Play} label="Start" onClick={() => toast("Shift started")} />
          <QuickChip icon={Pause} label="End" onClick={() => toast("Shift ended")} />
          <QuickChip icon={CheckCircle2} label="Available" onClick={() => { setOnDuty(true); toast.success("Available"); }} />
          <QuickChip icon={AlertCircle} label="Busy" onClick={() => { setOnDuty(false); toast("Busy"); }} />
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">Pending dispatches</div>
            <button onClick={() => go("dispatches")} className="text-[11px] text-primary">See all</button>
          </div>
          <div className="space-y-2">
            {DISPATCHES.filter((d) => d.status !== "Completed").map((d) => (
              <button key={d.id} onClick={() => go("dispatches")} className="w-full text-left rounded-lg border border-border/60 bg-surface/40 p-2.5 flex items-center gap-2">
                <PriorityBadge p={d.priority} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">{d.type}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{d.id} · ETA {d.eta}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-2">
          <MiniLink icon={HeartPulse} label="ePCR" onClick={() => go("epcr")} />
          <MiniLink icon={Building2} label="Hospital" onClick={() => go("hospital")} />
          <MiniLink icon={Radio} label="Comms" onClick={() => go("comms")} />
        </div>
      </div>
    </div>
  );
}

function QuickChip({ icon: I, label, onClick }: { icon: typeof Play; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-border bg-card px-2 py-2.5 flex flex-col items-center gap-1 hover:border-primary/50">
      <I className="h-4 w-4 text-primary" />
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
function MiniLink({ icon: I, label, onClick }: { icon: typeof Play; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-border bg-card p-3 flex flex-col items-center gap-1.5 hover:border-primary/50">
      <I className="h-5 w-5 text-primary" />
      <span className="text-xs">{label}</span>
    </button>
  );
}

function DispatchesScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="pb-4">
      <ScreenHeader title="My Dispatches" subtitle={`${DISPATCHES.length} assigned today`} />
      <div className="p-3 space-y-2">
        {DISPATCHES.map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <PriorityBadge p={d.priority} />
                <span className="text-xs font-mono">{d.id}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                d.status === "New" ? "text-primary border-primary/40 bg-primary/10"
                  : d.status === "Accepted" ? "text-warning border-warning/40 bg-warning/10"
                  : "text-success border-success/40 bg-success/10"
              }`}>{d.status}</span>
            </div>
            <div className="text-sm font-medium">{d.type}</div>
            <div className="text-[11px] text-muted-foreground">{d.patient} · {d.pickup}</div>
            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{d.hospital}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{d.dispatch}</span>
              <span className="flex items-center gap-1 text-primary"><NavIcon className="h-3 w-3" />ETA {d.eta}</span>
            </div>
            <div className="mt-2 flex gap-2">
              {d.status === "New" ? (
                <>
                  <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground" onClick={() => { toast.success(`${d.id} accepted`); go("active"); }}>
                    <Check className="h-3.5 w-3.5 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast(`${d.id} declined`)}>
                    Reject
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" className="flex-1" onClick={() => go("active")}>
                  View details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveScreen({ go }: { go: (s: Screen) => void }) {
  const [stepIdx, setStepIdx] = useState(1);
  return (
    <div className="pb-4">
      <ScreenHeader title="Active Incident" subtitle="INC-8842 · P1" right={<PriorityBadge p="P1" />} />
      <div className="p-3 space-y-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="text-xs font-medium mb-1.5">Incident details</div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Row k="Type" v="Cardiac · STEMI" />
            <Row k="Caller" v="Bystander" />
            <Row k="Pickup" v="Al Reem, T3" />
            <Row k="GPS" v="24.500, 54.408" />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            58M · collapsed in lobby. Bystander CPR in progress. AED available on scene.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <div className="text-xs font-medium mb-2">Operational status</div>
          <div className="space-y-1.5">
            {STATUS_STEPS.map((s, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <button
                  key={s}
                  onClick={() => setStepIdx(i)}
                  className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 border text-left ${
                    active ? "border-primary/50 bg-primary/5" : done ? "border-success/40 bg-success/5" : "border-border/60 bg-surface/30"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : active ? <Activity className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span className={`text-xs ${active ? "font-medium" : done ? "line-through text-muted-foreground" : ""}`}>{s}</span>
                </button>
              );
            })}
          </div>
          <Button size="sm" className="w-full mt-2 bg-gradient-primary text-primary-foreground"
            onClick={() => { setStepIdx((i) => Math.min(STATUS_STEPS.length - 1, i + 1)); toast.success(`Status: ${STATUS_STEPS[Math.min(STATUS_STEPS.length - 1, stepIdx + 1)]}`); }}
          >
            Update status
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MiniLink icon={NavIcon} label="Navigate" onClick={() => go("navigation")} />
          <MiniLink icon={User} label="Patient" onClick={() => go("patient")} />
          <MiniLink icon={HeartPulse} label="ePCR" onClick={() => go("epcr")} />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded border border-border/60 bg-surface/40 px-2 py-1">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="text-[11px] mt-0.5">{v}</div>
    </div>
  );
}

function NavigationScreen({ back }: { back: () => void }) {
  return (
    <div className="pb-4">
      <ScreenHeader title="Navigation" subtitle="Turn-by-turn · offline maps" back={back} />
      <div className="p-3 space-y-3">
        <div className="relative h-64 rounded-xl border border-border overflow-hidden bg-gradient-to-br from-primary/10 via-surface to-info/10">
          {/* Faux map */}
          <svg viewBox="0 0 300 240" className="absolute inset-0 w-full h-full opacity-70">
            <path d="M10 200 Q80 160 140 180 T290 60" stroke="hsl(var(--primary))" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="6 4" />
            <circle cx="10" cy="200" r="6" fill="hsl(var(--info))" />
            <circle cx="290" cy="60" r="7" fill="hsl(var(--destructive))" />
          </svg>
          <div className="absolute top-2 left-2 rounded-md bg-card/90 backdrop-blur px-2 py-1 text-[10px] font-mono">
            1.8 km · ETA 3:12
          </div>
          <div className="absolute bottom-2 inset-x-2 rounded-md bg-card/90 backdrop-blur p-2 flex items-center gap-2">
            <NavIcon className="h-4 w-4 text-primary" />
            <div className="text-[11px] flex-1">Continue on <b>Al Reem Ring</b> for 800 m</div>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <Row k="Incident" v="Al Reem, Tower 3" />
          <Row k="Hospital" v="Cleveland Clinic AD" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button size="sm" variant="outline" onClick={() => toast("Route recalculated")}>Recalculate</Button>
          <Button size="sm" variant="outline" onClick={() => toast("Location shared")}>Share loc</Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Navigation started")}>Start</Button>
        </div>
      </div>
    </div>
  );
}

function PatientScreen({ back }: { back: () => void }) {
  return (
    <div className="pb-4">
      <ScreenHeader title="Patient Information" subtitle="Demographics" back={back} />
      <div className="p-3 space-y-2">
        <FieldRow label="Full name" value="Khalid Al Nuaimi" />
        <div className="grid grid-cols-2 gap-2">
          <FieldRow label="Age" value="58" />
          <FieldRow label="Gender" value="Male" />
        </div>
        <FieldRow label="Contact" value="+971 50 442 0221" />
        <FieldRow label="Emergency contact" value="Fatima Al Nuaimi · +971 50 111 0022" />
        <FieldRow label="Medical history" value="Hypertension, Type 2 diabetes" multiline />
        <FieldRow label="Allergies" value="Penicillin" />
        <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground mt-2" onClick={() => toast.success("Patient info saved")}>
          Save
        </Button>
      </div>
    </div>
  );
}

function FieldRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  const [v, setV] = useState(value);
  return (
    <div className="space-y-1">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      {multiline ? <Textarea rows={2} value={v} onChange={(e) => setV(e.target.value)} /> : <Input value={v} onChange={(e) => setV(e.target.value)} />}
    </div>
  );
}

function EpcrScreen({ back }: { back: () => void }) {
  const sections = ["Incident", "Assessment", "Treatment", "Transport", "Signatures"];
  const [step, setStep] = useState(0);
  return (
    <div className="pb-4">
      <ScreenHeader title="ePCR" subtitle={`Step ${step + 1} of ${sections.length} · ${sections[step]}`} back={back} />
      <div className="px-3 pt-3">
        <div className="flex gap-1 mb-3">
          {sections.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-gradient-primary" : "bg-border"}`} />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-2">
            <FieldRow label="Incident #" value="INC-8842" />
            <FieldRow label="Dispatch time" value="09:04" />
            <FieldRow label="Arrival time" value="09:12" />
          </div>
        )}
        {step === 1 && (
          <div className="space-y-2">
            <FieldRow label="Chief complaint" value="Central chest pain" />
            <FieldRow label="Primary assessment" value="Acute MI · STEMI anterior" />
            <div className="grid grid-cols-3 gap-2">
              <VitalTile label="HR" value="140" unit="bpm" />
              <VitalTile label="BP" value="90/60" unit="mmHg" />
              <VitalTile label="SpO₂" value="92" unit="%" />
              <VitalTile label="RR" value="24" unit="/min" />
              <VitalTile label="Temp" value="36.9" unit="°C" />
              <VitalTile label="Pain" value="8" unit="/10" />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-2 text-xs">
            {["Oxygen 15L NRM", "IV access · L antecubital", "12-lead ECG", "Aspirin 300 mg PO", "GTN spray 400 mcg SL"].map((t) => (
              <div key={t} className="flex items-center gap-2 rounded-lg border border-border/60 bg-surface/40 px-2.5 py-2">
                <Check className="h-3.5 w-3.5 text-success" />
                <span>{t}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">+ Add treatment</Button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-2">
            <FieldRow label="Destination hospital" value="Cleveland Clinic Abu Dhabi" />
            <div className="grid grid-cols-2 gap-2">
              <FieldRow label="Departure" value="09:24" />
              <FieldRow label="Arrival" value="09:38" />
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-3">
            <SignBox label="Patient signature" />
            <SignBox label="Crew signature" />
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < sections.length - 1 ? (
            <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground" onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("ePCR submitted")}>
              Submit ePCR
            </Button>
          )}
        </div>
        <Button size="sm" variant="ghost" className="w-full mt-2 text-muted-foreground" onClick={() => toast("Draft saved")}>
          Save draft
        </Button>
      </div>
    </div>
  );
}

function VitalTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-2 text-center">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-base font-display font-semibold tabular-nums">{value}</div>
      <div className="text-[9px] text-muted-foreground">{unit}</div>
    </div>
  );
}

function SignBox({ label }: { label: string }) {
  const [signed, setSigned] = useState(false);
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      <button
        onClick={() => setSigned(!signed)}
        className={`mt-1 w-full h-20 rounded-lg border-2 border-dashed grid place-items-center text-xs ${
          signed ? "border-success bg-success/5 text-success" : "border-border bg-surface text-muted-foreground"
        }`}
      >
        {signed ? <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> Signed</span> : "Tap to sign"}
      </button>
    </div>
  );
}

function HospitalScreen({ back }: { back: () => void }) {
  return (
    <div className="pb-4">
      <ScreenHeader title="Hospital Coordination" subtitle="Cleveland Clinic AD" back={back} />
      <div className="p-3 space-y-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium">Cleveland Clinic Abu Dhabi</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Row k="Bay" v="Cath Lab 1" />
            <Row k="ETA" v="3:12" />
            <Row k="Team" v="Cardiology" />
            <Row k="Status" v="Ready" />
          </div>
        </div>
        <a href="tel:+97126590200" className="w-full flex items-center gap-2 rounded-xl border border-border bg-card p-3 hover:border-primary/50">
          <PhoneCall className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <div className="text-xs font-medium">Call hospital</div>
            <div className="text-[11px] text-muted-foreground">+971 2 659 0200</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </a>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Arrival notification sent")}>
            <Send className="h-3.5 w-3.5 mr-1" /> Send arrival
          </Button>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Handover complete")}>
            <ClipboardCheck className="h-3.5 w-3.5 mr-1" /> Handover
          </Button>
        </div>
        <Button size="sm" variant="outline" className="w-full" onClick={() => toast.success("Patient record submitted")}>
          Submit patient record
        </Button>
      </div>
    </div>
  );
}

function CommsScreen({ back }: { back: () => void }) {
  const [msg, setMsg] = useState("");
  return (
    <div className="pb-4">
      <ScreenHeader title="Communication Center" subtitle="Dispatch · Ops · Hospital" back={back} />
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <CallBtn label="Dispatcher" number="+971 2 100 1911" tone="primary" />
          <CallBtn label="Operations" number="+971 2 100 2000" tone="info" />
          <CallBtn label="Hospital" number="+971 2 659 0200" tone="success" />
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-1 pb-1">Secure chat</div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {MESSAGES.map((m, i) => (
              <div key={i} className={`rounded-lg px-2.5 py-1.5 text-[11px] max-w-[85%] ${m.me ? "ml-auto bg-primary/15 text-foreground" : "bg-surface"}`}>
                <div className="text-[9px] text-muted-foreground">{m.from} · {m.at}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">
            <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message dispatch…" className="h-8 text-xs" />
            <Button size="icon" className="h-8 w-8 bg-gradient-primary text-primary-foreground" onClick={() => { if (msg) { toast.success("Sent"); setMsg(""); } }}>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <a href="tel:999" className="w-full flex items-center justify-center gap-2 rounded-xl bg-destructive text-white p-3 text-sm font-semibold">
          <Phone className="h-4 w-4" /> Emergency · 999
        </a>
      </div>
    </div>
  );
}

function CallBtn({ label, number, tone }: { label: string; number: string; tone: "primary" | "info" | "success" }) {
  const c = tone === "primary" ? "border-primary/40 text-primary" : tone === "info" ? "border-info/40 text-info" : "border-success/40 text-success";
  return (
    <a href={`tel:${number.replace(/\s/g, "")}`} className={`rounded-xl border ${c} bg-surface p-2.5 flex flex-col items-center gap-1`}>
      <PhoneCall className="h-4 w-4" />
      <span className="text-[11px] font-medium text-foreground">{label}</span>
      <span className="text-[9px] text-muted-foreground">{number}</span>
    </a>
  );
}

function NotificationsScreen({ back }: { back: () => void }) {
  const [filter, setFilter] = useState<"all" | "dispatch" | "hospital">("all");
  const list = NOTIFS.filter((n) => filter === "all" || n.kind === filter);
  return (
    <div className="pb-4">
      <ScreenHeader title="Notifications" subtitle={`${NOTIFS.length} recent`} back={back} />
      <div className="p-3 space-y-2">
        <div className="flex gap-1.5">
          {(["all", "dispatch", "hospital"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`text-[11px] px-2.5 py-1 rounded-full border capitalize ${
              filter === f ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground"
            }`}>{f}</button>
          ))}
        </div>
        {list.map((n, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-2.5 flex items-start gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 grid place-items-center shrink-0">
              {n.kind === "dispatch" ? <Radio className="h-3.5 w-3.5 text-primary" />
                : n.kind === "hospital" ? <Building2 className="h-3.5 w-3.5 text-primary" />
                : n.kind === "shift" ? <Clock className="h-3.5 w-3.5 text-primary" />
                : <Info className="h-3.5 w-3.5 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs">{n.text}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{n.at}</div>
            </div>
            <button onClick={() => toast("Marked as read")} className="text-[10px] text-primary">Read</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoreScreen({ go }: { go: (s: Screen) => void }) {
  const items: { s: Screen; label: string; icon: typeof User; desc: string }[] = [
    { s: "navigation", label: "Navigation", icon: NavIcon, desc: "Turn-by-turn & maps" },
    { s: "patient", label: "Patient Information", icon: User, desc: "Demographics & history" },
    { s: "epcr", label: "ePCR", icon: HeartPulse, desc: "Electronic patient care record" },
    { s: "hospital", label: "Hospital Coordination", icon: Building2, desc: "Handover & notifications" },
    { s: "comms", label: "Communication Center", icon: MessageSquare, desc: "Dispatch, ops, hospital calls" },
    { s: "profile", label: "Profile & Settings", icon: Settings, desc: "Account & preferences" },
  ];
  return (
    <div className="pb-4">
      <ScreenHeader title="More" subtitle="All modules" />
      <div className="p-3 space-y-1.5">
        {items.map((it) => (
          <button key={it.s} onClick={() => go(it.s)} className="w-full rounded-xl border border-border bg-card p-3 flex items-center gap-3 hover:border-primary/50">
            <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <it.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium">{it.label}</div>
              <div className="text-[11px] text-muted-foreground truncate">{it.desc}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ back, onSignOut }: { back: () => void; onSignOut: () => void }) {
  const [notif, setNotif] = useState(true);
  const [sound, setSound] = useState(true);
  return (
    <div className="pb-4">
      <ScreenHeader title="Profile & Settings" back={back} />
      <div className="p-3 space-y-3">
        <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
            RA
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Rashid Al Ameri</div>
            <div className="text-[11px] text-muted-foreground">Paramedic · A14-2033</div>
            <div className="text-[11px] text-muted-foreground">Unit A-14 · Station 14</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          <SettingRow icon={Bell} label="Push notifications" right={<Switch checked={notif} onCheckedChange={setNotif} />} />
          <SettingRow icon={Volume2} label="Sound alerts" right={<Switch checked={sound} onCheckedChange={setSound} />} />
          <SettingRow icon={Languages} label="Language" value="English" onClick={() => toast("Language picker")} />
          <SettingRow icon={KeyRound} label="Change password" onClick={() => toast("Change password")} />
          <SettingRow icon={Shield} label="Privacy & security" onClick={() => toast("Privacy")} />
          <SettingRow icon={Info} label="About" value="v2.4.1" onClick={() => toast("EMS Field App v2.4.1")} />
        </div>

        <Button variant="outline" className="w-full text-destructive border-destructive/40 hover:bg-destructive/10" onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-1.5" /> Sign out
        </Button>
      </div>
    </div>
  );
}

function SettingRow({ icon: I, label, value, right, onClick }: {
  icon: typeof Bell; label: string; value?: string; right?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface/40 text-left">
      <I className="h-4 w-4 text-primary shrink-0" />
      <span className="text-xs flex-1">{label}</span>
      {value && <span className="text-[11px] text-muted-foreground">{value}</span>}
      {right}
      {!right && onClick && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );
}
