import { toast } from "sonner";
import { Copy, Truck } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { paymentLabels, shippingLabels } from "@/lib/labels";
import { formatDateTime, orNotProvided } from "@/lib/format";
import type { Order } from "@/types";

export function OrderStatusCard({ order }: { order: Order }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Status" bodyClassName="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Pagamento</span>
          <StatusBadge label={paymentLabels[order.payment]} tone={statusTones[order.payment]} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Envio</span>
          <StatusBadge label={shippingLabels[order.shipping]} tone={statusTones[order.shipping]} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Entregue em</span>
          <span className="font-medium">
            {order.deliveredAt ? formatDateTime(order.deliveredAt) : orNotProvided(null)}
          </span>
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
                aria-label="Copiar código de rastreio"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(order.tracking ?? "");
                  }
                  toast("Código copiado", { description: order.tracking ?? "" });
                }}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum código de rastreio informado para este pedido.</p>
        )}
      </SectionCard>
    </div>
  );
}
