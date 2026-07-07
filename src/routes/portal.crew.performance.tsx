import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel, StatCard } from "@/components/portal/Module";
import { CREW } from "@/lib/crew-data";
import { Bar, BarChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/portal/crew/performance")({
  component: PerformancePage,
});

function PerformancePage() {
  const sorted = [...CREW].sort((a, b) => b.perf - a.perf);
  const chartData = sorted.slice(0, 8).map((c) => ({ name: c.name.split(" ")[0], perf: c.perf, onTime: c.onTime }));
  const teamAvg = Math.round(CREW.reduce((s, c) => s + c.perf, 0) / CREW.length);
  const attAvg = Math.round(CREW.reduce((s, c) => s + c.attendance, 0) / CREW.length);
  const runsTotal = CREW.reduce((s, c) => s + c.runsThisMonth, 0);
  const patientsTotal = CREW.reduce((s, c) => s + c.patientsThisMonth, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Team performance" value={`${teamAvg}%`} tone="info" icon="TrendingUp" index={0} />
        <StatCard label="Team attendance" value={`${attAvg}%`} tone="success" icon="Percent" index={1} />
        <StatCard label="Runs this month" value={runsTotal} icon="Ambulance" index={2} />
        <StatCard label="Patients served" value={patientsTotal} tone="warning" icon="HeartPulse" index={3} />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <Panel title="Performance vs on-time" subtitle="Top 8 by composite score">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.01 20)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <RTooltip contentStyle={{ background: "oklch(0.20 0.013 20)", border: "1px solid oklch(0.3 0.01 20)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="perf" fill="oklch(0.6 0.2 250)" radius={[4, 4, 0, 0]} name="Performance %" />
                <Bar dataKey="onTime" fill="oklch(0.68 0.22 25)" radius={[4, 4, 0, 0]} name="On-time %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Leaderboard" subtitle="Highest performers this month">
          <div className="space-y-2">
            {sorted.slice(0, 6).map((c, i) => (
              <Link
                key={c.id}
                to="/portal/crew/$id"
                params={{ id: c.id }}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface/40 p-3 hover:border-primary/60 transition-colors group"
              >
                <div className={`h-7 w-7 rounded-full grid place-items-center text-[11px] font-semibold ${
                  i === 0 ? "bg-warning text-warning-foreground"
                    : i === 1 ? "bg-muted text-foreground"
                    : i === 2 ? "bg-info/40 text-foreground"
                    : "bg-surface border border-border text-muted-foreground"
                }`}>
                  {i === 0 ? <Trophy className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.role} · {c.runsThisMonth} runs</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-display font-semibold tabular-nums">{c.perf}%</div>
                  <div className="text-[9px] text-muted-foreground uppercase tracking-widest">perf</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Full KPI table">
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Crew</th>
                <th className="text-left px-3 py-2 hidden md:table-cell">Role</th>
                <th className="text-right px-3 py-2">Runs</th>
                <th className="text-right px-3 py-2 hidden md:table-cell">Patients</th>
                <th className="text-right px-3 py-2">On-time</th>
                <th className="text-right px-3 py-2 hidden md:table-cell">Avg resp.</th>
                <th className="text-right px-3 py-2">Perf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sorted.map((c) => (
                <tr key={c.id} className="hover:bg-accent/20">
                  <td className="px-3 py-2 text-sm font-medium">
                    <Link to="/portal/crew/$id" params={{ id: c.id }} className="hover:text-primary transition-colors">{c.name}</Link>
                  </td>
                  <td className="px-3 py-2 text-xs hidden md:table-cell">{c.role}</td>
                  <td className="px-3 py-2 text-xs font-mono text-right">{c.runsThisMonth}</td>
                  <td className="px-3 py-2 text-xs font-mono text-right hidden md:table-cell">{c.patientsThisMonth}</td>
                  <td className="px-3 py-2 text-xs font-mono text-right">{c.onTime}%</td>
                  <td className="px-3 py-2 text-xs font-mono text-right hidden md:table-cell">{c.avgResponse}</td>
                  <td className="px-3 py-2 text-sm font-mono text-right">{c.perf}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
