import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Panel, StatCard } from "@/components/portal/Module";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { certStats } from "@/lib/crew-data";
import { Award, Search, Plus, ArrowRight } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/crew/certifications")({
  component: CertificationsPage,
});

function CertificationsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const s = certStats();

  const rows = useMemo(
    () =>
      s.all.filter(
        (c) =>
          (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.member.toLowerCase().includes(q.toLowerCase())) &&
          (status === "all" || c.status === status),
      ),
    [q, status, s.all],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total certs" value={s.all.length} icon="Award" index={0} />
        <StatCard label="Valid" value={s.valid} tone="success" icon="CheckCircle" index={1} />
        <StatCard label="Expiring ≤30d" value={s.expiring} tone="warning" icon="AlertTriangle" index={2} />
        <StatCard label="Expired" value={s.expired} tone="danger" icon="XCircle" index={3} />
      </div>

      <Panel
        title="Certifications & training records"
        subtitle="License and course validity across the workforce"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                <Plus className="h-3.5 w-3.5 mr-1" /> Log training
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record training / certification</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Crew member</Label><Input className="mt-1" placeholder="Search…" /></div>
                <div><Label className="text-xs">Certification / course</Label><Input className="mt-1" placeholder="e.g. ACLS" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Issued</Label><Input className="mt-1" type="date" /></div>
                  <div><Label className="text-xs">Expires</Label><Input className="mt-1" type="date" /></div>
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Training record saved")}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      >
        <div className="grid md:grid-cols-3 gap-2 mb-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search certification or crew…" className="pl-8 h-9 text-xs" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Valid">Valid</SelectItem>
              <SelectItem value="Expiring">Expiring</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Certification</th>
                <th className="text-left px-3 py-2">Crew</th>
                <th className="text-left px-3 py-2 hidden md:table-cell">Issuer</th>
                <th className="text-left px-3 py-2 hidden md:table-cell">Issued</th>
                <th className="text-left px-3 py-2">Expires</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-right px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((c, i) => (
                <tr key={i} className="hover:bg-accent/30 transition-colors">
                  <td className="px-3 py-2 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> {c.name}</span>
                  </td>
                  <td className="px-3 py-2 text-sm">{c.member}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground hidden md:table-cell">{c.issuer}</td>
                  <td className="px-3 py-2 text-xs font-mono hidden md:table-cell">{c.issued}</td>
                  <td className="px-3 py-2 text-xs font-mono">{c.expires}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      c.status === "Valid" ? "text-success border-success/40 bg-success/10"
                        : c.status === "Expiring" ? "text-warning border-warning/40 bg-warning/10"
                        : "text-destructive border-destructive/40 bg-destructive/10"
                    }`}>{c.status}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link to="/portal/crew/$id" params={{ id: c.memberId }} className="text-[10px] font-mono text-primary hover:underline inline-flex items-center gap-1">
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
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
