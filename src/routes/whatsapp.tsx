import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertTriangle, MessageCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { whatsappConnection } from "@/data/mocks/connections";
import { whatsappTemplates } from "@/data/mocks/templates";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp oficial — Nuvem Rush" },
      {
        name: "description",
        content:
          "Status da conexão WhatsApp Cloud API, número verificado, qualidade da conta e templates aprovados.",
      },
      { property: "og:title", content: "WhatsApp oficial — Nuvem Rush" },
      {
        property: "og:description",
        content: "Configuração e saúde do canal oficial de WhatsApp da sua loja.",
      },
    ],
  }),
  component: WhatsappPage,
});

function WhatsappPage() {
  const c = whatsappConnection;

  return (
    <AppShell title="WhatsApp oficial" subtitle="WhatsApp Cloud API · canal transacional">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <SectionCard
            title="Conexão"
            description="Número e conta comercial vinculados"
            actions={
              <StatusBadge
                label={c.connected ? "Conectado" : "Desconectado"}
                tone={c.connected ? "success" : "neutral"}
              />
            }
          >
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Número", c.phone],
                ["Conta comercial", c.businessName],
                ["WABA ID", c.waba],
                ["Status da conta", c.accountStatus],
                ["Qualidade", c.quality],
                ["Limite de envio", c.messagingLimit],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-card p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-1 truncate text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard
            title="Templates aprovados"
            description="Modelos disponíveis para disparo"
            bodyClassName="divide-y divide-border/70 p-0 px-5 sm:px-6"
          >
            {whatsappTemplates.map((t) => (
              <div key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm">{t.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {t.category} · {t.language}
                  </p>
                </div>
                <StatusBadge label={humanize(t.approval)} tone={statusTones[t.approval] ?? "neutral"} />
              </div>
            ))}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Saúde do canal" bodyClassName="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 p-3 text-success">
              <ShieldCheck className="size-4 shrink-0" />
              <p className="text-sm">Número verificado pela Meta.</p>
            </div>
            {c.warnings.map((w) => (
              <div
                key={w}
                className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 p-3 text-warning"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <p className="text-sm leading-relaxed">{w}</p>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Ações" bodyClassName="space-y-2">
            <button
              type="button"
              onClick={() => toast.success("Conexão testada com sucesso")}
              className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm transition-colors hover:border-primary/30"
            >
              <RefreshCw className="size-4 text-primary" />
              Testar conexão
            </button>
            <button
              type="button"
              onClick={() => toast("Mensagem de teste enviada")}
              className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm transition-colors hover:border-primary/30"
            >
              <MessageCircle className="size-4 text-primary" />
              Enviar mensagem de teste
            </button>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
