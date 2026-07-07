import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Search, Shield, Trash2, Eye } from "lucide-react";
import { ModuleGuard, ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_LIST, ROLES, type Role } from "@/lib/rbac";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/users")({
  component: () => (
    <ModuleGuard module="users">
      <UsersPage />
    </ModuleGuard>
  ),
});

const seed = [
  { name: "Layla Al Marri", email: "layla@rpm.ae", role: "super_admin" as Role, status: "Active", station: "AD Central", mfa: true },
  { name: "Omar Al Suwaidi", email: "omar@rpm.ae", role: "ops_manager" as Role, status: "Active", station: "AD Central", mfa: true },
  { name: "Sara Al Hosani", email: "sara@rpm.ae", role: "dispatcher" as Role, status: "Active", station: "AD Central", mfa: true },
  { name: "Khalid Al Nuaimi", email: "khalid@rpm.ae", role: "fleet_manager" as Role, status: "Active", station: "Al Ain", mfa: true },
  { name: "Mariam Al Blooshi", email: "mariam@rpm.ae", role: "crew_supervisor" as Role, status: "Active", station: "Dubai North", mfa: false },
  { name: "Rashid Al Ameri", email: "rashid@rpm.ae", role: "ambulance_crew" as Role, status: "On shift", station: "Dubai North", mfa: true },
  { name: "Dr. Noura Al Zaabi", email: "noura@rpm.ae", role: "hospital_coordinator" as Role, status: "Active", station: "SKMC", mfa: true },
  { name: "Fatima Al Qassimi", email: "fatima@rpm.ae", role: "finance" as Role, status: "Active", station: "HQ", mfa: true },
  { name: "Yusuf Al Marzooqi", email: "yusuf@rpm.ae", role: "ambulance_crew" as Role, status: "Off duty", station: "Sharjah", mfa: true },
  { name: "Aisha Al Falasi", email: "aisha@rpm.ae", role: "dispatcher" as Role, status: "Pending", station: "AD Central", mfa: false },
];

function UsersPage() {
  const [users, setUsers] = useState(seed);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    const matches =
      !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const roleOk = roleFilter === "all" || u.role === roleFilter;
    return matches && roleOk;
  });

  return (
    <div>
      <ModuleHeader
        module="users"
        actions={
          <NewUserDialog
            onCreate={(u) => {
              setUsers((prev) => [
                { ...u, status: "Pending", mfa: false, station: "AD Central" },
                ...prev,
              ]);
              toast.success(`User ${u.name} created`, { description: "Invitation email sent" });
            }}
          />
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total users" value={users.length} icon="Users" index={0} />
        <StatCard label="Active" value={users.filter((u) => u.status === "Active" || u.status === "On shift").length} tone="success" icon="UserCheck" index={1} />
        <StatCard label="Pending" value={users.filter((u) => u.status === "Pending").length} tone="warning" icon="UserPlus" index={2} />
        <StatCard label="MFA enabled" value={`${Math.round((users.filter((u) => u.mfa).length / users.length) * 100)}%`} tone="info" icon="ShieldCheck" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <Panel
          title="All users"
          subtitle={`${filtered.length} of ${users.length}`}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="pl-8 h-8 w-40 bg-surface text-xs"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-40 bg-surface text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {ROLE_LIST.map((r) => (
                    <SelectItem key={r.key} value={r.key}>{r.shortLabel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        >
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="px-5 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">Station</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">MFA</th>
                  <th className="px-5 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.email}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-accent/20"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-[11px] font-semibold text-primary-foreground">
                          {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className="text-xs">
                        {ROLES[u.role].shortLabel}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{u.station}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          u.status === "Active" || u.status === "On shift"
                            ? "text-success border-success/40 bg-success/10"
                            : u.status === "Pending"
                              ? "text-warning border-warning/40 bg-warning/10"
                              : "text-muted-foreground border-border bg-surface"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {u.mfa ? (
                        <Shield className="h-4 w-4 text-success" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Permission matrix" subtitle="Modules per role">
            <div className="space-y-2 text-xs">
              {ROLE_LIST.map((r) => (
                <div key={r.key} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <div>
                    <div className="font-medium text-sm">{r.shortLabel}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {r.modules.length} modules
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {r.modules.slice(0, 6).map((m) => (
                      <span key={m} className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Audit log" subtitle="Recent activity">
            <div className="space-y-3 text-xs">
              {[
                { u: "Layla Al Marri", a: "Created user Aisha Al Falasi", t: "2m ago" },
                { u: "Omar Al Suwaidi", a: "Updated role for Rashid", t: "18m ago" },
                { u: "System", a: "MFA challenge passed · Sara", t: "42m ago" },
                { u: "Layla Al Marri", a: "Approved shift swap", t: "1h ago" },
              ].map((e, i) => (
                <div key={i} className="flex items-start gap-2 pb-2 border-b border-border/50 last:border-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <div className="flex-1">
                    <div className="text-foreground">{e.a}</div>
                    <div className="text-muted-foreground mt-0.5">
                      {e.u} · {e.t}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function NewUserDialog({
  onCreate,
}: {
  onCreate: (u: { name: string; email: string; role: Role }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("dispatcher");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Plus className="h-4 w-4 mr-1" /> New user
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface-elevated border-border">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROLE_LIST.map((r) => (
                  <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-gradient-primary text-primary-foreground"
            onClick={() => {
              if (!name || !email) return toast.error("Name and email required");
              onCreate({ name, email, role });
              setOpen(false);
              setName("");
              setEmail("");
            }}
          >
            Create & send invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
