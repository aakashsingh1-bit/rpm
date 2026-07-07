import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FileText, Send, Save, Edit3, Ambulance, HeartPulse } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BILLS, billTotal, money, type Bill } from "@/lib/finance-data";

export const Route = createFileRoute("/portal/billing/billing")({
  component: BillingManagement,
});

function BillingManagement() {
  const [selectedId, setSelectedId] = useState<string>(BILLS[0].id);
  const [bills, setBills] = useState(BILLS);
  const bill = useMemo(() => bills.find((b) => b.id === selectedId)!, [bills, selectedId]);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<Bill["charges"]>(bill.charges);

  function pick(id: string) {
    setSelectedId(id);
    const b = bills.find((x) => x.id === id)!;
    setDraft(b.charges);
    setEdit(false);
  }

  function saveDraft() {
    setBills((prev) => prev.map((b) => (b.id === bill.id ? { ...b, charges: draft, status: "Draft" } : b)));
    setEdit(false);
    toast.success(`${bill.id} saved as draft`);
  }
  function submit() {
    setBills((prev) => prev.map((b) => (b.id === bill.id ? { ...b, charges: draft, status: "Pending Approval" } : b)));
    toast.success(`${bill.id} submitted for approval`);
  }
  function generate() {
    setBills((prev) => prev.map((b) => (b.id === bill.id ? { ...b, charges: draft, status: "Approved" } : b)));
    toast.success(`${bill.id} approved · ready to invoice`);
  }

  return (
    <div>
      <ModuleHeader
        module="billing"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/portal/billing/invoices" className="text-xs px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground shadow-glow">Go to invoices</Link>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        <Panel title="Bills queue" subtitle="Closed incidents ready to bill">
          <div className="space-y-1">
            {bills.map((b) => (
              <button key={b.id} onClick={() => pick(b.id)} className={`w-full text-left rounded-md border p-2.5 transition-colors ${b.id === selectedId ? "border-primary/50 bg-primary/5" : "border-border/60 hover:border-primary/30"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{b.patient}</div>
                  <span className="text-[10px] font-mono">{b.status}</span>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">{b.id} · {b.service}</div>
                <div className="text-[11px] font-mono tabular-nums text-primary mt-0.5">{money(billTotal(b))}</div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={`Bill ${bill.id}`} subtitle={`${bill.incident} · ${bill.service}`}>
            <div className="grid md:grid-cols-2 gap-3 text-xs mb-4">
              <Row k="Incident #" v={bill.incident} />
              <Row k="Patient" v={bill.patient} />
              <Row k="Ambulance" v={<span className="inline-flex items-center gap-1"><Ambulance className="h-3 w-3" />{bill.unit}</span>} />
              <Row k="Service type" v={bill.service} />
              <Row k="Distance" v={`${bill.distanceKm} km`} />
              <Row k="Crew" v={bill.crew} />
              <Row k="Hospital" v={bill.hospital} />
              <Row k="ePCR" v={<span className={`inline-flex items-center gap-1 ${bill.epcrComplete ? "text-success" : "text-warning"}`}><HeartPulse className="h-3 w-3" /> {bill.epcrComplete ? "Complete" : "Missing"}</span>} />
            </div>

            <div className="rounded-lg border border-border">
              <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Billing components</div>
                <button onClick={() => setEdit((e) => !e)} className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"><Edit3 className="h-3 w-3" /> {edit ? "Done editing" : "Edit charges"}</button>
              </div>
              <div className="divide-y divide-border/50">
                {(Object.keys(draft) as (keyof Bill["charges"])[]).map((k) => (
                  <div key={k} className="flex items-center justify-between px-3 py-2 text-xs">
                    <span className="capitalize text-muted-foreground">{k === "consumables" ? "Medical consumables" : k === "additional" ? "Additional services" : `${k} charges`}</span>
                    {edit ? (
                      <Input type="number" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: Number(e.target.value) })} className="h-7 w-24 text-right font-mono text-xs" />
                    ) : (
                      <span className="font-mono tabular-nums">{money(draft[k])}</span>
                    )}
                  </div>
                ))}
                <div className="flex items-center justify-between px-3 py-2 text-sm font-semibold bg-surface/40">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-primary">{money(Object.values(draft).reduce((a, b) => a + b, 0))}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={saveDraft}><Save className="h-3.5 w-3.5 mr-1" /> Save draft</Button>
              <Button variant="outline" size="sm" onClick={submit}><Send className="h-3.5 w-3.5 mr-1" /> Submit for approval</Button>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={generate} disabled={!bill.epcrComplete}>
                <FileText className="h-3.5 w-3.5 mr-1" /> Generate bill
              </Button>
              {!bill.epcrComplete && <span className="text-[11px] text-warning">Complete ePCR before generating bill</span>}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded border border-border/40 bg-surface/30 px-3 py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
