import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { LEAVE_REQUESTS, CREW, type LeaveRequest } from "@/lib/crew-data";
import { Check, X, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/crew/leave")({
  component: LeavePage,
});

function LeavePage() {
  const [items, setItems] = useState<LeaveRequest[]>(LEAVE_REQUESTS);

  const set = (id: string, status: LeaveRequest["status"]) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success(`${id} ${status.toLowerCase()}`);
  };

  const pending = items.filter((l) => l.status === "Pending").length;
  const approved = items.filter((l) => l.status === "Approved").length;
  const denied = items.filter((l) => l.status === "Denied").length;
  const daysOut = items.filter((l) => l.status === "Approved").reduce((s, l) => s + l.days, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending" value={pending} tone="warning" icon="Clock" index={0} />
        <StatCard label="Approved" value={approved} tone="success" icon="Check" index={1} />
        <StatCard label="Denied" value={denied} tone="danger" icon="X" index={2} />
        <StatCard label="Days out" value={daysOut} tone="info" icon="Plane" index={3} />
      </div>

      <Panel
        title="Leave requests"
        subtitle="Approve, deny, and track roster impact"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5 mr-1" /> New request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Submit leave request</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Crew member</Label>
                  <Select>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {CREW.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Leave type" /></SelectTrigger>
                    <SelectContent>
                      {["Annual", "Sick", "Emergency", "Training", "Unpaid"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">From</Label><Input className="mt-1" type="date" /></div>
                  <div><Label className="text-xs">To</Label><Input className="mt-1" type="date" /></div>
                </div>
                <div><Label className="text-xs">Reason</Label><Input className="mt-1" placeholder="Reason" /></div>
              </div>
              <DialogFooter>
                <Button className="bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Leave request submitted")}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      >
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Request</th>
                <th className="text-left px-3 py-2">Crew</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2 hidden md:table-cell">From → To</th>
                <th className="text-left px-3 py-2">Days</th>
                <th className="text-left px-3 py-2 hidden lg:table-cell">Reason</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-right px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((l) => (
                <tr key={l.id} className="hover:bg-accent/20">
                  <td className="px-3 py-2 text-xs font-mono text-primary">{l.id}</td>
                  <td className="px-3 py-2 text-sm">{l.memberName}</td>
                  <td className="px-3 py-2 text-xs">{l.type}</td>
                  <td className="px-3 py-2 text-xs font-mono hidden md:table-cell">{l.from} → {l.to}</td>
                  <td className="px-3 py-2 text-xs font-mono">{l.days}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-[200px]">{l.reason}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      l.status === "Approved" ? "text-success border-success/40 bg-success/10"
                        : l.status === "Denied" ? "text-destructive border-destructive/40 bg-destructive/10"
                        : "text-warning border-warning/40 bg-warning/10"
                    }`}>{l.status}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {l.status === "Pending" ? (
                      <div className="inline-flex items-center gap-1">
                        <Button size="icon" variant="outline" className="h-7 w-7 text-success" onClick={() => set(l.id, "Approved")}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-7 w-7 text-destructive" onClick={() => set(l.id, "Denied")}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-[10px]" onClick={() => set(l.id, "Pending")}>Reopen</Button>
                    )}
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
