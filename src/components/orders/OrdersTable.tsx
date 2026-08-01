import { AppLink } from "@/components/common/AppLink";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { AsyncSection, SkeletonRows } from "@/components/common/AsyncSection";
import { EmptyState } from "@/components/common/EmptyState";
import { paymentLabels, shippingLabels } from "@/lib/labels";
import { formatCurrency, orNotProvided } from "@/lib/format";
import { maskSecret } from "@/lib/mask";
import type { Order } from "@/types";
import { OrdersSortableHeader } from "./OrdersSortableHeader";

export function OrdersTable({
  orders,
  loading,
  error,
  isEmpty,
  onRetry,
  sortBy,
  sortDir,
  onSort,
}: {
  orders: Order[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry: () => void;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort: (field: string) => void;
}) {
  return (
    <AsyncSection
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={isEmpty}
      emptyTitle="Nenhum pedido encontrado"
      emptyDescription="Ajuste a busca ou os filtros para ver outros pedidos."
      skeleton={<SkeletonRows rows={6} />}
    >
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left">
                <OrdersSortableHeader label="Pedido" field="number" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left">
                <OrdersSortableHeader label="Cliente" field="customer" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left">
                <OrdersSortableHeader label="Valor" field="value" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Pagamento
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Envio
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Rastreio
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Automação
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Última mensagem
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/50"
              >
                <td className="px-4 py-3.5 font-medium">{order.number}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{order.customer}</td>
                <td className="px-4 py-3.5 tabular-nums">{formatCurrency(order.value)}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge label={paymentLabels[order.payment]} tone={statusTones[order.payment]} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge label={shippingLabels[order.shipping]} tone={statusTones[order.shipping]} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {order.tracking ? maskSecret(order.tracking, 4) : "Não informado"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{order.automation}</td>
                <td className="px-4 py-3.5 text-muted-foreground">
                  {orNotProvided(order.lastMessage)}
                </td>
                <td className="px-4 py-3.5">
                  <AppLink
                    to={`/pedidos/${order.id}`}
                    className="inline-flex min-h-9 items-center rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Ver detalhes
                  </AppLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 ? null : (
        <div className="grid gap-3 p-4 md:hidden">
          {orders.map((order) => (
            <OrderMobileCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </AsyncSection>
  );
}

function OrderMobileCard({ order }: { order: Order }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{order.number}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{order.customer}</p>
        </div>
        <p className="shrink-0 font-display text-sm font-semibold tabular-nums">
          {formatCurrency(order.value)}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge label={paymentLabels[order.payment]} tone={statusTones[order.payment]} />
        <StatusBadge label={shippingLabels[order.shipping]} tone={statusTones[order.shipping]} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <dt className="uppercase tracking-wider">Rastreio</dt>
          <dd className="mt-0.5 font-mono">{order.tracking ? maskSecret(order.tracking, 4) : "Não informado"}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider">Automação</dt>
          <dd className="mt-0.5 truncate">{order.automation}</dd>
        </div>
      </dl>
      <AppLink
        to={`/pedidos/${order.id}`}
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Ver detalhes
      </AppLink>
    </article>
  );
}
