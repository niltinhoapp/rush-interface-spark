import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Copy,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { DataTable, type Column } from "@/components/common/DataTable";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { automations as allAutomations, categoryLabels, triggerLabels } from "@/data/automations";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { Automation } from "@/types";

export const Route = createFileRoute("/automacoes/")({
  head: () => ({
    meta: [
      { title: "Automações — Nuvem Rush" },
      {
        name: "description",
        content:
          "Gerencie automações de carrinho abandonado, pós-venda, rastreio e recompra por WhatsApp e e-mail.",
      },
      { property: "og:title", content: "Automações — Nuvem Rush" },
      {
        property: "og:description",
        content: "Lista de automações com gatilho, canal, execuções e taxa de sucesso.",
      },
    ],
  }),
  component: AutomationsPage,
});

const filters = [
  { value: "todas", label: "Todas" },
  { value: "ativa", label: "Ativas" },
  { value: "pausada", label: "Pausadas" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "E-mail" },
  { value: "carrinho", label: "Carrinho abandonado" },
  { value: "pos_venda", label: "Pós-venda" },
  { value: "rastreio", label: "Rastreio" },
  { value: "recompra", label: "Recompra" },
];

function matches(a: Automation, filter: string) {
  if (filter === "todas") return true;
  return a.status === filter || a.channel === filter || a.category === filter;
}

function AutomationsPage() {
  const [filter, setFilter] = useState("todas");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(allAutomations);
  const [toDelete, setToDelete] = useState<Automation | null>(null);

  const rows = useMemo(
    () =>
      items.filter(
        (a) => matches(a, filter) && a.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [items, filter, query],
  );

  const toggle = (a: Automation) => {
    const next = a.status === "ativa" ? "pausada" : "ativa";
    setItems((prev) => prev.map((i) => (i.id === a.id ? { ...i, status: next } : i)));
    toast.success(next === "ativa" ? "Automação ativada" : "Automação pausada", {
      description: a.name,
    });
  };

  const duplicate = (a: Automation) => {
    setItems((prev) => [
      { ...a, id: `${a.id}-copy-${prev.length}`, name: `${a.name} (cópia)`, status: "rascunho", runs: 0 },
      ...prev,
    ]);
    toast.success("Automação duplicada", { description: a.name });
  };

  const columns: Column<Automation>[] = [
    {
      key: "name",
      header: "Automação",
      render: (a) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{a.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {categoryLabels[a.category]}
          </p>
        </div>
      ),
    },
    {
      key: "trigger",
      header: "Gatilho",
      hideOnMobile: true,
      render: (a) => <span className="text-muted-foreground">{triggerLabels[a.trigger]}</span>,
    },
    {
      key: "channel",
      header: "Canal",
      render: (a) => (
        <span className="flex items-center gap-2 text-muted-foreground">
          {a.channel === "whatsapp" ? (
            <MessageCircle className="size-4 text-primary" />
          ) : (
            <Mail className="size-4 text-chart-3" />
          )}
          {a.channel === "whatsapp" ? "WhatsApp" : "E-mail"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (a) => <StatusBadge label={humanize(a.status)} tone={statusTones[a.status]} />,
    },
    {
      key: "runs",
      header: "Execuções",
      hideOnMobile: true,
      className: "tabular-nums",
      render: (a) => formatNumber(a.runs),
    },
    {
      key: "lastRun",
      header: "Última execução",
      hideOnMobile: true,
      render: (a) => (
        <span className="text-muted-foreground">{formatDateTime(a.lastRunAt)}</span>
      ),
    },
    {
      key: "success",
      header: "Sucesso",
      render: (a) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
            <div
              className={a.successRate >= 80 ? "h-full bg-success" : "h-full bg-warning"}
              style={{ width: `${a.successRate}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{a.successRate}%</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      className: "text-right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Editar"
            onClick={() => toast("Editor de automação", { description: a.name })}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Duplicar"
            onClick={() => duplicate(a)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Copy className="size-4" />
          </button>
          <button
            type="button"
            aria-label={a.status === "ativa" ? "Pausar" : "Ativar"}
            onClick={() => toggle(a)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {a.status === "ativa" ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            aria-label="Excluir"
            onClick={() => setToDelete(a)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppShell
      title="Automações"
      subtitle={`${items.length} automações · ${items.filter((a) => a.status === "ativa").length} ativas`}
      actions={
        <Link
          to="/automacoes/nova"
          className="inline-flex items-center gap-2 rounded-xl bg-rush px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Criar automação</span>
        </Link>
      }
    >
      <SectionCard bodyClassName="space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <FilterTabs options={filters} value={filter} onChange={setFilter} />
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar automação…" />
        </div>
      </SectionCard>

      <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
        <DataTable
          columns={columns}
          rows={rows}
          emptyTitle="Nenhuma automação encontrada"
          emptyDescription="Ajuste os filtros ou crie uma nova automação para começar."
        />
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir automação?"
        description={`A automação "${toDelete?.name ?? ""}" deixará de disparar. Esta ação não pode ser desfeita.`}
        onConfirm={() => {
          if (toDelete) {
            setItems((prev) => prev.filter((i) => i.id !== toDelete.id));
            toast.error("Automação excluída", { description: toDelete.name });
          }
          setToDelete(null);
        }}
      />

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <MoreHorizontal className="size-3.5" />
        Dados de demonstração — a interface será conectada ao sistema existente.
      </p>
    </AppShell>
  );
}
