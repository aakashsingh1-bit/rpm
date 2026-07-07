import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Printer, Mail, CheckCircle, X, Plus, Save } from "lucide-react";
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
import { INVOICES, CUSTOMERS, money, type Invoice, type InvoiceStatus } from "@/lib/finance-data";

export const Route = createFileRoute("/portal/billing/invoices")({
  component: InvoiceManagement,
});

const statusColor: Record<InvoiceStatus, string> = {
  Paid: "text-success border-success/40 bg-success/10",
  Sent: "text-info border-info/40 bg-info/10",
  Partial: "text-warning border-warning/40 bg-warning/10",
  Overdue: "text-destructive border-destructive/40 bg-destructive/10",
  Draft: "text-muted-foreground border-border bg-surface/40",
  Cancelled: "text-muted-foreground border-border bg-surface/40 line-through",
};

function InvoiceManagement() {
  const [invoices, setInvoices] = useState(INVOICES);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string>(INVOICES[0].id);
  const inv = useMemo(() => invoices.find((i) => i.id === sel) ?? invoices[0], [invoices, sel]);

  const [newOpen, setNewOpen] = useState(false);
  const [nCustomer, setNCustomer] = useState(CUSTOMERS[0].name);
  const [nAmount, setNAmount] = useState("1000");
  const [nDue, setNDue] = useState("Net 30");

  const filtered = invoices.filter((i) =>
    (i.id + i.customer + i.incident).toLowerCase().includes(q.toLowerCase())
  );

  function markPaid() {
    setInvoices((p) => p.map((i) => (i.id === inv.id ? { ...i, status: "Paid", paid: i.total } : i)));
    toast.success(`${inv.id} marked as paid`);
  }
  function cancel() {
    setInvoices((p) => p.map((i) => (i.id === inv.id ? { ...i, status: "Cancelled" } : i)));
    toast(`${inv.id} cancelled`);
  }
  function emailInv() { toast.success(`Emailed ${inv.id} to ${inv.customer}`); }
  function pdf()      { toast.success(`Generated PDF for ${inv.id}`); }
  function print()    { toast(`Sending ${inv.id} to printer`); }

  function createInvoice() {
    const amt = Number(nAmount);
    if (!nCustomer || !amt || amt <= 0) return toast.error("Customer and positive amount required");
    const subtotal = amt;
    const vat = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + vat;
    const id = `INV-${9000 + invoices.length + 1}`;
    const today = new Date().toISOString().slice(0, 10);
    const next: Invoice = {
      id, customer: nCustomer, incident: "—", bill: "—",
      date: today, due: nDue, subtotal, vat, discount: 0, total, paid: 0,
      status: "Draft", method: "Bank",
    };
    setInvoices((l) => [next, ...l]);
    setSel(id);
    setNewOpen(false);
    toast.success(`${id} created`, { description: `${nCustomer} · ${money(total)}` });
  }

  return (
    <div>
      <ModuleHeader
        module="billing"
        actions={
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={() => setNewOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> New invoice
          </Button>
        }
      />

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New invoice</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Customer</Label>
              <Select value={nCustomer} onValueChange={setNCustomer}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CUSTOMERS.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Amount (AED, before VAT)</Label>
              <Input type="number" value={nAmount} onChange={(e) => setNAmount(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Payment terms</Label>
              <Input value={nDue} onChange={(e) => setNDue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={createInvoice} className="bg-gradient-primary text-primary-foreground"><Save className="h-4 w-4 mr-1.5" /> Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Panel title="Invoices" subtitle={`${filtered.length} of ${invoices.length}`} actions={<Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoice, customer…" className="h-8 w-56 text-xs" />}>
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="px-5 py-2 font-medium">Invoice</th>
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium text-right">Amount</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} onClick={() => setSel(v.id)} className={`border-b border-border/50 cursor-pointer ${v.id === sel ? "bg-primary/5" : "hover:bg-accent/20"}`}>
                    <td className="px-5 py-3 font-mono text-xs">{v.id}</td>
                    <td className="px-3 py-3">{v.customer}</td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{v.date}</td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums">{money(v.total)}</td>
                    <td className="px-3 py-3"><span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[v.status]}`}>{v.status}</span></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{v.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={`Invoice ${inv.id}`} subtitle={`${inv.customer} · due ${inv.due}`}>
          <InvoiceDetail inv={inv} />
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={pdf}><Download className="h-3.5 w-3.5 mr-1" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={print}><Printer className="h-3.5 w-3.5 mr-1" /> Print</Button>
            <Button variant="outline" size="sm" onClick={emailInv}><Mail className="h-3.5 w-3.5 mr-1" /> Email</Button>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={markPaid} disabled={inv.status === "Paid" || inv.status === "Cancelled"}>
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Mark paid
            </Button>
            <Button variant="outline" size="sm" onClick={cancel} disabled={inv.status === "Cancelled"}>
              <X className="h-3.5 w-3.5 mr-1" /> Cancel
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function InvoiceDetail({ inv }: { inv: Invoice }) {
  const outstanding = inv.total - inv.paid;
  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-lg border border-border p-3 bg-surface/30">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Customer</div>
        <div className="text-sm font-medium">{inv.customer}</div>
        <div className="text-muted-foreground text-[11px]">Incident {inv.incident} · Bill {inv.bill}</div>
      </div>
      <div className="rounded-lg border border-border">
        <div className="px-3 py-2 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground">Billing breakdown</div>
        <div className="divide-y divide-border/50">
          <Line k="Subtotal" v={money(inv.subtotal)} />
          <Line k="VAT (5%)" v={money(inv.vat)} />
          {inv.discount > 0 && <Line k="Discount" v={`- ${money(inv.discount)}`} />}
          <Line k="Total" v={money(inv.total)} bold />
          <Line k="Paid" v={money(inv.paid)} />
          <Line k="Outstanding" v={money(outstanding)} bold tone={outstanding > 0 ? "warning" : "success"} />
        </div>
      </div>
    </div>
  );
}

function Line({ k, v, bold, tone }: { k: string; v: React.ReactNode; bold?: boolean; tone?: "warning" | "success" }) {
  const c = tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "";
  return (
    <div className={`flex items-center justify-between px-3 py-2 ${bold ? "bg-surface/40 font-semibold" : ""}`}>
      <span className="text-muted-foreground">{k}</span>
      <span className={`font-mono tabular-nums ${c}`}>{v}</span>
    </div>
  );
}
