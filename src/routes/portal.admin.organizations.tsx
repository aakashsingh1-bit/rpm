import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit3, Trash2, Search, Building2 } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { ORGS, type AdminOrg } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/organizations")({
  component: OrgsPage,
});

function emptyOrg(): AdminOrg {
  return {
    id: `ORG-${Math.floor(Math.random() * 900 + 100)}`,
    name: "", code: "", country: "UAE", region: "", timezone: "Asia/Dubai", language: "EN / AR",
    contact: "", phone: "", email: "", address: "", users: 0, status: "Active", createdAt: new Date().toLocaleDateString(),
  };
}

function OrgsPage() {
  const [rows, setRows] = useState<AdminOrg[]>(ORGS);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminOrg | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<AdminOrg>(emptyOrg());

  const filtered = rows.filter((r) =>
    [r.name, r.code, r.region, r.contact].some((v) => v.toLowerCase().includes(q.toLowerCase())),
  );

  function save() {
    if (!draft.name || !draft.code) { toast.error("Name and code are required"); return; }
    if (editing) {
      setRows((rs) => rs.map((r) => (r.id === draft.id ? draft : r)));
      toast.success("Organization updated");
    } else {
      setRows((rs) => [draft, ...rs]);
      toast.success("Organization created");
    }
    setEditing(null); setCreating(false); setDraft(emptyOrg());
  }

  function toggleActive(id: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r)));
  }

  function remove(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
    toast.success("Organization deleted");
  }

  const open = creating || !!editing;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-semibold">Organization Management</h2>
          <p className="text-sm text-muted-foreground">Multi-company / multi-region tenants across the EMS platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-9 pl-8 w-56" />
          </div>
          <Dialog open={open} onOpenChange={(o) => { if (!o) { setEditing(null); setCreating(false); } }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setDraft(emptyOrg()); setCreating(true); }} className="h-9">
                <Plus className="h-4 w-4 mr-1" /> Create organization
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit organization" : "New organization"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["name","Organization Name"],["code","Organization Code"],
                  ["address","Address"],["country","Country"],
                  ["region","Region"],["timezone","Time Zone"],
                  ["language","Language"],["contact","Contact Person"],
                  ["phone","Phone"],["email","Email"],
                ].map(([k, label]) => (
                  <div key={k}>
                    <Label className="text-xs">{label}</Label>
                    <Input value={(draft as any)[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value } as AdminOrg)} className="h-9 mt-1" />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancel</Button>
                <Button onClick={save}>{editing ? "Save changes" : "Create"}</Button>
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
                <th className="text-left px-3 py-2">Organization</th>
                <th className="text-left px-3 py-2">Region</th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2">Users</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/30 grid place-items-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground">{r.code} · {r.timezone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">{r.region}, {r.country}</td>
                  <td className="px-3 py-2.5">
                    <div>{r.contact}</div>
                    <div className="text-[11px] text-muted-foreground">{r.phone}</div>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{r.users}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={r.status === "Active" ? "default" : "secondary"}>{r.status}</Badge>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(r.id)}>{r.status === "Active" ? "Deactivate" : "Activate"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setDraft(r); setEditing(r); }}><Edit3 className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
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
