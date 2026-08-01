import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, MessageCircle, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { messages } from "@/data/messages";
import { formatDateTime } from "@/lib/format";
import type { Message } from "@/types";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens — Nuvem Rush" },
      {
        name: "description",
        content:
          "Histórico de mensagens de WhatsApp e e-mail com status de entrega, leitura e motivo de erro.",
      },
      { property: "og:title", content: "Mensagens — Nuvem Rush" },
      {
        property: "og:description",
        content: "Auditoria completa dos disparos das suas automações.",
      },
    ],
  }),
  component: MessagesPage,
});

const PAGE_SIZE = 8;

function MessagesPage() {
  const [filter, setFilter] = useState("todas");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Message | null>(null);

  const filters = useMemo(
    () => [
      { value: "todas", label: "Todas", count: messages.length },
      ...(["agendada", "enviada", "entregue", "lida", "falhou", "cancelada"] as const).map((s) => ({
        value: s,
        label: humanize(s),
        count: messages.filter((m) => m.status === s).length,
      })),
      { value: "whatsapp", label: "WhatsApp" },
      { value: "email", label: "E-mail" },
    ],
    [],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter(
      (m) =>
        (filter === "todas" || m.status === filter || m.channel === filter) &&
        (m.customer.toLowerCase().includes(q) || m.automation.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  const pageCount = Math.ceil(rows.length / PAGE_SIZE);
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Message>[] = [
    {
      key: "customer",
      header: "Cliente",
      render: (m) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{m.customer}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {m.orderNumber ?? "sem pedido"}
          </p>
        </div>
      ),
    },
    {
      key: "channel",
      header: "Canal",
      render: (m) => (
        <span className="flex items-center gap-2 text-muted-foreground">
          {m.channel === "whatsapp" ? (
            <MessageCircle className="size-4 text-primary" />
          ) : (
            <Mail className="size-4 text-chart-3" />
          )}
          <span className="hidden sm:inline">{m.channel === "whatsapp" ? "WhatsApp" : "E-mail"}</span>
        </span>
      ),
    },
    {
      key: "automation",
      header: "Automação",
      hideOnMobile: true,
      render: (m) => <span className="text-muted-foreground">{m.automation}</span>,
    },
    {
      key: "template",
      header: "Template",
      hideOnMobile: true,
      render: (m) => <span className="font-mono text-xs text-muted-foreground">{m.template}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (m) => <StatusBadge label={humanize(m.status)} tone={statusTones[m.status]} />,
    },
    {
      key: "sentAt",
      header: "Envio",
      hideOnMobile: true,
      render: (m) => <span className="text-muted-foreground">{formatDateTime(m.sentAt)}</span>,
    },
  ];

  return (
    <AppShell
      title="Mensagens"
      subtitle="Histórico de disparos das automações"
      actions={
        <button
          type="button"
          onClick={() => toast("Histórico atualizado")}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RefreshCw className="size-4" />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      }
    >
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
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar cliente ou automação…" />
        </div>
      </SectionCard>

      <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
        <DataTable
          columns={columns}
          rows={paged}
          onRowClick={setDetail}
          emptyTitle="Nenhuma mensagem encontrada"
          emptyDescription="Ajuste os filtros de status ou canal."
        />
        {rows.length > 0 ? (
          <Pagination page={page} pageCount={pageCount} total={rows.length} onPageChange={setPage} />
        ) : null}
      </div>

      <Modal
        open={Boolean(detail)}
        onOpenChange={(open) => !open && setDetail(null)}
        title={detail?.customer ?? ""}
        description="Detalhes do disparo"
      >
        {detail ? (
          <div className="space-y-3 text-sm">
            {[
              ["Automação", detail.automation],
              ["Template", detail.template],
              ["Canal", detail.channel === "whatsapp" ? "WhatsApp" : "E-mail"],
              ["Enviada em", formatDateTime(detail.sentAt)],
              ["Entregue em", detail.deliveredAt ? formatDateTime(detail.deliveredAt) : "—"],
              ["Pedido", detail.orderNumber ?? "—"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 border-b border-border/60 pb-2 last:border-0"
              >
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{k}</span>
                <span className="truncate text-right font-medium">{v}</span>
              </div>
            ))}
            {detail.errorReason ? (
              <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-destructive">
                <p className="text-xs uppercase tracking-wider">Motivo do erro</p>
                <p className="mt-1 text-sm">{detail.errorReason}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
