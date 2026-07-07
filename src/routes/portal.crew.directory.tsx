import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, ArrowRight, Plus } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CREW } from "@/lib/crew-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/crew/directory")({
  component: DirectoryPage,
});

function DirectoryPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [station, setStation] = useState<string>("all");
  const [duty, setDuty] = useState<string>("all");

  const filtered = useMemo(
    () =>
      CREW.filter(
        (c) =>
          (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.employeeId.toLowerCase().includes(q.toLowerCase())) &&
          (role === "all" || c.role === role) &&
          (station === "all" || c.station === station) &&
          (duty === "all" || c.duty === duty),
      ),
    [q, role, station, duty],
  );

  const roles = Array.from(new Set(CREW.map((c) => c.role)));
  const stations = Array.from(new Set(CREW.map((c) => c.station)));

  return (
    <Panel
      title="Crew directory"
      subtitle={`${filtered.length} of ${CREW.length} personnel`}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add crew
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Register new crew member</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label className="text-xs">Full name</Label><Input className="mt-1" placeholder="Full name" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Employee ID</Label><Input className="mt-1" placeholder="EMS-####" /></div>
                <div><Label className="text-xs">Role</Label><Input className="mt-1" placeholder="Paramedic · ALS" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Station</Label><Input className="mt-1" placeholder="Abu Dhabi Central" /></div>
                <div><Label className="text-xs">Phone</Label><Input className="mt-1" placeholder="+971 …" /></div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => toast.success("Crew member registered")} className="bg-gradient-primary text-primary-foreground">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid md:grid-cols-4 gap-2 mb-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name / ID…" className="pl-8 h-9 text-xs" />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={station} onValueChange={setStation}>
          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Station" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stations</SelectItem>
            {stations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={duty} onValueChange={setDuty}>
          <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Duty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any duty</SelectItem>
            <SelectItem value="On duty">On duty</SelectItem>
            <SelectItem value="Off duty">Off duty</SelectItem>
            <SelectItem value="Break">Break</SelectItem>
            <SelectItem value="Leave">Leave</SelectItem>
            <SelectItem value="Training">Training</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2 hidden md:table-cell">Role</th>
              <th className="text-left px-3 py-2 hidden md:table-cell">Station</th>
              <th className="text-left px-3 py-2">Unit</th>
              <th className="text-left px-3 py-2">Duty</th>
              <th className="text-left px-3 py-2 hidden md:table-cell">Perf</th>
              <th className="text-right px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 * i }}
                className="hover:bg-accent/30 transition-colors"
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-primary grid place-items-center text-[10px] font-semibold text-primary-foreground">
                      {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{c.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs hidden md:table-cell">{c.role}</td>
                <td className="px-3 py-2 text-xs hidden md:table-cell">{c.station}</td>
                <td className="px-3 py-2 text-xs font-mono text-primary">{c.unit}</td>
                <td className="px-3 py-2">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    c.duty === "On duty" ? "text-success border-success/40 bg-success/10"
                      : c.duty === "Leave" ? "text-warning border-warning/40 bg-warning/10"
                      : "text-muted-foreground border-border bg-surface"
                  }`}>{c.duty}</span>
                </td>
                <td className="px-3 py-2 text-xs font-mono hidden md:table-cell">{c.perf}%</td>
                <td className="px-3 py-2 text-right">
                  <Link to="/portal/crew/$id" params={{ id: c.id }} className="text-[10px] font-mono text-primary hover:underline inline-flex items-center gap-1">
                    Profile <ArrowRight className="h-3 w-3" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
