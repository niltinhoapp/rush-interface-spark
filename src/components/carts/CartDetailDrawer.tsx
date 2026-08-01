import { DetailDrawer } from "@/components/common/DetailDrawer";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { maskEmail, maskPhone } from "@/lib/mask";
import type { Cart } from "@/types";

export function CartDetailDrawer({
  cart,
  onOpenChange,
}: {
  cart: Cart | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DetailDrawer
      open={Boolean(cart)}
      onOpenChange={onOpenChange}
      title={cart?.customer ?? ""}
      description="Detalhes do carrinho abandonado"
    >
      {cart ? (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Telefone", maskPhone(cart.phone)],
              ["E-mail", maskEmail(cart.email)],
              ["Valor", formatCurrency(cart.value)],
              ["Abandonado", formatDateTime(cart.abandonedAt)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-card p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="mt-1 truncate font-medium">{v}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Itens</p>
            <ul className="mt-2 divide-y divide-border/70">
              {cart.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-3 py-2">
                  <span className="truncate">{item.name}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">×{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Automação vinculada</p>
            <p className="mt-1 font-medium">{cart.automation}</p>
            <p className="mt-2 truncate text-xs text-muted-foreground">{cart.recoveryLink}</p>
          </div>
        </div>
      ) : null}
    </DetailDrawer>
  );
}
