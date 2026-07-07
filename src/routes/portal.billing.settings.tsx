import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FINANCE_SETTINGS } from "@/lib/finance-data";

export const Route = createFileRoute("/portal/billing/settings")({
  component: FinanceSettings,
});

function FinanceSettings() {
  const [service, setService] = useState(FINANCE_SETTINGS.serviceCharges);
  const [amb, setAmb] = useState(FINANCE_SETTINGS.ambulanceCharges);
  const [vat, setVat] = useState(FINANCE_SETTINGS.tax.vat);
  const [trn, setTrn] = useState(FINANCE_SETTINGS.tax.trn);
  const [format, setFormat] = useState(FINANCE_SETTINGS.invoiceFormat);
  const [methods, setMethods] = useState(FINANCE_SETTINGS.paymentMethods);
  const [cats, setCats] = useState(FINANCE_SETTINGS.customerCategories);
  const [types, setTypes] = useState(FINANCE_SETTINGS.contractTypes);

  return (
    <div>
      <ModuleHeader module="billing" actions={<Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={() => toast.success("Finance settings saved")}><Save className="h-3.5 w-3.5 mr-1" /> Save settings</Button>} />

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Service charges" subtitle="Base pricing per service type">
          <RateTable rows={service} onChange={setService} />
        </Panel>

        <Panel title="Ambulance charges" subtitle="Unit activation, mileage & waiting">
          <RateTable rows={amb} onChange={setAmb} />
        </Panel>

        <Panel title="Tax configuration" subtitle={`Jurisdiction · ${FINANCE_SETTINGS.tax.jurisdiction}`}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="VAT (%)"><Input type="number" value={vat} onChange={(e) => setVat(Number(e.target.value))} /></Field>
            <Field label="TRN"><Input value={trn} onChange={(e) => setTrn(e.target.value)} /></Field>
          </div>
        </Panel>

        <Panel title="Invoice number format" subtitle="Template used for new invoices">
          <Field label="Format"><Input value={format} onChange={(e) => setFormat(e.target.value)} /></Field>
          <div className="text-[11px] text-muted-foreground mt-2">Preview: <span className="font-mono">{format.replace("YYYY", "2026").replace("####", "3422")}</span></div>
        </Panel>

        <Panel title="Payment methods">
          <ChipEditor items={methods} setItems={setMethods} placeholder="Add method…" />
        </Panel>

        <Panel title="Customer categories">
          <ChipEditor items={cats} setItems={setCats} placeholder="Add category…" />
        </Panel>

        <Panel title="Contract types">
          <ChipEditor items={types} setItems={setTypes} placeholder="Add contract type…" />
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}

function RateTable({ rows, onChange }: { rows: { code: string; label: string; price: number; unit: string }[]; onChange: (r: typeof rows) => void }) {
  return (
    <div className="space-y-1">
      {rows.map((r, i) => (
        <div key={r.code} className="grid grid-cols-[70px_1fr_100px_110px] items-center gap-2 text-xs">
          <span className="font-mono text-muted-foreground">{r.code}</span>
          <Input value={r.label} onChange={(e) => onChange(rows.map((x, j) => (i === j ? { ...x, label: e.target.value } : x)))} className="h-8 text-xs" />
          <Input type="number" value={r.price} onChange={(e) => onChange(rows.map((x, j) => (i === j ? { ...x, price: Number(e.target.value) } : x)))} className="h-8 text-xs text-right font-mono" />
          <span className="text-muted-foreground">{r.unit}</span>
        </div>
      ))}
    </div>
  );
}

function ChipEditor({ items, setItems, placeholder }: { items: string[]; setItems: (v: string[]) => void; placeholder: string }) {
  const [v, setV] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((m) => (
          <span key={m} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border bg-surface/40">
            {m}
            <button className="text-muted-foreground hover:text-destructive" onClick={() => setItems(items.filter((x) => x !== m))}><Trash2 className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} className="h-8 text-xs" />
        <Button size="sm" variant="outline" onClick={() => { if (v.trim()) { setItems([...items, v.trim()]); setV(""); } }}><Plus className="h-3 w-3" /></Button>
      </div>
    </div>
  );
}
