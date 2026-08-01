import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Contact2, Download, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { contacts } from "@/data/contacts";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Contact } from "@/types";

export const Route = createFileRoute("/contatos")({
  head: () => ({
    meta: [
      { title: "Contatos — Nuvem Rush" },
      {
        name: "description",
        content:
          "Base de clientes com histórico de compras, tags, consentimento de comunicação e última interação.",
      },
      { property: "og:title", content: "Contatos — Nuvem Rush" },
      {
        property: "og:description",
        content: "Gerencie sua base de contatos e o consentimento de WhatsApp e e-mail.",
      },
    ],
  }),
  component: ContactsPage,
});

const PAGE_SIZE = 8;

function ContactsPage() {
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Contact | null>(null);

  const filters = useMemo(
    () => [
      { value: "todos", label: "Todos", count: contacts.length },
      ...(["aceito", "pendente", "recusado"] as const).map((s) => ({
        value: s,
        label: `Consentimento ${humanize(s)}`,
        count: contacts.filter((c) => c.consent === s).length,
      })),
      { value: "VIP", label: "VIP", count: contacts.filter((c) => c.tags.includes("VIP")).length },
    ],
    [],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter(
      (c) =>
        (filter === "todos" || c.consent === filter || c.tags.includes(filter)) &&
        (c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)),
    );
  }, [filter, query]);

  const pageCount = Math.ceil(rows.length / PAGE_SIZE);
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Contact>[] = [
    {
      key: "name",
      header: "Contato",
      render: (c) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{c.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Telefone",
      hideOnMobile: true,
      render: (c) => <span className="text-muted-foreground">{c.phone}</span>,
    },
    { key: "orders", header: "Pedidos", className: "tabular-nums", render: (c) => c.orders },
    {
      key: "totalSpent",
      header: "Total gasto",
      className: "tabular-nums",
      render: (c) => formatCurrency(c.totalSpent),
    },
    {
      key: "lastPurchaseAt",
      header: "Última compra",
      hideOnMobile: true,
      render: (c) => <span className="text-muted-foreground">{formatDate(c.lastPurchaseAt)}</span>,
    },
    {
      key: "tags",
      header: "Tags",
      hideOnMobile: true,
      render: (c) => (
        <div className="flex flex-wrap gap-1.5">
          {c.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "consent",
      header: "Consentimento",
      render: (c) => <StatusBadge label={humanize(c.consent)} tone={statusTones[c.consent]} />,
    },
  ];

  return (
    <AppShell
      title="Contatos"
      subtitle={`${contacts.length} contatos na base`}
      actions={
        <button
          type="button"
          onClick={() => toast.success("Exportação iniciada", { description: "CSV de contatos" })}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="size-4" />
          <span className="hidden sm:inline">Exportar</span>
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
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar nome, e-mail ou telefone…" />
        </div>
      </SectionCard>

      <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
        <DataTable
          columns={columns}
          rows={paged}
          onRowClick={setDetail}
          emptyTitle="Nenhum contato encontrado"
          emptyDescription="Ajuste a busca ou os filtros de consentimento."
        />
        {rows.length > 0 ? (
          <Pagination page={page} pageCount={pageCount} total={rows.length} onPageChange={setPage} />
        ) : null}
      </div>

      <Modal
        open={Boolean(detail)}
        onOpenChange={(open) => !open && setDetail(null)}
        title={detail?.name ?? ""}
        description="Perfil do contato"
      >
        {detail ? (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { k: "Telefone", v: detail.phone, icon: MessageCircle },
                { k: "E-mail", v: detail.email, icon: Mail },
                { k: "Pedidos", v: String(detail.orders), icon: Contact2 },
                { k: "Total gasto", v: formatCurrency(detail.totalSpent), icon: Contact2 },
              ].map((f) => (
                <div key={f.k} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.k}</p>
                  <p className="mt-1 truncate font-medium">{f.v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 p-3">
              <span className="text-muted-foreground">Última interação</span>
              <span className="font-medium">{detail.lastInteractionAt}</span>
            </div>
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
