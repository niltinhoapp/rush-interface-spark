import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Copy, Send, Truck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { Timeline } from "@/components/common/Timeline";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { orders } from "@/data/mocks/orders";
import { formatCurrency, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/pedidos/$orderId")({
  head: () => ({
    meta: [
      { title: "Detalhe do pedido — Nuvem Rush" },
      {
        name: "description",
        content:
          "Linha do tempo do pedido com eventos de pagamento, envio, rastreio e mensagens enviadas ao cliente.",
      },
      { property: "og:title", content: "Detalhe do pedido — Nuvem Rush" },
      {
        property: "og:description",
        content: "Histórico completo de comunicação e rastreamento do pedido.",
      },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { orderId } = Route.useParams();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <AppShell title="Pedido não encontrado" subtitle="Verifique o identificador">
        <div className="surface-panel rounded-2xl">
          <EmptyState
            title="Pedido não encontrado"
            description="Este pedido não existe nos dados de demonstração."
            action={
              <Link
                to="/pedidos"
                className="rounded-xl border border-border px-3.5 py-2 text-sm transition-colors hover:text-foreground"
              >
                Voltar para pedidos
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Pedido ${order.number}`}
      subtitle={`${order.customer} · ${formatDateTime(order.createdAt)}`}
      actions={
        <button
          type="button"
          onClick={() => toast.success("Mensagem reenviada", { description: order.customer })}
          className="inline-flex items-center gap-2 rounded-xl bg-rush px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Send className="size-4" />
          <span className="hidden sm:inline">Reenviar mensagem</span>
        </button>
      }
    >
      <Link
        to="/pedidos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para pedidos
      </Link>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title="Linha do tempo" description="Eventos e mensagens do pedido">
          <Timeline events={order.timeline} />
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Resumo" bodyClassName="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Valor</span>
              <span className="font-display text-lg font-semibold tabular-nums">
                {formatCurrency(order.value)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Pagamento</span>
              <StatusBadge label={humanize(order.payment)} tone={statusTones[order.payment]} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Envio</span>
              <StatusBadge label={humanize(order.shipping)} tone={statusTones[order.shipping]} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Automação</span>
              <span className="truncate text-right font-medium">{order.automation}</span>
            </div>
          </SectionCard>

          <SectionCard title="Rastreamento">
            {order.tracking ? (
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Truck className="size-3.5" />
                  Código de rastreio
                </p>
                <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <p className="truncate font-mono text-sm">{order.tracking}</p>
                  <button
                    type="button"
                    aria-label="Copiar código"
                    onClick={() => toast("Código copiado", { description: order.tracking ?? "" })}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum código de rastreio gerado para este pedido.
              </p>
            )}
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
