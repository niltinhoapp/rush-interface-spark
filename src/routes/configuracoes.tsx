import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Nuvem Rush" },
      {
        name: "description",
        content: "Preferências da conta, alertas e exibição do painel Nuvem Rush.",
      },
      { property: "og:title", content: "Configurações — Nuvem Rush" },
      {
        property: "og:description",
        content: "Preferências da conta, alertas e exibição do painel.",
      },
    ],
  }),
  component: Configuracoes,
});

const preferences = [
  { id: "alertas", label: "Alertas de performance", hint: "Avisar quando o ROAS cair abaixo da meta.", on: true },
  { id: "estoque", label: "Aviso de estoque baixo", hint: "Notificar com menos de 40 unidades.", on: true },
  { id: "resumo", label: "Resumo diário", hint: "Enviar consolidado às 8h.", on: false },
  { id: "fadiga", label: "Detecção de fadiga de criativo", hint: "Sinalizar queda de CTR em 5 dias.", on: true },
];

function Configuracoes() {
  return (
    <DashboardLayout title="Configurações" subtitle="Preferências de exibição e notificações">
      <div className="grid gap-4 xl:grid-cols-2">
        <section className="surface-panel rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Conta</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground">Loja</span>
              <span className="font-medium">Loja Rush</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground">Plano</span>
              <span className="font-medium">Pro</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-muted-foreground">Fuso horário</span>
              <span className="font-medium">GMT-3 · São Paulo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Moeda</span>
              <span className="font-medium">BRL (R$)</span>
            </div>
          </div>
        </section>

        <section className="surface-panel rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Notificações</h2>
          <div className="mt-4 space-y-4">
            {preferences.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.hint}</p>
                </div>
                <Switch defaultChecked={p.on} aria-label={p.label} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
