import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BadgeCheck,
  Contact2,
  Mail,
  MessageCircle,
  MessagesSquare,
  ShoppingBag,
  ShoppingCart,
  TriangleAlert,
  Wallet,
  Workflow,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/common/MetricCard";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { dashboardMetrics } from "@/data/mocks/dashboard";
import { formatCurrency, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral — Nuvem Rush" },
      {
        name: "description",
        content:
          "Acompanhe automações ativas, mensagens enviadas, carrinhos recuperados e receita recuperada da sua loja Nuvemshop.",
      },
      { property: "og:title", content: "Visão geral — Nuvem Rush" },
      {
        property: "og:description",
        content: "Painel de automações de WhatsApp e e-mail para lojistas Nuvemshop.",
      },
    ],
  }),
  component: Overview,
});

const m = dashboardMetrics;

function Overview() {
  return (
    <AppShell title="Visão geral" subtitle="Últimos 30 dias · atualizado há 4 minutos">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Automações ativas"
          value={String(m.activeAutomations)}
          hint="de 8 criadas"
          icon={Workflow}
        />
        <MetricCard
          label="Mensagens enviadas"
          value={formatNumber(m.messagesSent)}
          delta="+12,4%"
          trend="up"
          icon={MessagesSquare}
        />
        <MetricCard
          label="Mensagens entregues"
          value={formatNumber(m.messagesDelivered)}
          hint="96,4% de entrega"
          icon={BadgeCheck}
        />
        <MetricCard
          label="Mensagens com erro"
          value={formatNumber(m.messagesFailed)}
          delta="-8,1%"
          trend="down"
          icon={TriangleAlert}
        />
        <MetricCard
          label="Carrinhos recuperados"
          value={formatNumber(m.cartsRecovered)}
          delta="+18,2%"
          trend="up"
          icon={ShoppingCart}
        />
        <MetricCard
          label="Receita recuperada"
          value={formatCurrency(m.recoveredRevenue)}
          hint="no período"
          icon={Wallet}
        />
        <MetricCard
          label="Pedidos acompanhados"
          value={formatNumber(m.ordersTracked)}
          icon={ShoppingBag}
        />
        <MetricCard
          label="Contatos alcançados"
          value={formatNumber(m.contactsReached)}
          icon={Contact2}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Mensagens enviadas por período"
          description="WhatsApp e e-mail, últimos 30 dias"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.messagesSeries} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
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
                />
                <Tooltip
                  cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="whatsapp" name="WhatsApp" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="email" name="E-mail" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Receita recuperada" description="Carrinhos e pós-venda">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={m.revenueSeries} margin={{ left: -14, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
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
                  formatter={(v: number) => formatCurrency(v)}
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
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  fill="url(#fillReceita)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Resumo por canal" bodyClassName="space-y-3">
          {m.channels.map((c) => {
            const Icon = c.channel === "whatsapp" ? MessageCircle : Mail;
            return (
              <div key={c.channel} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                    <Icon className="size-4 shrink-0 text-primary" />
                    <span className="truncate">
                      {c.channel === "whatsapp" ? "WhatsApp" : "E-mail"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    leitura {c.readRate}%
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { k: "Enviadas", v: formatNumber(c.sent) },
                    { k: "Entregues", v: formatNumber(c.delivered) },
                    { k: "Erros", v: formatNumber(c.failed) },
                  ].map((s) => (
                    <div key={s.k} className="rounded-lg bg-secondary/60 py-2">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.k}
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold tabular-nums">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </SectionCard>

        <SectionCard
          title="Últimas execuções"
          description="Disparos mais recentes"
          bodyClassName="divide-y divide-border/70 p-0 px-5 sm:px-6"
        >
          {m.executions.map((e) => (
            <div key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{e.automation}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {e.customer} · {e.channel === "whatsapp" ? "WhatsApp" : "E-mail"} · {e.at}
                </p>
              </div>
              <StatusBadge label={humanize(e.status)} tone={statusTones[e.status]} />
            </div>
          ))}
        </SectionCard>

        <SectionCard
          title="Precisam de atenção"
          description="Automações com falha ou baixo desempenho"
          bodyClassName="space-y-3"
          actions={
            <Link
              to="/automacoes"
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver todas
            </Link>
          }
        >
          {m.attention.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border border-l-2 border-l-warning bg-card p-4"
            >
              <p className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="size-4 shrink-0 text-warning" />
                <span className="truncate">{a.name}</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {a.needsAttention}
              </p>
            </div>
          ))}
        </SectionCard>
      </div>
    </AppShell>
  );
}
