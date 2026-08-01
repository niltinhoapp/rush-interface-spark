import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ExternalLink, Mail, MessageCircle, Send, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { MetricCard } from "@/components/common/MetricCard";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { carts } from "@/data/carts";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Cart } from "@/types";

export const Route = createFileRoute("/carrinhos")({
  head: () => ({
    meta: [
      { title: "Carrinhos abandonados — Nuvem Rush" },
      {
        name: "description",
        content:
          "Acompanhe carrinhos abandonados, status de recuperação, valor potencial e mensagens enviadas.",
      },
      { property: "og:title", content: "Carrinhos abandonados — Nuvem Rush" },
      {
        property: "og:description",
        content: "Recuperação de carrinho por WhatsApp e e-mail com link de retorno.",
      },
    ],
  }),
  component: CartsPage,
});

const PAGE_SIZE = 6;

function CartsPage() {
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Cart | null>(null);

  const filters = useMemo(
    () => [
      { value: "todos", label: "Todos", count: carts.length },
      ...(["aguardando", "em_recuperacao", "recuperado", "perdido"] as const).map((s) => ({
        value: s,
        label: humanize(s),
        count: carts.filter((c) => c.status === s).length,
      })),
    ],
    [],
  );

  const rows = useMemo(
    () =>
      carts.filter(
        (c) =>
          (filter === "todos" || c.status === filter) &&
          c.customer.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [filter, query],
  );

  const pageCount = Math.ceil(rows.length / PAGE_SIZE);
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const potential = carts
    .filter((c) => c.status !== "recuperado")
    .reduce((sum, c) => sum + c.value, 0);
  const recovered = carts.reduce((sum, c) => sum + c.recoveredValue, 0);

  const columns: Column<Cart>[] = [
    {
      key: "customer",
      header: "Cliente",
      render: (c) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{c.customer}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.phone}</p>
        </div>
      ),
    },
    {
      key: "value",
      header: "Valor",
      className: "tabular-nums",
      render: (c) => formatCurrency(c.value),
    },
    {
      key: "items",
      header: "Itens",
      hideOnMobile: true,
      render: (c) => (
        <span className="text-muted-foreground">
          {c.items.reduce((s, i) => s + i.quantity, 0)} itens
        </span>
      ),
    },
    {
      key: "abandonedAt",
      header: "Abandonado em",
      hideOnMobile: true,
      render: (c) => <span className="text-muted-foreground">{formatDateTime(c.abandonedAt)}</span>,
    },
    {
      key: "channel",
      header: "Canal",
      hideOnMobile: true,
      render: (c) =>
        c.channel === "whatsapp" ? (
          <MessageCircle className="size-4 text-primary" />
        ) : (
          <Mail className="size-4 text-chart-3" />
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => <StatusBadge label={humanize(c.status)} tone={statusTones[c.status]} />,
    },
    {
      key: "actions",
      header: "Ações",
      className: "text-right",
      render: (c) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label="Reenviar mensagem"
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Mensagem reenviada", { description: c.customer });
            }}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Send className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Abrir link de recuperação"
            onClick={(e) => {
              e.stopPropagation();
              toast("Link de recuperação copiado", { description: c.recoveryLink });
            }}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppShell title="Carrinhos abandonados" subtitle="Recuperação automática por WhatsApp e e-mail">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Carrinhos abertos"
          value={String(carts.filter((c) => c.status !== "recuperado").length)}
          icon={ShoppingCart}
        />
        <MetricCard label="Valor potencial" value={formatCurrency(potential)} hint="a recuperar" />
        <MetricCard
          label="Recuperado"
          value={formatCurrency(recovered)}
          delta="+18,2%"
          trend="up"
        />
      </div>

      <SectionCard className="mt-4" bodyClassName="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <FilterTabs
            options={filters}
            value={filter}
            onChange={(v) => {
              setFilter(v);
              setPage(1);
            }}
          />
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar cliente…" />
        </div>
      </SectionCard>

      <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
        <DataTable
          columns={columns}
          rows={paged}
          onRowClick={setDetail}
          emptyTitle="Nenhum carrinho encontrado"
          emptyDescription="Assim que um cliente abandonar o carrinho, ele aparece aqui."
        />
        {rows.length > 0 ? (
          <Pagination page={page} pageCount={pageCount} total={rows.length} onPageChange={setPage} />
        ) : null}
      </div>

      <Modal
        open={Boolean(detail)}
        onOpenChange={(open) => !open && setDetail(null)}
        title={detail?.customer ?? ""}
        description="Detalhes do carrinho abandonado"
      >
        {detail ? (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Telefone", detail.phone],
                ["E-mail", detail.email],
                ["Valor", formatCurrency(detail.value)],
                ["Abandonado", formatDateTime(detail.abandonedAt)],
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
                {detail.items.map((i) => (
                  <li key={i.name} className="flex justify-between gap-3 py-2">
                    <span className="truncate">{i.name}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      ×{i.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Automação vinculada
              </p>
              <p className="mt-1 font-medium">{detail.automation}</p>
              <p className="mt-2 truncate text-xs text-muted-foreground">{detail.recoveryLink}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
