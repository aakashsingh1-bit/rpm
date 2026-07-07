import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Phone, Bell, MessageSquare } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { COMMS } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/hospital/communication")({
  component: CommsPage,
});

function CommsPage() {
  const [msg, setMsg] = useState("");
  const [to, setTo] = useState("Dispatch · Ops Command Center");

  return (
    <div>
      <ModuleHeader module="hospital" actions={<span className="text-[10px] font-mono uppercase tracking-widest text-primary">Hospital ↔ EMS Ops</span>} />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <Panel title="Communication history" subtitle="Recent messages between hospital and EMS operations">
          <div className="space-y-2">
            {COMMS.map((m) => (
              <div key={m.id} className={`rounded-lg border p-3 ${
                m.kind === "alert" ? "border-destructive/40 bg-destructive/5"
                  : m.kind === "ack" ? "border-info/40 bg-info/5"
                  : "border-border bg-surface/40"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] font-medium">{m.from} <span className="text-muted-foreground">→ {m.to}</span></div>
                  <span className="text-[10px] font-mono text-muted-foreground">{m.at}</span>
                </div>
                <div className="text-sm">{m.text}</div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Send hospital update">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">To</label>
                <Input value={to} onChange={(e) => setTo(e.target.value)} className="h-9 mt-1" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Bed capacity, closure, ETA acknowledgement…" className="mt-1 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => { if (!msg.trim()) return toast.error("Message empty"); toast.success("Update sent"); setMsg(""); }} className="bg-gradient-primary text-primary-foreground shadow-glow flex-1">
                  <Send className="h-4 w-4 mr-2" /> Send
                </Button>
                <Button variant="outline" onClick={() => toast("Calling dispatcher…")}><Phone className="h-4 w-4" /></Button>
              </div>
            </div>
          </Panel>

          <Panel title="Quick actions">
            <div className="space-y-2 text-xs">
              <QuickBtn icon={Bell} label="Emergency broadcast to dispatch" onClick={() => toast.success("Broadcast sent to Ops Command")} />
              <QuickBtn icon={MessageSquare} label="Acknowledge ETA notification" onClick={() => toast("ETA acknowledged")} />
              <QuickBtn icon={Phone} label="Contact CAD supervisor" onClick={() => toast("Dialing CAD supervisor…")} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function QuickBtn({ icon: I, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 rounded-md border border-border bg-surface/40 hover:border-primary/50 p-2.5 text-left transition-colors">
      <I className="h-3.5 w-3.5 text-primary" />
      <span>{label}</span>
    </button>
  );
}
