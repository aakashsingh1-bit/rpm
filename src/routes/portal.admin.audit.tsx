import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AUDIT_LOG } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/audit")({
  component: AuditPage,
});

function AuditPage() {
  const [q, setQ] = useState("");
  const [module, setModule] = useState("all");
  const [action, setAction] = useState("all");

  const modules = useMemo(() => Array.from(new Set(AUDIT_LOG.map((a) => a.module))), []);
  const actions = useMemo(() => Array.from(new Set(AUDIT_LOG.map((a) => a.action))), []);

  const filtered = AUDIT_LOG.filter((a) => {
    return (
      (module === "all" || a.module === module) &&
      (action === "all" || a.action === action) &&
      [a.user, a.action, a.module, a.before, a.after, a.ip].some((v) => v.toLowerCase().includes(q.toLowerCase()))
    );
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-semibold">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">Every administrative activity — user, module, before/after, IP, device.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-9 pl-8 w-56" />
          </div>
          <Select value={module} onValueChange={setModule}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Module" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {modules.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Action" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-9" onClick={() => toast.success("Exported to CSV")}><Download className="h-4 w-4 mr-1" /> Export</Button>
        </div>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left px-3 py-2">Timestamp</th>
                <th className="text-left px-3 py-2">User</th>
                <th className="text-left px-3 py-2">Module</th>
                <th className="text-left px-3 py-2">Action</th>
                <th className="text-left px-3 py-2">Before → After</th>
                <th className="text-left px-3 py-2">IP · Device · Browser</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-mono text-[11px]">{a.ts}</td>
                  <td className="px-3 py-2.5">{a.user}</td>
                  <td className="px-3 py-2.5">{a.module}</td>
                  <td className="px-3 py-2.5">{a.action}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-xs">{a.before} <span className="text-primary">→</span> {a.after}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">{a.ip} · {a.device} · {a.browser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
