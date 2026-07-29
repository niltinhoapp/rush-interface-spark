import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { alerts, campaigns, channelSplit, kpis, revenueSeries } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral — Nuvem Rush" },
      {
        name: "description",
        content:
          "Painel de performance da Nuvem Rush: faturamento, ROAS, investimento em anúncios e campanhas em tempo real.",
      },
      { property: "og:title", content: "Visão geral — Nuvem Rush" },
      {
        property: "og:description",
        content: "Painel de performance com faturamento, ROAS e campanhas da sua loja.",
      },
    ],
  }),
  component: Overview,
});

const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function Overview() {
  return (
    <DashboardLayout
      title="Visão geral"
      subtitle="Últimos 28 dias · atualizado há 4 minutos"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:mt-8 lg:gap-6 xl:grid-cols-3">
        <section className="surface-panel rounded-2xl p-5 sm:p-6 xl:col-span-2">
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">Receita x Investimento</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Evolução diária no período</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full bg-chart-1" /> Receita
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full bg-chart-2" /> Investimento
              </span>
            </div>
          </div>

          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fillInvest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickFormatter={(v: number) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#fillReceita)"
                />
                <Area
                  type="monotone"
                  dataKey="investimento"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  fill="url(#fillInvest)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-panel rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Origem das vendas</h2>
          <p className="text-sm text-muted-foreground">Participação por canal</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                >
                  {channelSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {channelSplit.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: chartColors[i % chartColors.length] }}
                  />
                  {c.name}
                </span>
                <span className="font-medium">{c.value}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <section className="surface-panel rounded-2xl p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold">Campanhas em destaque</h2>
          <div className="mt-4 space-y-3">
            {campaigns.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.objective} · CTR {c.ctr}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-muted-foreground">{c.spend}</span>
                  <span className="font-display font-semibold text-rush">{c.roas.toFixed(1)}x</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-panel rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Alertas</h2>
          <div className="mt-4 space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-card p-4">
                <p
                  className={`text-sm font-medium ${
                    a.tone === "warning"
                      ? "text-warning"
                      : a.tone === "success"
                        ? "text-success"
                        : "text-foreground"
                  }`}
                >
                  {a.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
