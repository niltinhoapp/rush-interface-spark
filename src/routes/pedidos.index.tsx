import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { orders } from "@/data/orders";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Order } from "@/types";

export const Route = createFileRoute("/pedidos/")({
  head: () => ({
    meta: [
      { title: "Pedidos — Nuvem Rush" },
      {
        name: "description",
        content:
          "Lista de pedidos com status de pagamento, envio, código de rastreio e automações vinculadas.",
      },
      { property: "og:title", content: "Pedidos — Nuvem Rush" },
      {
        property: "og:description",
        content: "Acompanhe pedidos e o rastreamento comunicado aos clientes.",
      },
    ],
  }),
  component: OrdersPage,
});

const PAGE_SIZE = 8;

function OrdersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => [
      { value: "todos", label: "Todos", count: orders.length },
      ...(["pago", "pendente", "estornado", "cancelado"] as const).map((s) => ({
        value: s,
        label: humanize(s),
        count: orders.filter((o) => o.payment === s).length,
      })),
      ...(["em_transito", "entregue"] as const).map((s) => ({
        value: s,
        label: humanize(s),
        count: orders.filter((o) => o.shipping === s).length,
      })),
    ],
    [],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "todos" || o.payment === filter || o.shipping === filter) &&
        (o.customer.toLowerCase().includes(q) || o.number.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  const pageCount = Math.ceil(rows.length / PAGE_SIZE);
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "Pedido",
      render: (o) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{o.number}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{o.customer}</p>
        </div>
      ),
    },
    {
      key: "value",
      header: "Valor",
      className: "tabular-nums",
      render: (o) => formatCurrency(o.value),
    },
    {
      key: "payment",
      header: "Pagamento",
      render: (o) => <StatusBadge label={humanize(o.payment)} tone={statusTones[o.payment]} />,
    },
    {
      key: "shipping",
      header: "Envio",
      render: (o) => <StatusBadge label={humanize(o.shipping)} tone={statusTones[o.shipping]} />,
    },
    {
      key: "tracking",
      header: "Rastreio",
      hideOnMobile: true,
      render: (o) => (
        <span className="text-xs text-muted-foreground">{o.tracking ?? "—"}</span>
      ),
    },
    {
      key: "automation",
      header: "Automação",
      hideOnMobile: true,
      render: (o) => <span className="text-muted-foreground">{o.automation}</span>,
    },
    {
      key: "lastMessage",
      header: "Última mensagem",
      hideOnMobile: true,
      render: (o) => <span className="text-muted-foreground">{o.lastMessage}</span>,
    },
    {
      key: "createdAt",
      header: "Criado em",
      hideOnMobile: true,
      render: (o) => <span className="text-muted-foreground">{formatDateTime(o.createdAt)}</span>,
    },
  ];

  return (
    <AppShell title="Pedidos" subtitle={`${orders.length} pedidos acompanhados no período`}>
      <SectionCard bodyClassName="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <FilterTabs
            options={filters}
            value={filter}
            onChange={(v) => {
              setFilter(v);
              setPage(1);
            }}
          />
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar pedido ou cliente…" />
        </div>
      </SectionCard>

      <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
        <DataTable
          columns={columns}
          rows={paged}
          onRowClick={(o) => navigate({ to: "/pedidos/$orderId", params: { orderId: o.id } })}
          emptyTitle="Nenhum pedido encontrado"
          emptyDescription="Ajuste os filtros para ver outros pedidos."
        />
        {rows.length > 0 ? (
          <Pagination page={page} pageCount={pageCount} total={rows.length} onPageChange={setPage} />
        ) : null}
      </div>
    </AppShell>
  );
}
