import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Monitor, Shield, Smartphone, Trash2 } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/profile")({
  component: ProfilePage,
});

const SESSIONS = [
  { id: "S-1", device: "MacBook Pro · Chrome 130",  ip: "10.1.4.10",  location: "Abu Dhabi, UAE", current: true,  when: "Active now" },
  { id: "S-2", device: "iPhone 15 · Safari 17",     ip: "94.200.11.5", location: "Abu Dhabi, UAE", current: false, when: "2 hours ago" },
  { id: "S-3", device: "iPad Pro · Safari 17",      ip: "94.200.11.5", location: "Abu Dhabi, UAE", current: false, when: "Yesterday" },
];

const LOGIN_HISTORY = [
  { when: "07 Jul 09:00", ip: "10.1.4.10",  device: "MacBook Pro",  result: "Success" },
  { when: "06 Jul 22:14", ip: "10.1.4.10",  device: "MacBook Pro",  result: "Success" },
  { when: "06 Jul 07:03", ip: "94.200.11.5", device: "iPhone 15",   result: "Success" },
  { when: "05 Jul 18:41", ip: "10.1.4.10",  device: "MacBook Pro",  result: "Success" },
  { when: "05 Jul 08:12", ip: "10.1.4.10",  device: "MacBook Pro",  result: "Failed"  },
];

function ProfilePage() {
  const { session } = useAuth();
  const [mfa, setMfa] = useState(true);
  const [sessions, setSessions] = useState(SESSIONS);

  function revoke(id: string) {
    setSessions((s) => s.filter((x) => x.id !== id));
    toast.success("Session revoked");
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold">Profile & Security</h2>
        <p className="text-sm text-muted-foreground">Manage your administrator profile, password, MFA and active devices.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <Panel title="Profile">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-gradient-primary grid place-items-center text-white font-semibold text-lg">
              {session?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "SA"}
            </div>
            <div>
              <div className="text-lg font-semibold">{session?.name ?? "Super Administrator"}</div>
              <div className="text-xs text-muted-foreground">Super Administrator · RPM-AUH</div>
            </div>
          </div>
          <div className="space-y-3">
            <div><Label className="text-xs">Full name</Label>
              <Input defaultValue={session?.name ?? "Super Administrator"} className="h-9 mt-1" />
            </div>
            <div><Label className="text-xs">Email</Label>
              <Input defaultValue="admin@rpm.ae" className="h-9 mt-1" />
            </div>
            <div><Label className="text-xs">Phone</Label>
              <Input defaultValue="+971 50 000 0000" className="h-9 mt-1" />
            </div>
            <Button onClick={() => toast.success("Profile saved")}>Save profile</Button>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Password & MFA">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Current password</Label><Input type="password" className="h-9 mt-1" /></div>
                <div><Label className="text-xs">New password</Label><Input type="password" className="h-9 mt-1" /></div>
              </div>
              <Button variant="outline" onClick={() => toast.success("Password updated")}><KeyRound className="h-4 w-4 mr-1" /> Change password</Button>

              <div className="flex items-center justify-between rounded-md border border-border/60 p-3 mt-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Two-factor authentication</div>
                    <div className="text-[11px] text-muted-foreground">Authenticator app · required by policy</div>
                  </div>
                </div>
                <Switch checked={mfa} onCheckedChange={setMfa} />
              </div>
            </div>
          </Panel>

          <Panel title="Active sessions" subtitle="Devices currently signed into your account">
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-md border border-border/60 bg-surface/40 p-3">
                  <div className="flex items-start gap-3">
                    <Monitor className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">{s.device} {s.current && <Badge variant="default" className="text-[10px]">Current</Badge>}</div>
                      <div className="text-[11px] text-muted-foreground">{s.ip} · {s.location} · {s.when}</div>
                    </div>
                  </div>
                  {!s.current && <Button size="sm" variant="ghost" onClick={() => revoke(s.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Login history">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2">When</th>
                    <th className="text-left px-3 py-2">IP</th>
                    <th className="text-left px-3 py-2">Device</th>
                    <th className="text-left px-3 py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {LOGIN_HISTORY.map((l, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-3 py-2 font-mono text-[11px]">{l.when}</td>
                      <td className="px-3 py-2">{l.ip}</td>
                      <td className="px-3 py-2">{l.device}</td>
                      <td className="px-3 py-2">
                        <Badge variant={l.result === "Success" ? "default" : "destructive"}>{l.result}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
