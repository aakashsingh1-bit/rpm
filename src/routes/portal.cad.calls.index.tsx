import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Delete, Mic, Search, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/portal/cad/calls/")({
  component: CallsPage,
});

interface HistoryEntry {
  id: string;
  name: string;
  number: string;
  time: string;
  direction: "in" | "out" | "missed";
  duration: string;
  type: string;
}

const HISTORY: HistoryEntry[] = [
  { id: "CALL-9031", name: "Anonymous",    number: "+971 50 ••• 4421", time: "14:32", direction: "in",     duration: "02:14", type: "Traffic Accident" },
  { id: "CALL-9030", name: "Fatima A.",    number: "+971 55 ••• 1188", time: "14:18", direction: "in",     duration: "01:02", type: "Chest Pain" },
  { id: "CALL-9029", name: "Metro Med.",   number: "+971 4 ••• 7700",  time: "14:05", direction: "out",    duration: "00:41", type: "Hospital Coord." },
  { id: "CALL-9028", name: "Unknown",      number: "+971 56 ••• 3312", time: "13:58", direction: "missed", duration: "—",     type: "—" },
  { id: "CALL-9027", name: "Ops Center",   number: "Internal",         time: "13:44", direction: "out",    duration: "03:28", type: "Coordination" },
  { id: "CALL-9026", name: "John Doe",     number: "+971 50 ••• 9021", time: "13:22", direction: "in",     duration: "04:12", type: "Cardiac Arrest" },
];

const ONGOING = [
  { id: "MED-25-05124", type: "Cardiac Arrest",       priority: "CRITICAL", dispatcher: "Sara Al Hosani",  timer: "00:01:32", unit: "A-01" },
  { id: "MED-25-05123", type: "Difficulty Breathing", priority: "HIGH",     dispatcher: "Hind Al Zaabi",   timer: "00:03:47", unit: "M-03" },
  { id: "MED-25-05122", type: "Chest Pain",           priority: "HIGH",     dispatcher: "Omar Al Suwaidi", timer: "00:06:15", unit: "B-02" },
] as const;

type Dir = "all" | "in" | "out" | "missed";
const DIR_LABEL: Record<Dir, string> = { all: "All", in: "Incoming", out: "Outgoing", missed: "Missed" };

function CallsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const isOps = session?.role === "ops_manager";
  const [number, setNumber] = useState("");
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<Dir>("all");
  const press = (k: string) => setNumber((n) => (n + k).slice(0, 16));
  const back = () => setNumber((n) => n.slice(0, -1));

  const openActiveCall = (payload: { id: string; caller: string; number: string; type: string; address?: string; patient?: string }) => {
    try { sessionStorage.setItem("cad:activeCall", JSON.stringify(payload)); } catch { /* ignore */ }
    navigate({ to: "/portal/cad/calls/active" });
  };

  const dial = () => {
    if (!number) return toast("Enter a number to dial");
    toast.success(`Dialing ${number}`, { description: "Connecting via EMS trunk" });
    openActiveCall({ id: `CALL-${Date.now().toString().slice(-4)}`, caller: "Outbound", number, type: "Outbound" });
  };

  const filteredHistory = useMemo(() => {
    return HISTORY.filter((h) => {
      const matchDir = dir === "all" || h.direction === dir;
      const matchQ = !q || `${h.name} ${h.number} ${h.id} ${h.type}`.toLowerCase().includes(q.toLowerCase());
      return matchDir && matchQ;
    });
  }, [q, dir]);

  return (
    <div className="flex flex-col gap-3 p-3 flex-1 min-h-0 overflow-y-auto">
      {isOps && (
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-destructive" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Live Ongoing Calls
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{ONGOING.length} active</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {ONGOING.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  c.priority === "CRITICAL" ? "bg-destructive text-destructive-foreground" : "bg-warning text-white"
                }`}>
                  {c.priority}
                </span>
                <span className="text-sm font-semibold text-foreground min-w-[140px]">{c.type}</span>
                <span className="text-[11px] font-mono text-muted-foreground">{c.id}</span>
                <span className="text-[11px] text-muted-foreground">Unit {c.unit}</span>
                <span className="text-[11px] text-muted-foreground ml-auto">Dispatcher: <b className="text-foreground font-semibold">{c.dispatcher}</b></span>
                <span className="text-[11px] font-mono text-destructive">{c.timer}</span>
                <Button
                  size="sm"
                  className="h-7 px-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => openActiveCall({ id: c.id, caller: c.dispatcher, number: "Internal", type: c.type })}
                >
                  Monitor
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-3 min-h-0 flex-1">
      {/* Dialer */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Dialer</div>
        <div className="rounded-lg border border-border bg-background px-4 py-4 mb-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Number</div>
          <div className="font-mono text-2xl text-foreground min-h-[36px] tracking-wider">{number || "—"}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="h-14 rounded-lg border border-border bg-background hover:bg-muted text-xl font-semibold text-foreground transition-colors"
            >
              {k}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => toast("Push-to-talk armed")} variant="outline" className="h-12">
            <Mic className="h-4 w-4" />
          </Button>
          <Button onClick={dial} className="h-12 bg-success hover:bg-success/90 text-white col-span-1">
            <PhoneCall className="h-4 w-4 mr-1.5" /> Call
          </Button>
          <Button onClick={back} variant="outline" className="h-12">
            <Delete className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border flex-wrap">
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Call History</div>
            <div className="text-[11px] text-muted-foreground">Today · {filteredHistory.length}/{HISTORY.length} calls</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search caller, number, ID…"
                className="h-8 pl-7 pr-2 rounded-md border border-border bg-background text-xs w-56 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-1">
              {(["all", "in", "out", "missed"] as Dir[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDir(d)}
                  className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md border transition-colors ${
                    dir === d
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {DIR_LABEL[d]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border">
          {filteredHistory.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground">No calls match your filter.</div>
          )}
          {filteredHistory.map((h) => (
            <div key={h.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/40 transition-colors">
              <div className={`h-9 w-9 rounded-full grid place-items-center ${
                h.direction === "in" ? "bg-info/10 text-info" :
                h.direction === "out" ? "bg-success/10 text-success" :
                "bg-destructive/10 text-destructive"
              }`}>
                {h.direction === "in" ? <PhoneIncoming className="h-4 w-4" /> :
                 h.direction === "out" ? <PhoneOutgoing className="h-4 w-4" /> :
                 <PhoneMissed className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{h.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{h.id}</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">{h.number}</div>
              </div>
              <div className="text-right leading-tight hidden md:block">
                <div className="text-[11px] text-foreground">{h.type}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{h.time} · {h.duration}</div>
              </div>
              <Button
                size="sm"
                onClick={() => openActiveCall({ id: h.id, caller: h.name, number: h.number, type: h.type })}
                className="bg-success hover:bg-success/90 text-white"
              >
                <Phone className="h-3.5 w-3.5 mr-1.5" /> Call back
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
