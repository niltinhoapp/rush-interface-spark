import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertTriangle, Plug, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { integrations } from "@/data/integrations";

export const Route = createFileRoute("/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações — Nuvem Rush" },
      {
        name: "description",
        content:
          "Status das integrações com Nuvemshop, WhatsApp Cloud API, e-mail e webhooks, com última sincronização.",
      },
      { property: "og:title", content: "Integrações — Nuvem Rush" },
      {
        property: "og:description",
        content: "Verifique conexões e erros de sincronização em um só lugar.",
      },
    ],
  }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  return (
    <AppShell title="Integrações" subtitle="Conexões da conta e sincronização de dados">
      <div className="grid gap-4 lg:grid-cols-2">
        {integrations.map((i) => (
          <SectionCard key={i.id} bodyClassName="space-y-4 p-5 sm:p-6">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Plug className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display font-semibold">{i.name}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {i.description}
                </p>
              </div>
              <StatusBadge label={humanize(i.status)} tone={statusTones[i.status] ?? "neutral"} />
            </div>

            {i.error ? (
              <div className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 p-3 text-warning">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p className="text-sm leading-relaxed">{i.error}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-3">
              <span className="truncate text-xs text-muted-foreground">
                Última sincronização: {i.lastSyncAt}
              </span>
              <button
                type="button"
                onClick={() => toast.success("Sincronização iniciada", { description: i.name })}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <RefreshCw className="size-3.5" />
                Sincronizar
              </button>
            </div>
          </SectionCard>
        ))}
      </div>
    </AppShell>
  );
}
