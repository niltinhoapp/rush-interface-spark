import { Copy, Eye, MessageSquareText, RefreshCw } from "lucide-react";
import { AppLink } from "@/components/common/AppLink";
import { StatusBadge, statusTones, humanize } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonRows } from "@/components/common/AsyncSection";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { channelLabels } from "@/lib/labels";
import { maskEmail, maskPhone } from "@/lib/mask";
import type { Cart } from "@/types";

export function CartCardList({
  carts,
  loading,
  onViewDetails,
  onCopyLink,
  onReprocess,
  reprocessingId,
}: {
  carts: Cart[];
  loading: boolean;
  onViewDetails: (cart: Cart) => void;
  onCopyLink: (cart: Cart) => void;
  onReprocess: (cart: Cart) => void;
  reprocessingId: string | null;
}) {
  if (loading) return <SkeletonRows rows={4} />;
  if (carts.length === 0) {
    return (
      <EmptyState
        title="Nenhum carrinho encontrado"
        description="Assim que um cliente abandonar o carrinho, ele aparece aqui."
      />
    );
  }

  return (
    <div className="grid gap-3 p-3">
      {carts.map((c) => (
        <div key={c.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{c.customer}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{maskPhone(c.phone)}</p>
              <p className="truncate text-xs text-muted-foreground">{maskEmail(c.email)}</p>
            </div>
            <StatusBadge label={humanize(c.status)} tone={statusTones[c.status]} />
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-muted-foreground">Valor</dt>
              <dd className="font-medium tabular-nums">{formatCurrency(c.value)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Recuperado</dt>
              <dd className="font-medium tabular-nums">{formatCurrency(c.recoveredValue)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Abandono</dt>
              <dd>{formatDateTime(c.abandonedAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Canal</dt>
              <dd>{channelLabels[c.channel]}</dd>
            </div>
          </dl>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(c)}
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Eye className="size-4" aria-hidden /> Detalhes
            </button>
            <button
              type="button"
              onClick={() => onCopyLink(c)}
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Copy className="size-4" aria-hidden /> Copiar link
            </button>
            <AppLink
              to="/mensagens"
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageSquareText className="size-4" aria-hidden /> Mensagens
            </AppLink>
            <button
              type="button"
              disabled={reprocessingId === c.id}
              onClick={() => onReprocess(c)}
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <RefreshCw
                className={`size-4 ${reprocessingId === c.id ? "animate-spin" : ""}`}
                aria-hidden
              />
              Reprocessar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
