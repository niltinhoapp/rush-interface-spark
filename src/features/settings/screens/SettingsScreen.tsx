import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { Switch } from "@/components/ui/switch";

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary/40";

export function SettingsScreen() {
  const [toggles, setToggles] = useState({
    quietHours: true,
    dailyDigest: true,
    failureAlerts: true,
    marketing: false,
  });

  return (
    <AppShell
      title="Configurações"
      subtitle="Preferências gerais da conta e dos envios"
      actions={
        <button
          type="button"
          onClick={() => toast.success("Preferências salvas")}
          className="rounded-xl bg-rush px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Salvar
        </button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <SectionCard title="Dados da loja" description="Informações usadas nas mensagens">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { id: "loja", label: "Nome da loja", value: "Loja Rush" },
                { id: "url", label: "Endereço", value: "lojarush.com.br" },
                { id: "suporte", label: "E-mail de suporte", value: "ajuda@lojarush.com.br" },
                { id: "tel", label: "Telefone de contato", value: "+55 11 4002-8922" },
              ].map((f) => (
                <div key={f.id}>
                  <label className="text-sm font-medium" htmlFor={f.id}>
                    {f.label}
                  </label>
                  <input id={f.id} defaultValue={f.value} className={fieldClass} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Envios" description="Janela de disparo e limites diários">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium" htmlFor="inicio">
                  Início
                </label>
                <input id="inicio" type="time" defaultValue="09:00" className={fieldClass} />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="fim">
                  Fim
                </label>
                <input id="fim" type="time" defaultValue="20:00" className={fieldClass} />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="limite">
                  Limite diário
                </label>
                <input id="limite" type="number" defaultValue={2000} className={fieldClass} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">Respeitar horário de silêncio</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Nenhuma mensagem é enviada fora da janela configurada.
                </p>
              </div>
              <Switch
                checked={toggles.quietHours}
                onCheckedChange={(v) => setToggles((t) => ({ ...t, quietHours: v }))}
              />
            </div>
          </SectionCard>

          <SectionCard title="Notificações" bodyClassName="space-y-3">
            {[
              {
                key: "dailyDigest" as const,
                label: "Resumo diário por e-mail",
                hint: "Desempenho das automações nas últimas 24 h.",
              },
              {
                key: "failureAlerts" as const,
                label: "Alertas de falha",
                hint: "Aviso imediato quando uma automação apresenta erro.",
              },
              {
                key: "marketing" as const,
                label: "Novidades do produto",
                hint: "Comunicados sobre novos recursos do Nuvem Rush.",
              },
            ].map((n) => (
              <div
                key={n.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.hint}</p>
                </div>
                <Switch
                  checked={toggles[n.key]}
                  onCheckedChange={(v) => setToggles((t) => ({ ...t, [n.key]: v }))}
                />
              </div>
            ))}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Plano" description="Assinatura atual">
            <p className="font-display text-2xl font-semibold text-rush">Pro</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Até 25.000 mensagens por mês · automações ilimitadas
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[62%] rounded-full bg-rush" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">62% do limite mensal utilizado</p>
          </SectionCard>

          <SectionCard title="Equipe" bodyClassName="space-y-3">
            {[
              { name: "Luiza Ramos", role: "Proprietária" },
              { name: "Diego Alves", role: "Operação" },
            ].map((u) => (
              <div key={u.name} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-semibold">
                  {u.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.role}</p>
                </div>
              </div>
            ))}
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
