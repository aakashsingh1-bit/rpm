import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Database } from "lucide-react";
import { Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MASTER_DATA } from "@/lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/admin/master")({
  component: MasterPage,
});

function MasterPage() {
  const [data, setData] = useState<Record<string, string[]>>(() => JSON.parse(JSON.stringify(MASTER_DATA)));
  const [inputs, setInputs] = useState<Record<string, string>>({});

  function add(k: string) {
    const v = inputs[k]?.trim(); if (!v) return;
    setData((d) => ({ ...d, [k]: [...d[k], v] }));
    setInputs((i) => ({ ...i, [k]: "" }));
    toast.success(`Added to ${k}`);
  }
  function remove(k: string, v: string) {
    setData((d) => ({ ...d, [k]: d[k].filter((x) => x !== v) }));
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-display font-semibold">Master Data Management</h2>
        <p className="text-sm text-muted-foreground">Global reference data used across dispatch, fleet, crew and hospital modules.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(data).map(([k, values]) => (
          <Panel key={k} title={k} subtitle={`${values.length} values`}>
            <div className="flex items-center gap-2 mb-3">
              <Input value={inputs[k] || ""} onChange={(e) => setInputs((i) => ({ ...i, [k]: e.target.value }))} placeholder={`Add ${k.toLowerCase().slice(0, -1)}…`} className="h-9" onKeyDown={(e) => { if (e.key === "Enter") add(k); }} />
              <Button size="sm" onClick={() => add(k)}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {values.map((v) => (
                <Badge key={v} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                  <Database className="h-3 w-3" /> {v}
                  <button onClick={() => remove(k, v)} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
