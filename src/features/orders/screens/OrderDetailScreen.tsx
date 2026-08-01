import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/hooks";
import { useNavigation } from "@/adapters/navigation";
import { AppLink } from "@/components/common/AppLink";
import { AsyncSection, SkeletonRows } from "@/components/common/AsyncSection";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { Timeline } from "@/components/common/Timeline";
import { formatDateTime } from "@/lib/format";
import { OrderCustomerCard } from "@/components/orders/OrderCustomerCard";
import { OrderItemsSection } from "@/components/orders/OrderItemsSection";
import { OrderStatusCard } from "@/components/orders/OrderStatusCard";
import { OrderMessagesSection } from "@/components/orders/OrderMessagesSection";

export function OrderDetailScreen({ orderId }: { orderId: string }) {
  const { data: order, loading, initialLoading, error, refetch } = useOrder(orderId);
  const navigation = useNavigation();

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigation.back()}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </button>

      <AsyncSection
        loading={initialLoading}
        error={error}
        onRetry={refetch}
        empty={!loading && !error && !order}
        emptyTitle="Pedido não encontrado"
        emptyDescription="Este pedido não existe ou foi removido."
        emptyAction={
          <AppLink
            to="/pedidos"
            className="inline-flex min-h-11 items-center rounded-xl border border-border px-3.5 py-2 text-sm transition-colors hover:text-foreground"
          >
            Voltar para pedidos
          </AppLink>
        }
        skeleton={<SkeletonRows rows={8} />}
      >
        {order ? (
          <div className="space-y-4">
            <SectionCard bodyClassName="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <h1 className="font-display text-lg font-semibold sm:text-xl">Pedido {order.number}</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {order.customer} · {formatDateTime(order.createdAt)}
                </p>
              </div>
            </SectionCard>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-4">
                <OrderItemsSection order={order} />
                <OrderMessagesSection orderNumber={order.number} />
                <SectionCard title="Linha do tempo" description="Eventos e mensagens do pedido">
                  {order.timeline.length > 0 ? (
                    <Timeline events={order.timeline} />
                  ) : (
                    <EmptyState title="Sem eventos registrados" description="Nenhum evento disponível para este pedido." />
                  )}
                </SectionCard>
              </div>

              <div className="space-y-4">
                <OrderCustomerCard order={order} />
                <OrderStatusCard order={order} />
              </div>
            </div>
          </div>
        ) : null}
      </AsyncSection>
    </div>
  );
}
