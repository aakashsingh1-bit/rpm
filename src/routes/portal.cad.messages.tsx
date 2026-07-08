import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Radio, User, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/cad/messages")({
  component: MessagesPage,
});

type Party = "driver" | "ops" | "patient";

interface Thread {
  id: Party;
  title: string;
  subtitle: string;
  icon: typeof Truck;
  color: string;
  seed: { from: "them" | "me"; text: string; time: string }[];
}

const THREADS: Thread[] = [
  {
    id: "driver",
    title: "Ambulance A-01 · Driver",
    subtitle: "Mike Johnson · En Route",
    icon: Truck,
    color: "text-primary",
    seed: [
      { from: "them", text: "En route from Station 3, ETA 4 minutes.", time: "14:31" },
      { from: "me",   text: "Copy. Patient is unresponsive, bystander CPR in progress.", time: "14:31" },
      { from: "them", text: "Requesting clearance on Sheikh Zayed Rd.", time: "14:32" },
    ],
  },
  {
    id: "ops",
    title: "Operations Center",
    subtitle: "Julia · Shift Supervisor",
    icon: Radio,
    color: "text-info",
    seed: [
      { from: "them", text: "MED-25-05124 escalated to Level I trauma.", time: "14:30" },
      { from: "me",   text: "Coordinating with Metro Medical for direct handover.", time: "14:30" },
    ],
  },
  {
    id: "patient",
    title: "Patient / Bystander",
    subtitle: "+971 50 ••• 9021",
    icon: User,
    color: "text-success",
    seed: [
      { from: "them", text: "He's still not breathing. What do I do?", time: "14:30" },
      { from: "me",   text: "Keep doing chest compressions, 100 per minute. Help is 4 minutes away.", time: "14:30" },
      { from: "them", text: "Ok, still going.", time: "14:31" },
    ],
  },
];

function MessagesPage() {
  const [activeId, setActiveId] = useState<Party>("driver");
  const [threads, setThreads] = useState(THREADS);
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeId)!;

  const send = () => {
    if (!draft.trim()) return;
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId ? { ...t, seed: [...t.seed, { from: "me", text: draft.trim(), time }] } : t
      )
    );
    setDraft("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-3 p-3 flex-1 min-h-0">
      {/* Thread list */}
      <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Conversations</div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {threads.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-border transition-colors ${
                  isActive ? "bg-primary/10" : "hover:bg-muted/40"
                }`}
              >
                <div className={`h-9 w-9 rounded-full grid place-items-center bg-muted ${t.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active thread */}
      <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <div className={`h-9 w-9 rounded-full grid place-items-center bg-muted ${active.color}`}>
            <active.icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">{active.title}</div>
            <div className="text-[11px] text-muted-foreground">{active.subtitle}</div>
          </div>
          <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_6px_var(--success)]" />
          <span className="text-[11px] text-success">Live</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
          {active.seed.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${
                m.from === "me"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                <div className="text-sm">{m.text}</div>
                <div className={`text-[10px] mt-0.5 font-mono ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="border-t border-border p-3 flex items-center gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${active.title}…`}
            className="flex-1 h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <Button type="submit" className="h-10">
            <Send className="h-4 w-4 mr-1.5" /> Send
          </Button>
        </form>
      </div>
    </div>
  );
}
