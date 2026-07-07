import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, FileSpreadsheet, Printer, FileText } from "lucide-react";
import { ModuleHeader, Panel } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { INVOICES, PAYMENTS, CUSTOMERS, REVENUE_BREAKDOWN, money } from "@/lib/finance-data";

export const Route = createFileRoute("/portal/billing/reports")({
  component: FinancialReports,
});

const REPORTS = [
  { id: "REV",  name: "Revenue summary",         desc: "Consolidated MTD/YTD revenue by service and customer" },
  { id: "BIL",  name: "Billing summary",         desc: "Bills generated, approved, invoiced and cancelled"    },
  { id: "OUT",  name: "Outstanding payments",    desc: "Aging analysis 0-30, 31-60, 61-90, 90+ days"          },
  { id: "INV",  name: "Invoice status report",   desc: "Invoices by status, method and payer"                 },
  { id: "CUS",  name: "Customer revenue report", desc: "Revenue per customer with YoY variance"               },
  { id: "CON",  name: "Contract revenue report", desc: "Revenue by contract vs contracted volume"             },
  { id: "COL",  name: "Daily collection report", desc: "Payments received by day, method and cashier"         },
  { id: "MFS",  name: "Monthly financial summary", desc: "P&L view: revenue, VAT, discounts, write-offs"      },
];

function FinancialReports() {
  const totalRevenue = INVOICES.reduce((a, i) => a + i.total, 0);
  const collected = PAYMENTS.reduce((a, p) => a + p.amount, 0);
  const outstanding = PAYMENTS.reduce((a, p) => a + p.outstanding, 0);

  return (
    <div>
      <ModuleHeader module="billing" actions={<Button size="sm" variant="outline" onClick={() => toast("Report pack generated")}><FileSpreadsheet className="h-3.5 w-3.5 mr-1" /> Export all</Button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Kpi label="Invoiced" v={money(totalRevenue)} />
        <Kpi label="Collected" v={money(collected)} tone="success" />
        <Kpi label="Outstanding" v={money(outstanding)} tone="warning" />
        <Kpi label="Customers" v={CUSTOMERS.length.toString()} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Panel title="Revenue by service" subtitle="MTD share">
          <BarList rows={REVENUE_BREAKDOWN.byService} />
        </Panel>
        <Panel title="Revenue by customer" subtitle="Top payers">
          <BarList rows={REVENUE_BREAKDOWN.byCustomer} />
        </Panel>
      </div>

      <Panel title="Report catalogue" subtitle="Generate & export detailed financial reports">
        <div className="grid md:grid-cols-2 gap-3">
          {REPORTS.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-surface/40 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{r.desc}</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">{r.id}</span>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Button size="sm" variant="outline" onClick={() => toast.success(`${r.name} · PDF exported`)}><Download className="h-3 w-3 mr-1" />PDF</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success(`${r.name} · Excel exported`)}><FileSpreadsheet className="h-3 w-3 mr-1" />Excel</Button>
                <Button size="sm" variant="ghost" onClick={() => toast(`${r.name} · sent to printer`)}><Printer className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => toast(`Preview ${r.name}`)}><FileText className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Kpi({ label, v, tone }: { label: string; v: string; tone?: "success" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-2xl font-display font-semibold mt-1 ${c}`}>{v}</div>
    </div>
  );
}

function BarList({ rows }: { rows: { label: string; value: number }[] }) {
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-xs">
            <span>{r.label}</span>
            <span className="font-mono tabular-nums text-muted-foreground">{r.value}%</span>
          </div>
          <div className="h-1.5 rounded bg-background overflow-hidden mt-0.5"><div className="h-full bg-gradient-primary" style={{ width: `${r.value}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
