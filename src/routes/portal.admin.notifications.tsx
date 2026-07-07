import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Switch } from "@/components/ui/switch";
import { NOTIFICATION_RULES, type NotificationRule } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [rules, setRules] = useState<NotificationRule[]>(NOTIFICATION_RULES);

  function toggleChannel(id: string, key: keyof NotificationRule["channels"]) {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, channels: { ...r.channels, [key]: !r.channels[key] } } : r)));
  }
  function toggle(id: string) {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
    toast.success("Rule updated");
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold">Notification Management</h2>
        <p className="text-sm text-muted-foreground">Configure notification rules and channels across In-App, SMS, Email and Push.</p>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2">Event</th>
                <th className="text-left px-3 py-2">Audience</th>
                <th className="px-3 py-2"><div className="flex items-center gap-1 justify-center"><Bell className="h-3 w-3" /> In-App</div></th>
                <th className="px-3 py-2"><div className="flex items-center gap-1 justify-center"><MessageSquare className="h-3 w-3" /> SMS</div></th>
                <th className="px-3 py-2"><div className="flex items-center gap-1 justify-center"><Mail className="h-3 w-3" /> Email</div></th>
                <th className="px-3 py-2"><div className="flex items-center gap-1 justify-center"><Smartphone className="h-3 w-3" /> Push</div></th>
                <th className="px-3 py-2 text-right">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-medium">{r.event}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{r.audience}</td>
                  {(["inApp","sms","email","push"] as const).map((k) => (
                    <td key={k} className="px-3 py-2.5 text-center">
                      <Switch checked={r.channels[k]} onCheckedChange={() => toggleChannel(r.id, k)} disabled={!r.enabled} />
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-right">
                    <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
