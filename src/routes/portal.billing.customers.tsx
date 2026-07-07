import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Edit3, History, Trash2, Save } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CUSTOMERS, INVOICES, money, type Customer } from "@/lib/finance-data";

export const Route = createFileRoute("/portal/billing/customers")({
  component: CustomersContracts,
});

const CATEGORIES = ["Insurance", "Corporate", "Government", "Private"] as const;
const emptyCustomer = (): Customer => ({
  id: `CUS-${100 + Math.floor(Math.random() * 900)}`,
  name: "",
  org: "",
  contact: "",
  email: "",
  phone: "",
  address: "",
  category: "Corporate",
  contract: { number: `CN-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`, from: "", to: "", pricing: "Standard tariff", services: ["Emergency"], terms: "Net 30" },
  ytd: 0,
  outstanding: 0,
});

function CustomersContracts() {
  const [list, setList] = useState<Customer[]>(CUSTOMERS);
  const [sel, setSel] = useState(CUSTOMERS[0].id);
  const [q, setQ] = useState("");
  const [dlgOpen, setDlgOpen] = useState(false);
  const [dlgMode, setDlgMode] = useState<"add" | "edit">("add");
  const [draft, setDraft] = useState<Customer>(emptyCustomer());

  const cust = useMemo(() => list.find((c) => c.id === sel) ?? list[0], [list, sel]);
  const history = INVOICES.filter((i) => i.customer === cust.name);
  const filtered = list.filter((c) => (c.name + c.org + c.category).toLowerCase().includes(q.toLowerCase()));

  const openAdd = () => { setDlgMode("add"); setDraft(emptyCustomer()); setDlgOpen(true); };
  const openEdit = () => { setDlgMode("edit"); setDraft({ ...cust, contract: { ...cust.contract } }); setDlgOpen(true); };
  const save = () => {
    if (!draft.name.trim()) return toast.error("Customer name is required");
    if (dlgMode === "add") {
      setList((l) => [draft, ...l]);
      setSel(draft.id);
      toast.success(`${draft.name} added`);
    } else {
      setList((l) => l.map((c) => (c.id === draft.id ? draft : c)));
      toast.success(`${draft.name} updated`);
    }
    setDlgOpen(false);
  };
  const remove = () => {
    if (list.length <= 1) return toast.error("At least one customer required");
    const removed = cust.name;
    setList((l) => l.filter((c) => c.id !== cust.id));
    setSel(list.find((c) => c.id !== cust.id)!.id);
    toast(`${removed} removed`);
  };

  return (
    <div>
      <ModuleHeader module="billing" actions={
        <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add customer
        </Button>
      } />

      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        <Panel title="Customers" subtitle={`${filtered.length} accounts`} actions={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-8 w-40 text-xs" />}>
          <div className="space-y-1">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => setSel(c.id)} className={`w-full text-left rounded-md border p-2.5 transition-colors ${c.id === sel ? "border-primary/50 bg-primary/5" : "border-border/60 hover:border-primary/30"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">{c.category}</span>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">{c.org}</div>
                <div className="flex items-center justify-between text-[10px] mt-1">
                  <span className="text-muted-foreground">YTD {money(c.ytd)}</span>
                  <span className={c.outstanding > 0 ? "text-warning" : "text-success"}>Out {money(c.outstanding)}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={cust.name} subtitle={cust.org} actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={openEdit}><Edit3 className="h-3.5 w-3.5 mr-1" />Edit</Button>
              <Button size="sm" variant="outline" onClick={remove}><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</Button>
            </div>
          }>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <Row k="Contact" v={cust.contact} />
              <Row k="Email" v={cust.email} />
              <Row k="Phone" v={cust.phone} />
              <Row k="Address" v={cust.address} />
              <Row k="Category" v={cust.category} />
              <Row k="YTD revenue" v={money(cust.ytd)} />
            </div>
          </Panel>

          <Panel title={`Contract ${cust.contract.number}`} subtitle="Pricing rules & billing terms">
            <div className="grid md:grid-cols-2 gap-3 text-xs mb-3">
              <Row k="Effective" v={`${cust.contract.from} → ${cust.contract.to}`} />
              <Row k="Pricing" v={cust.contract.pricing} />
              <Row k="Services" v={cust.contract.services.join(", ")} />
              <Row k="Terms" v={cust.contract.terms} />
            </div>
          </Panel>

          <Panel title="Billing history" subtitle="Recent invoices" actions={<History className="h-4 w-4 text-muted-foreground" />}>
            {history.length === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center">No invoices for this customer yet.</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                    <th className="py-2 font-medium">Invoice</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium text-right">Amount</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((i) => (
                    <tr key={i.id} className="border-b border-border/40">
                      <td className="py-2 font-mono">{i.id}</td>
                      <td className="py-2 text-muted-foreground">{i.date}</td>
                      <td className="py-2 text-right font-mono tabular-nums">{money(i.total)}</td>
                      <td className="py-2">{i.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>
      </div>

      <Dialog open={dlgOpen} onOpenChange={setDlgOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dlgMode === "add" ? "New customer" : `Edit ${cust.name}`}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Customer name" v={draft.name} on={(v) => setDraft({ ...draft, name: v })} />
            <Field label="Organisation" v={draft.org} on={(v) => setDraft({ ...draft, org: v })} />
            <Field label="Primary contact" v={draft.contact} on={(v) => setDraft({ ...draft, contact: v })} />
            <Field label="Email" v={draft.email} on={(v) => setDraft({ ...draft, email: v })} />
            <Field label="Phone" v={draft.phone} on={(v) => setDraft({ ...draft, phone: v })} />
            <Field label="Address" v={draft.address} on={(v) => setDraft({ ...draft, address: v })} />
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as Customer["category"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Field label="Contract number" v={draft.contract.number} on={(v) => setDraft({ ...draft, contract: { ...draft.contract, number: v } })} />
            <Field label="Effective from" v={draft.contract.from} on={(v) => setDraft({ ...draft, contract: { ...draft.contract, from: v } })} />
            <Field label="Effective to" v={draft.contract.to} on={(v) => setDraft({ ...draft, contract: { ...draft.contract, to: v } })} />
            <Field label="Pricing" v={draft.contract.pricing} on={(v) => setDraft({ ...draft, contract: { ...draft.contract, pricing: v } })} />
            <Field label="Payment terms" v={draft.contract.terms} on={(v) => setDraft({ ...draft, contract: { ...draft.contract, terms: v } })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDlgOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-gradient-primary text-primary-foreground"><Save className="h-4 w-4 mr-1.5" /> {dlgMode === "add" ? "Create" : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input value={v} onChange={(e) => on(e.target.value)} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded border border-border/40 bg-surface/30 px-3 py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
