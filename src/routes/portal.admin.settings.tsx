import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState({
    company: "RPM Holding",
    logo: "rpm-logo-white.png",
    language: "English",
    dateFormat: "DD MMM YYYY",
    timezone: "Asia/Dubai",
    currency: "AED",
    sessionTimeout: 30,
    minPassword: 12,
    passwordRotation: 90,
    mfaRequired: true,
    fileMaxMb: 25,
    backupDaily: true,
    backupTime: "02:00",
    retentionDays: 365,
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold">System Settings</h2>
        <p className="text-sm text-muted-foreground">Global platform configuration — branding, locale, security and backups.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel title="Branding & locale">
          <div className="space-y-3">
            <div><Label className="text-xs">Company name</Label>
              <Input value={s.company} onChange={(e) => setS({ ...s, company: e.target.value })} className="h-9 mt-1" />
            </div>
            <div><Label className="text-xs">Logo</Label>
              <Input value={s.logo} onChange={(e) => setS({ ...s, logo: e.target.value })} className="h-9 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Language</Label>
                <Select value={s.language} onValueChange={(v) => setS({ ...s, language: v })}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="English / Arabic">English / Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Currency</Label>
                <Select value={s.currency} onValueChange={(v) => setS({ ...s, currency: v })}>
                  <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Date format</Label>
                <Input value={s.dateFormat} onChange={(e) => setS({ ...s, dateFormat: e.target.value })} className="h-9 mt-1" />
              </div>
              <div><Label className="text-xs">Time zone</Label>
                <Input value={s.timezone} onChange={(e) => setS({ ...s, timezone: e.target.value })} className="h-9 mt-1" />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Security & session">
          <div className="space-y-3">
            <div><Label className="text-xs">Session timeout (minutes)</Label>
              <Input type="number" value={s.sessionTimeout} onChange={(e) => setS({ ...s, sessionTimeout: +e.target.value })} className="h-9 mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Min password length</Label>
                <Input type="number" value={s.minPassword} onChange={(e) => setS({ ...s, minPassword: +e.target.value })} className="h-9 mt-1" />
              </div>
              <div><Label className="text-xs">Password rotation (days)</Label>
                <Input type="number" value={s.passwordRotation} onChange={(e) => setS({ ...s, passwordRotation: +e.target.value })} className="h-9 mt-1" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
              <div><div className="text-sm font-medium">MFA required</div><div className="text-[11px] text-muted-foreground">Force two-factor for all admin users</div></div>
              <Switch checked={s.mfaRequired} onCheckedChange={(v) => setS({ ...s, mfaRequired: v })} />
            </div>
          </div>
        </Panel>

        <Panel title="Uploads & storage">
          <div><Label className="text-xs">Max file upload (MB)</Label>
            <Input type="number" value={s.fileMaxMb} onChange={(e) => setS({ ...s, fileMaxMb: +e.target.value })} className="h-9 mt-1" />
          </div>
          <div className="mt-3"><Label className="text-xs">Retention (days)</Label>
            <Input type="number" value={s.retentionDays} onChange={(e) => setS({ ...s, retentionDays: +e.target.value })} className="h-9 mt-1" />
          </div>
        </Panel>

        <Panel title="Backup">
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div><div className="text-sm font-medium">Daily automatic backup</div><div className="text-[11px] text-muted-foreground">Full snapshot at scheduled time</div></div>
            <Switch checked={s.backupDaily} onCheckedChange={(v) => setS({ ...s, backupDaily: v })} />
          </div>
          <div className="mt-3"><Label className="text-xs">Backup time (24h)</Label>
            <Input value={s.backupTime} onChange={(e) => setS({ ...s, backupTime: e.target.value })} className="h-9 mt-1" />
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("System settings saved")}>Save settings</Button>
      </div>
    </div>
  );
}
