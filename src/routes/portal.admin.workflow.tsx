import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Edit3, GitBranch } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WORKFLOW_STEPS, type WorkflowStep } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/workflow")({
  component: WorkflowPage,
});

function WorkflowPage() {
  const [steps, setSteps] = useState<WorkflowStep[]>(WORKFLOW_STEPS);
  const [editing, setEditing] = useState<WorkflowStep | null>(null);
  const [draft, setDraft] = useState<WorkflowStep | null>(null);

  function toggleApproval(id: string) {
    setSteps((ss) => ss.map((s) => (s.id === id ? { ...s, requiresApproval: !s.requiresApproval } : s)));
  }
  function save() {
    if (!draft) return;
    setSteps((ss) => ss.map((s) => (s.id === draft.id ? draft : s)));
    setEditing(null); setDraft(null);
    toast.success("Step updated");
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold">Workflow Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure the operational dispatch workflow — status values, transitions, approvals and mandatory fields.</p>
      </div>

      <Panel title="Dispatch workflow" subtitle="Emergency Call → CAD → Crew → En Route → On Scene → Transport → Hospital → Completed">
        <div className="grid md:grid-cols-4 gap-3">
          {steps.map((s, i) => (
            <div key={s.id} className="relative">
              <div className="rounded-xl border border-border bg-surface/40 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 grid place-items-center text-xs font-bold text-primary">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">Status: {s.status}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { setDraft({ ...s }); setEditing(s); }}><Edit3 className="h-3.5 w-3.5" /></Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[11px] text-muted-foreground">Approval</div>
                  <Switch checked={s.requiresApproval} onCheckedChange={() => toggleApproval(s.id)} />
                </div>
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Mandatory fields</div>
                  <div className="flex flex-wrap gap-1">
                    {s.mandatoryFields.map((f) => <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>)}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </Panel>

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setDraft(null); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit workflow step</DialogTitle></DialogHeader>
          {draft && (
            <div className="space-y-3">
              <div><label className="text-xs text-muted-foreground">Name</label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-9 mt-1" />
              </div>
              <div><label className="text-xs text-muted-foreground">Status value</label>
                <Input value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="h-9 mt-1" />
              </div>
              <div><label className="text-xs text-muted-foreground">Mandatory fields (comma separated)</label>
                <Input value={draft.mandatoryFields.join(", ")} onChange={(e) => setDraft({ ...draft, mandatoryFields: e.target.value.split(",").map((f) => f.trim()).filter(Boolean) })} className="h-9 mt-1" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Requires approval</label>
                <Switch checked={draft.requiresApproval} onCheckedChange={(v) => setDraft({ ...draft, requiresApproval: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setDraft(null); }}>Cancel</Button>
            <Button onClick={save}><Check className="h-4 w-4 mr-1" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
