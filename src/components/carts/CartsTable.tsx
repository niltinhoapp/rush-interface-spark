import { Copy, Eye, MessageSquareText, RefreshCw } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge, statusTones, humanize } from "@/components/common/StatusBadge";
import { AppLink } from "@/components/common/AppLink";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { channelLabels } from "@/lib/labels";
import { maskEmail, maskPhone } from "@/lib/mask";
import type { Cart } from "@/types";

function summarizeItems(cart: Cart): string {
  const totalUnits = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const firstName = cart.items[0]?.name ?? "—";
  const extra = cart.items.length > 1 ? ` +${cart.items.length - 1}` : "";
  return `${firstName}${extra} · ${totalUnits} itens`;
}

export function CartsTable({
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
  const columns: Column<Cart>[] = [
    {
      key: "customer",
      header: "Cliente",
      render: (c) => <span className="truncate font-medium">{c.customer}</span>,
    },
    {
      key: "contact",
      header: "Contato",
      hideOnMobile: true,
      render: (c) => (
        <div className="min-w-0 text-xs text-muted-foreground">
          <p className="truncate">{maskPhone(c.phone)}</p>
          <p className="truncate">{maskEmail(c.email)}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Produtos",
      hideOnMobile: true,
      render: (c) => <span className="truncate text-muted-foreground">{summarizeItems(c)}</span>,
    },
    {
      key: "value",
      header: "Valor",
      className: "tabular-nums",
      render: (c) => formatCurrency(c.value),
    },
    {
      key: "abandonedAt",
      header: "Abandono",
      hideOnMobile: true,
      render: (c) => <span className="text-muted-foreground">{formatDateTime(c.abandonedAt)}</span>,
    },
    {
      key: "automation",
      header: "Automação",
      hideOnMobile: true,
      render: (c) => <span className="truncate text-muted-foreground">{c.automation}</span>,
    },
    {
      key: "channel",
      header: "Canal",
      hideOnMobile: true,
      render: (c) => <span className="text-muted-foreground">{channelLabels[c.channel]}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <StatusBadge label={humanize(c.status)} tone={statusTones[c.status]} />,
    },
    {
      key: "recovered",
      header: "Recuperado",
      className: "tabular-nums",
      hideOnMobile: true,
      render: (c) => formatCurrency(c.recoveredValue),
    },
    {
      key: "actions",
      header: "Ações",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label={`Ver detalhes de ${c.customer}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(c);
            }}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Eye className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Copiar link de recuperação de ${c.customer}`}
            onClick={(e) => {
              e.stopPropagation();
              onCopyLink(c);
            }}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Copy className="size-4" aria-hidden />
          </button>
          <AppLink
            to="/mensagens"
            aria-label={`Ver mensagens de ${c.customer}`}
            onClick={(e) => e.stopPropagation()}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <MessageSquareText className="size-4" aria-hidden />
          </AppLink>
          <button
            type="button"
            aria-label={`Reprocessar carrinho de ${c.customer}`}
            disabled={reprocessingId === c.id}
            onClick={(e) => {
              e.stopPropagation();
              onReprocess(c);
            }}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
          >
            <RefreshCw
              className={`size-4 ${reprocessingId === c.id ? "animate-spin" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={carts}
      loading={loading}
      onRowClick={onViewDetails}
      emptyTitle="Nenhum carrinho encontrado"
      emptyDescription="Assim que um cliente abandonar o carrinho, ele aparece aqui."
    />
  );
}
