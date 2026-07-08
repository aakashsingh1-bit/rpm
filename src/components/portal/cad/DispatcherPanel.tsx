import { useMemo, useState } from "react";
import { Search, Headphones, PhoneCall, MessageSquare, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DISPATCHERS, STATUS_TONE, type Dispatcher, type DispatcherStatus } from "./dispatcherData";

const FILTERS: (DispatcherStatus | "All")[] = ["All", "Available", "On Call", "Break", "Offline"];

export function DispatcherPanel({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const rows = useMemo(() => {
    return DISPATCHERS.filter((d) => {
      const matchQ = !q || `${d.name} ${d.id} ${d.station}`.toLowerCase().includes(q.toLowerCase());
      const matchF = filter === "All" || d.status === filter;
      return matchQ && matchF;
    });
  }, [q, filter]);

  const counts = useMemo(() => ({
    total: DISPATCHERS.length,
    available: DISPATCHERS.filter((d) => d.status === "Available").length,
    onCall: DISPATCHERS.filter((d) => d.status === "On Call").length,
    offline: DISPATCHERS.filter((d) => d.status === "Offline").length,
  }), []);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col min-h-0">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Dispatcher Floor
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {counts.available} avail · {counts.onCall} on call · {counts.offline} offline · {counts.total} total
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dispatcher…"
              className="h-8 pl-7 pr-2 rounded-md border border-border bg-background text-xs w-48 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md border transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto divide-y divide-border ${compact ? "max-h-72" : ""}`}>
        {rows.length === 0 && (
          <div className="p-6 text-center text-xs text-muted-foreground">No dispatchers match.</div>
        )}
        {rows.map((d) => <Row key={d.id} d={d} />)}
      </div>
    </div>
  );
}

function Row({ d }: { d: Dispatcher }) {
  const initials = d.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
      <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-primary to-brand-purple grid place-items-center text-white text-xs font-semibold">
        {initials}
        <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
          d.status === "Available" ? "bg-success" :
          d.status === "On Call" ? "bg-destructive" :
          d.status === "Break" ? "bg-warning" : "bg-muted-foreground"
        }`} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground truncate">{d.name}</span>
          <span className="text-[10px] font-mono text-muted-foreground">{d.id}</span>
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded border ${STATUS_TONE[d.status]}`}>
            {d.status}
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground truncate">
          {d.station} · {d.shift} · {d.callsToday} calls today · avg {d.avgHandle}
          {d.activeCall && <span className="ml-1 text-destructive font-mono">· {d.activeCall}</span>}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          onClick={() => toast(`Listening in on ${d.name}`, { description: d.activeCall ?? "Standby line" })}
          disabled={d.status !== "On Call"}
          title="Silent monitor"
        >
          <Headphones className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          onClick={() => toast(`Message sent to ${d.name}`)}
          title="Message"
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          onClick={() => toast(`Calling ${d.name}`)}
          title="Direct call"
        >
          <PhoneCall className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          className="h-8 px-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => toast(`Reassigning ${d.name}`, { description: "Opening shift & queue controls" })}
          title="Manage"
        >
          <UserCog className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
