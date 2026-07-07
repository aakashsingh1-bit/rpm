import { createFileRoute, Link } from "@tanstack/react-router";
import { ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { ADMIN_USERS, ADMIN_ROLES, ORGS, AUDIT_LOG, INTEGRATIONS } from "@/lib/admin-data";
import { MODULE_LIST } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Activity, UserPlus, Building2, ShieldCheck, LayoutGrid, FileClock } from "lucide-react";

export const Route = createFileRoute("/portal/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const activeUsers = ADMIN_USERS.filter((u) => u.status === "Active").length;
  const pending = ADMIN_USERS.filter((u) => u.status === "Pending Approval").length;
  const failed = AUDIT_LOG.filter((a) => a.action === "Failed login").length;
  const health = INTEGRATIONS.filter((i) => i.status === "Connected").length;

  return (
    <div>
      <ModuleHeader
        module="admin"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/portal/admin/audit" className="text-xs px-3 py-1.5 rounded-md border border-border bg-card hover:border-primary/50">Audit logs</Link>
            <Link to="/portal/admin/users" className="text-xs px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground shadow-glow">Create user</Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Organizations"    value={ORGS.length} tone="info"    icon="Building2"   index={0} />
        <StatCard label="Active users"     value={activeUsers} tone="success" icon="Users"       index={1} />
        <StatCard label="Online now"       value={12}          tone="success" icon="Activity"    index={2} />
        <StatCard label="Roles"            value={ADMIN_ROLES.length} tone="info" icon="ShieldCheck" index={3} />
        <StatCard label="Modules"          value={MODULE_LIST.length} icon="LayoutGrid"  index={4} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending approvals"  value={pending}   tone="warning" icon="UserPlus"    index={5} />
        <StatCard label="Failed logins (24h)"value={failed}    tone="danger"  icon="ShieldAlert" index={6} />
        <StatCard label="Integrations up"    value={`${health}/${INTEGRATIONS.length}`} tone="info" icon="Plug" index={7} />
        <StatCard label="System health"      value="98.4%"     tone="success" icon="Gauge"       index={8} />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <Panel title="Recent activity" subtitle="Latest administrative actions across the platform"
          actions={<Link to="/portal/admin/audit" className="text-xs text-primary hover:underline">View all</Link>}>
          <div className="space-y-2">
            {AUDIT_LOG.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface/40 p-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/30 grid place-items-center">
                  <FileClock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.action} · <span className="text-muted-foreground font-normal">{a.module}</span></div>
                  <div className="text-[11px] text-muted-foreground">{a.user} · {a.ts}</div>
                </div>
                <div className="text-[11px] text-muted-foreground hidden md:block">{a.ip}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick actions" subtitle="Common super-admin tasks">
          <div className="grid grid-cols-1 gap-2">
            {[
              { to: "/portal/admin/users",         icon: UserPlus,    label: "Create user" },
              { to: "/portal/admin/organizations", icon: Building2,   label: "Create organization" },
              { to: "/portal/admin/roles",         icon: ShieldCheck, label: "Assign role" },
              { to: "/portal/admin/modules",       icon: LayoutGrid,  label: "Configure module access" },
              { to: "/portal/admin/audit",         icon: Activity,    label: "View audit logs" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:border-primary/50 transition-colors">
                <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/30 grid place-items-center">
                  <q.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm font-medium flex-1">{q.label}</div>
                <div className="text-xs text-muted-foreground">Open</div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="System health" subtitle="Live status of external integrations" className="mt-6">
        <div className="grid md:grid-cols-3 gap-3">
          {INTEGRATIONS.slice(0, 6).map((i) => (
            <div key={i.id} className="rounded-lg border border-border/60 bg-surface/40 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{i.name}</div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  i.status === "Connected" ? "text-success border-success/30 bg-success/10"
                  : i.status === "Error" ? "text-destructive border-destructive/30 bg-destructive/10"
                  : "text-muted-foreground border-border bg-muted/40"
                }`}>{i.status}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">{i.endpoint}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Last check {i.lastCheck}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
