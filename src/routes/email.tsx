import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertTriangle, Mail, Send, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { MetricCard } from "@/components/common/MetricCard";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { emailConnection } from "@/data/integrations";
import { emailTemplates } from "@/data/templates";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "E-mail — Nuvem Rush" },
      {
        name: "description",
        content:
          "Remetente verificado, domínio, taxa de entrega e templates de e-mail das automações da loja.",
      },
      { property: "og:title", content: "E-mail — Nuvem Rush" },
      {
        property: "og:description",
        content: "Configuração do canal de e-mail transacional e de recuperação.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const c = emailConnection;

  return (
    <AppShell title="E-mail" subtitle="Remetente verificado e desempenho de entrega">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {c.stats.map((s) => (
          <MetricCard key={s.label} label={s.label} value={s.value} icon={Mail} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <SectionCard
            title="Remetente"
            description="Identidade usada nos envios"
            actions={
              <StatusBadge
                label={c.connected ? "Conectado" : "Desconectado"}
                tone={c.connected ? "success" : "neutral"}
              />
            }
          >
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Nome do remetente", c.senderName],
                ["E-mail", c.senderEmail],
                ["Domínio", c.domain],
                ["Provedor", c.provider],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-card p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-1 truncate text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard
            title="Templates de e-mail"
            bodyClassName="divide-y divide-border/70 p-0 px-5 sm:px-6"
          >
            {emailTemplates.map((t) => (
              <div key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.subject}</p>
                </div>
                <StatusBadge label={humanize(t.status)} tone={statusTones[t.status] ?? "neutral"} />
              </div>
            ))}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Autenticação de domínio" bodyClassName="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 p-3 text-success">
              <ShieldCheck className="size-4 shrink-0" />
              <p className="text-sm">SPF configurado corretamente.</p>
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
              onClick={() => toast.success("E-mail de teste enviado")}
              className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm transition-colors hover:border-primary/30"
            >
              <Send className="size-4 text-primary" />
              Enviar e-mail de teste
            </button>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
