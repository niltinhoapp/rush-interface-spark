import {
  BadgeCheck,
  Contact2,
  MessagesSquare,
  ShoppingBag,
  ShoppingCart,
  TriangleAlert,
  Wallet,
  Workflow,
} from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { SkeletonCards } from "@/components/common/AsyncSection";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { DashboardMetrics } from "@/types";

export function MetricsGrid({
  metrics,
  loading,
}: {
  metrics: DashboardMetrics | null;
  loading: boolean;
}) {
  if (loading || !metrics) return <SkeletonCards count={8} />;

  const deliveryRate =
    metrics.messagesSent > 0
      ? formatPercent((metrics.messagesDelivered / metrics.messagesSent) * 100, 1)
      : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Automações ativas" value={String(metrics.activeAutomations)} icon={Workflow} />
      <MetricCard
        label="Mensagens enviadas"
        value={formatNumber(metrics.messagesSent)}
        icon={MessagesSquare}
      />
      <MetricCard
        label="Mensagens entregues"
        value={formatNumber(metrics.messagesDelivered)}
        hint={deliveryRate ? `${deliveryRate} de entrega` : undefined}
        icon={BadgeCheck}
      />
      <MetricCard
        label="Mensagens com falha"
        value={formatNumber(metrics.messagesFailed)}
        icon={TriangleAlert}
      />
      <MetricCard
        label="Carrinhos recuperados"
        value={formatNumber(metrics.cartsRecovered)}
        icon={ShoppingCart}
      />
      <MetricCard
        label="Receita recuperada"
        value={formatCurrency(metrics.recoveredRevenue)}
        hint="no período"
        icon={Wallet}
      />
      <MetricCard
        label="Pedidos acompanhados"
        value={formatNumber(metrics.ordersTracked)}
        icon={ShoppingBag}
      />
      <MetricCard
        label="Contatos alcançados"
        value={formatNumber(metrics.contactsReached)}
        icon={Contact2}
      />
    </div>
  );
}
