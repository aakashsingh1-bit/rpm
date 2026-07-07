import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { ADMIN_USERS, ADMIN_ROLES, ORGS, AUDIT_LOG } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/reports")({
  component: ReportsPage,
});

const REPORTS = [
  { name: "User Activity",          desc: "Logins, actions and session duration by user",     rows: ADMIN_USERS.length },
  { name: "Login History",          desc: "Successful and failed login attempts",             rows: 214 },
  { name: "Failed Login Report",    desc: "Only failed / suspicious login events",            rows: 12  },
  { name: "Role Assignment Report", desc: "Users assigned to each role",                      rows: ADMIN_ROLES.length },
  { name: "Organization Summary",   desc: "Users, modules and activity per organization",     rows: ORGS.length },
  { name: "Permission Matrix",      desc: "Effective module × permission matrix per role",    rows: ADMIN_ROLES.length },
  { name: "Audit Summary",          desc: "Aggregated audit trail across all modules",        rows: AUDIT_LOG.length },
];

function ReportsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold">Administrative Reports</h2>
        <p className="text-sm text-muted-foreground">Export activity, access and governance reports to PDF or Excel.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Users"         value={ADMIN_USERS.length} tone="info"    icon="Users"      index={0} />
        <StatCard label="Roles"         value={ADMIN_ROLES.length} tone="info"    icon="ShieldCheck"index={1} />
        <StatCard label="Organizations" value={ORGS.length}        tone="info"    icon="Building2"  index={2} />
        <StatCard label="Audit events"  value={AUDIT_LOG.length}   tone="warning" icon="FileClock"  index={3} />
      </div>

      <Panel title="Available reports">
        <div className="divide-y divide-border">
          {REPORTS.map((r) => (
            <div key={r.name} className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/30 grid place-items-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.desc} · {r.rows} rows</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.success(`${r.name} exported to PDF`)}><Download className="h-3.5 w-3.5 mr-1" /> PDF</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success(`${r.name} exported to Excel`)}><Download className="h-3.5 w-3.5 mr-1" /> Excel</Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
