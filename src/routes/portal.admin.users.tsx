import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit3, Trash2, Search, Lock, Unlock, KeyRound, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ADMIN_USERS, ADMIN_ROLES, ORGS, type AdminUser, type AdminUserStatus } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/users")({
  component: UsersPage,
});

function emptyUser(): AdminUser {
  return {
    id: `U-${Math.floor(Math.random() * 9000 + 1000)}`,
    employeeId: "", name: "", username: "", email: "", phone: "", designation: "", department: "",
    organization: "RPM-AUH", branch: "", userType: "Internal", role: "Read Only User",
    status: "Pending Approval", mfa: false, lastLogin: "—", createdAt: new Date().toLocaleDateString(),
  };
}

const STATUSES: AdminUserStatus[] = ["Active", "Inactive", "Locked", "Pending Approval", "Suspended"];

function UsersPage() {
  const [rows, setRows] = useState<AdminUser[]>(ADMIN_USERS);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [draft, setDraft] = useState<AdminUser>(emptyUser());

  const filtered = rows.filter((r) => {
    const matches = [r.name, r.username, r.email, r.employeeId, r.role].some((v) =>
      v.toLowerCase().includes(q.toLowerCase()),
    );
    return matches && (statusFilter === "all" || r.status === statusFilter);
  });

  function save() {
    if (!draft.name || !draft.email) { toast.error("Name and email are required"); return; }
    if (editing) {
      setRows((rs) => rs.map((r) => (r.id === draft.id ? draft : r)));
      toast.success("User updated");
    } else {
      setRows((rs) => [draft, ...rs]);
      toast.success("User created");
    }
    setCreating(false); setEditing(null); setDraft(emptyUser());
  }

  function setStatus(id: string, s: AdminUserStatus) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: s } : r)));
    toast.success(`Status → ${s}`);
  }

  function remove(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
    toast.success("User deleted");
  }

  const open = creating || !!editing;

  const statusBadge = (s: AdminUserStatus) => {
    const cls =
      s === "Active" ? "bg-success/10 text-success border-success/30" :
      s === "Pending Approval" ? "bg-warning/10 text-warning border-warning/30" :
      s === "Locked" ? "bg-destructive/10 text-destructive border-destructive/30" :
      s === "Suspended" ? "bg-destructive/10 text-destructive border-destructive/30" :
      "bg-muted text-muted-foreground border-border";
    return <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cls}`}>{s}</span>;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">Create, secure and manage every user across the EMS Command Platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="h-9 pl-8 w-60" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={(o) => { if (!o) { setCreating(false); setEditing(null); } }}>
            <DialogTrigger asChild>
              <Button className="h-9" onClick={() => { setDraft(emptyUser()); setCreating(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Create user
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? `Edit ${editing.name}` : "New user"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["employeeId","Employee ID"],["name","Full Name"],
                  ["username","Username"],["email","Email"],
                  ["phone","Mobile"],["designation","Designation"],
                  ["department","Department"],["branch","Branch"],
                ].map(([k, label]) => (
                  <div key={k}>
                    <Label className="text-xs">{label}</Label>
                    <Input value={(draft as any)[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value } as AdminUser)} className="h-9 mt-1" />
                  </div>
                ))}
                <div>
                  <Label className="text-xs">Organization</Label>
                  <Select value={draft.organization} onValueChange={(v) => setDraft({ ...draft, organization: v })}>
                    <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{ORGS.map((o) => <SelectItem key={o.id} value={o.code}>{o.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Role</Label>
                  <Select value={draft.role} onValueChange={(v) => setDraft({ ...draft, role: v })}>
                    <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{ADMIN_ROLES.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">User Type</Label>
                  <Select value={draft.userType} onValueChange={(v) => setDraft({ ...draft, userType: v as AdminUser["userType"] })}>
                    <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="Contractor">Contractor</SelectItem>
                      <SelectItem value="Partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as AdminUserStatus })}>
                    <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
                <Button onClick={save}>{editing ? "Save changes" : "Create user"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2">User</th>
                <th className="text-left px-3 py-2">Role</th>
                <th className="text-left px-3 py-2">Organization</th>
                <th className="text-left px-3 py-2">MFA</th>
                <th className="text-left px-3 py-2">Last login</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 grid place-items-center text-[11px] font-semibold text-primary">
                        {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email} · {u.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">{u.role}</td>
                  <td className="px-3 py-2.5">
                    <div>{u.organization}</div>
                    <div className="text-[11px] text-muted-foreground">{u.branch}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    {u.mfa ? <Badge variant="default">Enabled</Badge> : <Badge variant="secondary">Off</Badge>}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{u.lastLogin}</td>
                  <td className="px-3 py-2.5">{statusBadge(u.status)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" title="Reset password" onClick={() => toast.success("Password reset link sent")}><KeyRound className="h-3.5 w-3.5" /></Button>
                      {u.status === "Locked"
                        ? <Button size="sm" variant="ghost" title="Unlock" onClick={() => setStatus(u.id, "Active")}><Unlock className="h-3.5 w-3.5" /></Button>
                        : <Button size="sm" variant="ghost" title="Lock" onClick={() => setStatus(u.id, "Locked")}><Lock className="h-3.5 w-3.5" /></Button>}
                      <Button size="sm" variant="ghost" onClick={() => { setDraft(u); setEditing(u); }}><Edit3 className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(u.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
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
