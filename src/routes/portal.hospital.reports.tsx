import { createFileRoute } from "@tanstack/react-router";
import { ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { REPORTS } from "@/lib/hospital-data";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/hospital/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div>
      <ModuleHeader
        module="hospital"
        actions={<Button className="bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Daily report exported")}><Download className="h-4 w-4 mr-1" /> Export daily</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {REPORTS.daily.map((d, i) => (
          <StatCard key={d.label} label={d.label} value={d.value} delta={d.delta} icon={i === 0 ? "Ambulance" : i === 1 ? "ClipboardCheck" : i === 2 ? "ArrowLeftRight" : "Clock"} tone={i === 3 ? "success" : "info"} index={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Emergency case summary" subtitle="Case mix (last 24h)">
          <div className="space-y-3">
            {REPORTS.cases.map((c) => (
              <div key={c.type}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{c.type}</span>
                  <span className="font-mono text-muted-foreground">{c.count} cases · {c.share}%</span>
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${c.share * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Daily activity report" subtitle="Operational summary">
          <table className="w-full text-sm">
            <tbody>
              <Row k="Shift" v="Day · 07:00–19:00" />
              <Row k="Total incoming" v="62 patients" />
              <Row k="Handovers completed" v="47" />
              <Row k="Avg handover time" v="4:12 min" />
              <Row k="Transfer requests processed" v="12" />
              <Row k="Diversions" v="3 (Mafraq · capacity)" />
              <Row k="Alerts sent" v="18" />
              <Row k="Response SLA compliance" v="96.4%" />
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr className="border-b border-border/60"><td className="py-2 text-xs text-muted-foreground">{k}</td><td className="py-2 text-xs text-right">{v}</td></tr>
  );
}
