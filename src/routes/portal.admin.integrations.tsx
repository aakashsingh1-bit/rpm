import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plug, KeyRound, Play, Power } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INTEGRATIONS, type Integration } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/integrations")({
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const [rows, setRows] = useState<Integration[]>(INTEGRATIONS);
  const [configuring, setConfiguring] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState("");

  function toggle(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: r.status === "Connected" ? "Disconnected" : "Connected" } : r)));
  }
  function test(r: Integration) {
    toast.loading(`Testing ${r.name}…`, { id: r.id });
    setTimeout(() => toast.success(`${r.name} · connection OK`, { id: r.id }), 700);
  }
  function saveConfig() {
    if (!configuring) return;
    setRows((rs) => rs.map((r) => (r.id === configuring.id ? { ...r, endpoint: endpoint || r.endpoint } : r)));
    toast.success("Integration updated");
    setConfiguring(null); setApiKey(""); setEndpoint("");
  }

  const badge = (s: Integration["status"]) =>
    s === "Connected" ? <Badge className="bg-success/15 text-success border-success/30" variant="outline">Connected</Badge>
    : s === "Error" ? <Badge className="bg-destructive/15 text-destructive border-destructive/30" variant="outline">Error</Badge>
    : <Badge variant="secondary">Disconnected</Badge>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold">Integration Configuration</h2>
        <p className="text-sm text-muted-foreground">Manage GPS, Maps, Telephony, SMS, Email, Hospital and ePCR integrations.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r) => (
          <Panel key={r.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/30 grid place-items-center">
                  <Plug className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.category} · {r.authMode}</div>
                </div>
              </div>
              {badge(r.status)}
            </div>
            <div className="mt-3 text-xs text-muted-foreground truncate">{r.endpoint}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Last check {r.lastCheck}</div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Switch checked={r.status === "Connected"} onCheckedChange={() => toggle(r.id)} />
                <Power className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => test(r)}><Play className="h-3.5 w-3.5 mr-1" />Test</Button>
                <Button size="sm" variant="ghost" onClick={() => { setConfiguring(r); setEndpoint(r.endpoint); }}><KeyRound className="h-3.5 w-3.5 mr-1" />Configure</Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Dialog open={!!configuring} onOpenChange={(o) => { if (!o) setConfiguring(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configure {configuring?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Endpoint</Label>
              <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="h-9 mt-1 font-mono text-xs" />
            </div>
            <div><Label className="text-xs">API Key / Secret</Label>
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="•••••••••••" className="h-9 mt-1 font-mono text-xs" type="password" />
            </div>
            <div className="text-[11px] text-muted-foreground">Auth mode: {configuring?.authMode}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfiguring(null)}>Cancel</Button>
            <Button onClick={saveConfig}>Save configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
