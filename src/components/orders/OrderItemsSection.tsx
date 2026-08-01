import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { formatCurrency } from "@/lib/format";
import type { Order } from "@/types";

export function OrderItemsSection({ order }: { order: Order }) {
  const items = order.items;
  const subtotal = items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? null;
  const total = subtotal !== null ? subtotal + (order.shippingCost ?? 0) : order.value;

  return (
    <SectionCard title="Itens do pedido" description="Produtos comprados neste pedido">
      {!items || items.length === 0 ? (
        <EmptyState title="Itens não informados" description="O backend não enviou os itens deste pedido." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Produto
                </th>
                <th className="px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  SKU
                </th>
                <th className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Qtd.
                </th>
                <th className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Preço
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/60 last:border-0">
                  <td className="px-2 py-2.5">{item.name}</td>
                  <td className="px-2 py-2.5 text-muted-foreground">{item.sku ?? "Não informado"}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{item.quantity}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{formatCurrency(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">{subtotal !== null ? formatCurrency(subtotal) : "Não informado"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Frete</span>
          <span className="tabular-nums">
            {typeof order.shippingCost === "number" ? formatCurrency(order.shippingCost) : "Não informado"}
          </span>
        </div>
        <div className="flex items-center justify-between font-display text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>
    </SectionCard>
  );
}
