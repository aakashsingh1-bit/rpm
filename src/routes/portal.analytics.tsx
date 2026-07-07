import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ModuleGuard, ModuleHeader, Panel, StatCard } from "@/components/portal/Module";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/portal/analytics")({
  component: () => (
    <ModuleGuard module="analytics">
      <AnalyticsPage />
    </ModuleGuard>
  ),
});

const volume = Array.from({ length: 14 }).map((_, i) => ({
  d: `${i + 1}`,
  incidents: 220 + Math.round(Math.sin(i / 2) * 40 + Math.random() * 30),
  transports: 180 + Math.round(Math.cos(i / 2.5) * 30 + Math.random() * 25),
}));

const categories = [
  { name: "Cardiac", value: 28 },
  { name: "Trauma / RTA", value: 34 },
  { name: "Respiratory", value: 14 },
  { name: "Neurological", value: 9 },
  { name: "Other", value: 15 },
];

const zones = [
  { zone: "AD Central", avg: 5.2 },
  { zone: "Reem", avg: 6.4 },
  { zone: "Yas", avg: 7.8 },
  { zone: "Corniche", avg: 5.9 },
  { zone: "Khalifa City", avg: 8.4 },
  { zone: "Al Ain", avg: 9.6 },
];

const chartColors = ["oklch(0.68 0.22 25)", "oklch(0.70 0.16 155)", "oklch(0.68 0.14 230)", "oklch(0.78 0.16 75)", "oklch(0.65 0.20 300)"];

function AnalyticsPage() {
  return (
    <div>
      <ModuleHeader module="analytics" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Incidents · 14d" value="3,214" delta="+8%" tone="info" icon="Activity" index={0} />
        <StatCard label="Avg response" value="6:42" delta="-18s" tone="success" icon="Clock" index={1} />
        <StatCard label="Fleet utilization" value="68%" tone="warning" icon="Ambulance" index={2} />
        <StatCard label="Survival rate" value="82%" tone="success" delta="+3%" icon="HeartPulse" index={3} />
      </div>

      {/* AI insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5"
      >
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center shadow-glow shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-widest text-primary mb-1">
              AI operational recommendation
            </div>
            <div className="text-lg font-display font-semibold">
              Reposition 2 units from AD Central → Khalifa City between 14:00–18:00.
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Predicted +38% call volume in Khalifa City based on 8-week pattern. Expected
              response-time reduction: <span className="text-success font-mono">-1:42</span>.
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 mb-6">
        <Panel title="Volume · incidents vs transports" subtitle="Last 14 days">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volume}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 25)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.68 0.22 25)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.14 230)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.68 0.14 230)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 20)" />
                <XAxis dataKey="d" tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "oklch(0.20 0.013 20)", border: "1px solid oklch(0.3 0.01 20)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="incidents" stroke="oklch(0.68 0.22 25)" strokeWidth={2} fill="url(#a1)" />
                <Area type="monotone" dataKey="transports" stroke="oklch(0.68 0.14 230)" strokeWidth={2} fill="url(#a2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Incident categories" subtitle="Distribution %">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="oklch(0.16 0.012 20)"
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.20 0.013 20)", border: "1px solid oklch(0.3 0.01 20)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {categories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-sm" style={{ background: chartColors[i] }} />
                <span className="flex-1 text-muted-foreground truncate">{c.name}</span>
                <span className="font-mono">{c.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Response time by zone" subtitle="Median minutes">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zones}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 20)" />
              <XAxis dataKey="zone" tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.7 0 0)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "oklch(0.20 0.013 20)", border: "1px solid oklch(0.3 0.01 20)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="avg" fill="oklch(0.68 0.22 25)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
