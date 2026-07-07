import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit3, Copy, Archive, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/roles")({
  component: RolesPage,
});

function emptyRole(): AdminRole {
  return {
    id: `R-${Math.floor(Math.random() * 90 + 10)}`, name: "", description: "", organization: "All",
    users: 0, status: "Active", system: false,
  };
}

function RolesPage() {
  const [rows, setRows] = useState<AdminRole[]>(ADMIN_ROLES);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminRole | null>(null);
  const [draft, setDraft] = useState<AdminRole>(emptyRole());

  function save() {
    if (!draft.name) { toast.error("Role name required"); return; }
    if (editing) {
      setRows((rs) => rs.map((r) => (r.id === draft.id ? draft : r)));
      toast.success("Role updated");
    } else {
      setRows((rs) => [draft, ...rs]);
      toast.success("Role created");
    }
    setCreating(false); setEditing(null); setDraft(emptyRole());
  }
  function clone(r: AdminRole) {
    const c = { ...r, id: `R-${Math.floor(Math.random() * 90 + 10)}`, name: `${r.name} (copy)`, users: 0, system: false };
    setRows((rs) => [c, ...rs]);
    toast.success("Role cloned");
  }
  function archive(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Archived" : "Active" } : r)));
  }
  function remove(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
    toast.success("Role deleted");
  }
  const open = creating || !!editing;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-semibold">Roles & Permissions (RBAC)</h2>
          <p className="text-sm text-muted-foreground">Define roles dynamically. Configure module access from the Modules tab.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/portal/admin/modules" className="text-xs px-3 py-1.5 rounded-md border border-border bg-card hover:border-primary/50 flex items-center gap-1">
            Module Access <ArrowRight className="h-3 w-3" />
          </Link>
          <Dialog open={open} onOpenChange={(o) => { if (!o) { setCreating(false); setEditing(null); } }}>
            <DialogTrigger asChild>
              <Button className="h-9" onClick={() => { setDraft(emptyRole()); setCreating(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Create role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit role" : "New role"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Role Name</Label>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-9 mt-1" />
                </div>
                <div><Label className="text-xs">Description</Label>
                  <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} className="mt-1" />
                </div>
                <div><Label className="text-xs">Organization</Label>
                  <Input value={draft.organization} onChange={(e) => setDraft({ ...draft, organization: e.target.value })} className="h-9 mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
                <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r) => (
          <Panel key={r.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/30 grid place-items-center">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground">{r.id} · {r.organization}</div>
                </div>
              </div>
              {r.system && <Badge variant="secondary" className="text-[10px]">System</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-3 min-h-[40px]">{r.description || "No description"}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-muted-foreground">{r.users} users · <span className={r.status === "Active" ? "text-success" : "text-muted-foreground"}>{r.status}</span></div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => clone(r)} title="Clone"><Copy className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => { setDraft(r); setEditing(r); }} title="Edit"><Edit3 className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => archive(r.id)} title="Archive"><Archive className="h-3.5 w-3.5" /></Button>
                {!r.system && <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
