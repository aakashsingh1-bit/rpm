import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CREW } from "@/lib/crew-data";
import { Send, Radio, MessageSquare, Bell, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/crew/communications")({
  component: CommunicationsPage,
});

interface Message {
  id: string;
  at: string;
  channel: "Broadcast" | "Radio" | "SMS" | "Push";
  audience: string;
  priority: "Normal" | "Urgent";
  body: string;
  sender: string;
}

const INITIAL: Message[] = [
  { id: "MSG-3021", at: "14:52", channel: "Broadcast", audience: "All on-duty crew", priority: "Urgent", body: "Sandstorm alert · SZR closed km 30–48. Reroute all transports via E30.", sender: "Ops Center" },
  { id: "MSG-3020", at: "13:11", channel: "SMS", audience: "Night shift crews", priority: "Normal", body: "Shift briefing at 18:30 in Muster Room 2.", sender: "Mariam Al Blooshi" },
  { id: "MSG-3019", at: "11:20", channel: "Push", audience: "A-14 crew", priority: "Normal", body: "New ePCR update deployed — please review release notes.", sender: "IT" },
];

function CommunicationsPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [channel, setChannel] = useState("Broadcast");
  const [audience, setAudience] = useState("All on-duty crew");
  const [priority, setPriority] = useState("Normal");
  const [body, setBody] = useState("");

  const send = () => {
    if (!body.trim()) return toast.error("Message body required");
    const msg: Message = {
      id: `MSG-${3022 + messages.length}`,
      at: new Date().toTimeString().slice(0, 5),
      channel: channel as Message["channel"],
      audience,
      priority: priority as Message["priority"],
      body: body.trim(),
      sender: "You",
    };
    setMessages((m) => [msg, ...m]);
    toast.success(`Sent to ${audience}`);
    setBody("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Sent today" value={messages.length + 12} icon="Send" index={0} />
        <StatCard label="Radio channels" value="4" tone="info" icon="Radio" index={1} />
        <StatCard label="Push subscribers" value={CREW.length} tone="success" icon="Bell" index={2} />
        <StatCard label="Urgent alerts" value={messages.filter((m) => m.priority === "Urgent").length} tone="danger" icon="AlertTriangle" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <Panel title="Compose message" subtitle="Broadcast, radio, SMS or push">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Channel</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Broadcast", "Radio", "SMS", "Push"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All on-duty crew">All on-duty crew</SelectItem>
                  <SelectItem value="Day shift crews">Day shift crews</SelectItem>
                  <SelectItem value="Night shift crews">Night shift crews</SelectItem>
                  <SelectItem value="Supervisors">Supervisors</SelectItem>
                  {CREW.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Message</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="mt-1" placeholder="Type your message…" />
            </div>
            <Button onClick={send} className="w-full bg-gradient-primary text-primary-foreground">
              <Send className="h-4 w-4 mr-2" /> Send
            </Button>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => { setChannel("Radio"); setPriority("Urgent"); setBody("MAYDAY drill in 15 min — all units acknowledge."); }}>
                <Radio className="h-3.5 w-3.5 mr-1" /> Drill
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setPriority("Urgent"); setBody("Mass casualty incident — activate MCI protocol."); }}>
                <AlertTriangle className="h-3.5 w-3.5 mr-1" /> MCI
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setPriority("Normal"); setBody("Shift changeover in 30 min."); }}>
                <Bell className="h-3.5 w-3.5 mr-1" /> Shift
              </Button>
            </div>
          </div>
        </Panel>

        <Panel title="Message history" subtitle="Sent broadcasts and alerts">
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`rounded-lg border p-3 ${
                m.priority === "Urgent" ? "border-destructive/40 bg-destructive/5" : "border-border bg-surface/40"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-primary">{m.id}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      m.channel === "Radio" ? "text-info border-info/40 bg-info/10"
                        : m.channel === "SMS" ? "text-warning border-warning/40 bg-warning/10"
                        : m.channel === "Push" ? "text-primary border-primary/40 bg-primary/10"
                        : "text-success border-success/40 bg-success/10"
                    }`}>{m.channel}</span>
                    {m.priority === "Urgent" && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border text-destructive border-destructive/40 bg-destructive/10">URGENT</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{m.at}</span>
                </div>
                <div className="text-sm">{m.body}</div>
                <div className="text-[10px] text-muted-foreground mt-1 flex items-center justify-between">
                  <span>→ {m.audience}</span>
                  <span>from {m.sender}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
