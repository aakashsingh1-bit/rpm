import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ADMIN_ROLES, ALL_MODULES, PERMISSIONS, MODULE_ACCESS } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/modules")({
  component: ModulesPage,
});

function ModulesPage() {
  const [role, setRole] = useState<string>(ADMIN_ROLES[2].name);
  const [access, setAccess] = useState<Record<string, Record<string, boolean>>>(() =>
    JSON.parse(JSON.stringify(MODULE_ACCESS)),
  );
  const [perms, setPerms] = useState<Record<string, Record<string, boolean>>>(() => {
    const map: Record<string, Record<string, boolean>> = {};
    ALL_MODULES.forEach((m) => {
      map[m] = {};
      PERMISSIONS.forEach((p) => { map[m][p] = ["View", "Export"].includes(p); });
    });
    return map;
  });

  function toggleModule(m: string) {
    setAccess((a) => ({ ...a, [role]: { ...a[role], [m]: !a[role]?.[m] } }));
  }
  function togglePerm(m: string, p: string) {
    setPerms((all) => ({ ...all, [m]: { ...all[m], [p]: !all[m][p] } }));
  }
  function save() { toast.success(`Access matrix saved for ${role}`); }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-display font-semibold">Module Access Control</h2>
          <p className="text-sm text-muted-foreground">Decide which modules a role can access and configure permission types per module.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">Role:</div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-9 w-64"><SelectValue /></SelectTrigger>
            <SelectContent>{ADMIN_ROLES.map((r) => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
          </Select>
          <Button className="h-9" onClick={save}>Save matrix</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <Panel title="Module access" subtitle={`Toggle modules ${role} can access`}>
          <div className="space-y-1">
            {ALL_MODULES.map((m) => {
              const on = !!access[role]?.[m];
              return (
                <label key={m} className="flex items-center justify-between rounded-md border border-border/60 bg-surface/40 px-3 py-2 hover:border-primary/40 cursor-pointer">
                  <span className="text-sm">{m}</span>
                  <Checkbox checked={on} onCheckedChange={() => toggleModule(m)} />
                </label>
              );
            })}
          </div>
        </Panel>

        <Panel title="Permission types per module" subtitle="View · Create · Edit · Delete · Approve · Export · Print · Assign · Close · Reopen · Configure">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-2 py-2 sticky left-0 bg-card">Module</th>
                  {PERMISSIONS.map((p) => (
                    <th key={p} className="px-2 py-2 text-center font-medium text-muted-foreground">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_MODULES.filter((m) => access[role]?.[m]).map((m) => (
                  <tr key={m} className="border-b border-border/50">
                    <td className="px-2 py-2 sticky left-0 bg-card font-medium">{m}</td>
                    {PERMISSIONS.map((p) => (
                      <td key={p} className="px-2 py-2 text-center">
                        <Checkbox checked={perms[m][p]} onCheckedChange={() => togglePerm(m, p)} />
                      </td>
                    ))}
                  </tr>
                ))}
                {ALL_MODULES.filter((m) => access[role]?.[m]).length === 0 && (
                  <tr><td colSpan={PERMISSIONS.length + 1} className="text-center text-muted-foreground py-8">No modules enabled for {role}.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
