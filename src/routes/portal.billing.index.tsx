import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, TrendingUp, FileSpreadsheet, FileText, Wallet, Building2, BarChart3, Settings } from "lucide-react";
import { ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { BILLS, INVOICES, PAYMENTS, REVENUE_BREAKDOWN, FINANCE_ALERTS, money, billTotal } from "@/lib/finance-data";

export const Route = createFileRoute("/portal/billing/")({
  component: FinanceDashboard,
});

function FinanceDashboard() {
  const pendingInvoices = INVOICES.filter((i) => i.status === "Sent" || i.status === "Partial").length;
  const paidInvoices = INVOICES.filter((i) => i.status === "Paid").length;
  const outstanding = PAYMENTS.reduce((a, p) => a + p.outstanding, 0);
  const todayRevenue = 42860;
  const monthRevenue = 428000;

  return (
    <div>
      <ModuleHeader
        module="billing"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/portal/billing/billing" className="text-xs px-3 py-1.5 rounded-md border border-border bg-card hover:border-primary/50 transition-colors">Generate bill</Link>
            <Link to="/portal/billing/invoices" className="text-xs px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground shadow-glow">New invoice</Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label="Bills generated" value={BILLS.length} icon="FileSpreadsheet" index={0} />
        <StatCard label="Pending invoices" value={pendingInvoices} tone="warning" icon="Clock" index={1} />
        <StatCard label="Paid invoices" value={paidInvoices} tone="success" icon="CheckCircle" index={2} />
        <StatCard label="Outstanding" value={money(outstanding)} tone="danger" icon="AlertOctagon" index={3} />
        <StatCard label="Today's revenue" value={money(todayRevenue)} tone="info" icon="TrendingUp" index={4} />
        <StatCard label="Monthly revenue" value={money(monthRevenue)} tone="success" icon="TrendingUp" index={5} />
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="space-y-6">
          <Panel title="Revenue overview" subtitle="Breakdown by service, customer and status">
            <div className="grid md:grid-cols-3 gap-4">
              <BreakdownList title="By service" rows={REVENUE_BREAKDOWN.byService} />
              <BreakdownList title="By customer" rows={REVENUE_BREAKDOWN.byCustomer} />
              <BreakdownList title="By status" rows={REVENUE_BREAKDOWN.byStatus} />
            </div>
          </Panel>

          <Panel
            title="Latest bills"
            subtitle="Generated from closed CAD incidents"
            actions={<Link to="/portal/billing/billing" className="text-xs text-primary hover:underline flex items-center gap-1">Open billing <ArrowRight className="h-3 w-3" /></Link>}
          >
            <div className="space-y-2">
              {BILLS.slice(0, 4).map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-border/60 bg-surface/40 p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{b.patient} · {b.service}</div>
                    <div className="text-[11px] text-muted-foreground">{b.id} · {b.incident} · Unit {b.unit}</div>
                  </div>
                  <div className="text-xs font-mono tabular-nums text-primary">{money(billTotal(b))}</div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">{b.status}</span>
                </motion.div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Alerts" subtitle="Approvals, overdue & data issues" actions={<AlertTriangle className="h-4 w-4 text-warning" />}>
            <div className="space-y-2">
              {FINANCE_ALERTS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md border border-border/50 bg-surface/40 p-2.5">
                  <span className={`h-2 w-2 rounded-full mt-1.5 ${a.kind === "danger" ? "bg-destructive" : a.kind === "warning" ? "bg-warning" : "bg-info"}`} />
                  <div className="flex-1 text-xs">{a.text}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Trend" subtitle="30-day revenue" actions={<TrendingUp className="h-4 w-4 text-success" />}>
            <div className="flex items-end gap-1 h-24">
              {[42, 55, 48, 61, 58, 72, 66, 74, 71, 82, 78, 88, 84, 91, 96].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-primary/70" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mt-2 flex justify-between"><span>28 Jun</span><span>Today</span></div>
          </Panel>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <QuickLink to="/portal/billing/billing"      icon={FileSpreadsheet} title="Billing Management" desc="Generate service bills from closed incidents." />
        <QuickLink to="/portal/billing/invoices"     icon={FileText}        title="Invoice Management" desc="Issue, send and track customer invoices." />
        <QuickLink to="/portal/billing/payments"     icon={Wallet}          title="Payment Management" desc="Record and reconcile payments." />
        <QuickLink to="/portal/billing/customers"    icon={Building2}       title="Customers & Contracts" desc="Master data, pricing and terms." />
        
        <QuickLink to="/portal/billing/reports"      icon={BarChart3}       title="Financial Reports" desc="Revenue, collection & compliance." />
        <QuickLink to="/portal/billing/settings"     icon={Settings}        title="Finance Settings" desc="Charges, taxes and invoice format." />
      </div>
    </div>
  );
}

function BreakdownList({ title, rows }: { title: string; rows: { label: string; value: number; amount?: number }[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{title}</div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="truncate pr-2">{r.label}</span>
              <span className="font-mono tabular-nums text-muted-foreground">{r.value}%</span>
            </div>
            <div className="h-1.5 rounded bg-background overflow-hidden mt-0.5">
              <div className="h-full bg-gradient-primary" style={{ width: `${r.value}%` }} />
            </div>
            {r.amount != null && <div className="text-[10px] text-muted-foreground mt-0.5">{money(r.amount)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickLink({ to, icon: I, title, desc }: { to: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <Link to={to} className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-elegant transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-md bg-gradient-primary grid place-items-center shadow-glow"><I className="h-4 w-4 text-primary-foreground" /></div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="text-xs text-muted-foreground">{desc}</div>
      <div className="mt-3 text-[11px] text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">Open <ArrowRight className="h-3 w-3" /></div>
    </Link>
  );
}
