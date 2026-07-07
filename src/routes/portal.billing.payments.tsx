import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, History } from "lucide-react";
import { ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENTS, money, type PaymentRow, type PaymentStatus } from "@/lib/finance-data";

export const Route = createFileRoute("/portal/billing/payments")({
  component: PaymentManagement,
});

const c: Record<PaymentStatus, string> = {
  Paid: "text-success border-success/40 bg-success/10",
  Partial: "text-warning border-warning/40 bg-warning/10",
  Pending: "text-info border-info/40 bg-info/10",
  Overdue: "text-destructive border-destructive/40 bg-destructive/10",
};

function PaymentManagement() {
  const [rows, setRows] = useState<PaymentRow[]>(PAYMENTS);
  const [amt, setAmt] = useState<Record<string, string>>({});

  const totals = {
    received: rows.reduce((a, r) => a + r.amount, 0),
    outstanding: rows.reduce((a, r) => a + r.outstanding, 0),
    overdue: rows.filter((r) => r.status === "Overdue").reduce((a, r) => a + r.outstanding, 0),
  };

  function record(id: string) {
    const value = Number(amt[id] || 0);
    if (!value) return toast.error("Enter payment amount");
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const outstanding = Math.max(0, r.outstanding - value);
      const status: PaymentStatus = outstanding === 0 ? "Paid" : "Partial";
      return { ...r, amount: r.amount + value, outstanding, status, date: new Date().toLocaleDateString("en-AE", { day: "2-digit", month: "short" }) };
    }));
    setAmt((a) => ({ ...a, [id]: "" }));
    toast.success(`Recorded ${money(value)}`);
  }

  function setStatus(id: string, s: PaymentStatus) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: s } : r)));
    toast(`Status → ${s}`);
  }

  return (
    <div>
      <ModuleHeader module="billing" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Payments received" value={money(totals.received)} tone="success" icon="Wallet" index={0} />
        <StatCard label="Outstanding" value={money(totals.outstanding)} tone="warning" icon="Clock" index={1} />
        <StatCard label="Overdue" value={money(totals.overdue)} tone="danger" icon="AlertOctagon" index={2} />
        <StatCard label="Register entries" value={rows.length} icon="ListChecks" index={3} />
      </div>

      <Panel title="Payment register" subtitle="Track payments against invoices">
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="px-5 py-2 font-medium">Invoice</th>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Method</th>
                <th className="px-3 py-2 font-medium text-right">Received</th>
                <th className="px-3 py-2 font-medium text-right">Outstanding</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-accent/20">
                  <td className="px-5 py-3 font-mono text-xs">{r.invoice}</td>
                  <td className="px-3 py-3">{r.customer}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{r.date}</td>
                  <td className="px-3 py-3 text-xs">{r.method}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{money(r.amount)}</td>
                  <td className="px-3 py-3 text-right font-mono tabular-nums">{money(r.outstanding)}</td>
                  <td className="px-3 py-3"><span className={`text-xs px-2 py-0.5 rounded-full border ${c[r.status]}`}>{r.status}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Input value={amt[r.id] || ""} onChange={(e) => setAmt({ ...amt, [r.id]: e.target.value })} placeholder="AED" className="h-7 w-20 text-xs" disabled={r.outstanding === 0} />
                      <Button size="sm" variant="outline" className="h-7" onClick={() => record(r.id)} disabled={r.outstanding === 0}><Plus className="h-3 w-3 mr-1" />Record</Button>
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => setStatus(r.id, r.status === "Pending" ? "Overdue" : "Pending")}><History className="h-3 w-3" /></Button>
                    </div>
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
