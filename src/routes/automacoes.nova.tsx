import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Clock, GitBranch, Mail, MessageCircle, Plus, Save, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { triggerLabels } from "@/data/mocks/automations";
import { whatsappTemplates, emailTemplates } from "@/data/mocks/templates";
import type { AutomationTrigger, Channel } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/automacoes/nova")({
  head: () => ({
    meta: [
      { title: "Nova automação — Nuvem Rush" },
      {
        name: "description",
        content:
          "Monte uma automação escolhendo gatilho, condições, tempo de espera, canal e template de mensagem.",
      },
      { property: "og:title", content: "Nova automação — Nuvem Rush" },
      {
        property: "og:description",
        content: "Construtor visual de fluxos de pós-venda e recuperação de carrinho.",
      },
    ],
  }),
  component: AutomationBuilder,
});

const triggers = Object.entries(triggerLabels) as [AutomationTrigger, string][];

const conditions = [
  "Valor do pedido acima de R$ 150",
  "Cliente com consentimento aceito",
  "Primeira compra do cliente",
  "Produto da categoria selecionada",
];

const delays = ["Imediato", "15 minutos", "1 hora", "24 horas", "3 dias", "7 dias"];

function StepShell({
  index,
  title,
  description,
  icon: Icon,
  children,
}: {
  index: number;
  title: string;
  description: string;
  icon: typeof Zap;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-10">
      <span className="absolute left-0 top-0 flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="size-3.5" />
      </span>
      <span
        aria-hidden
        className="absolute left-[13px] top-8 bottom-[-1.5rem] w-px bg-border last:hidden"
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Passo {index}
      </p>
      <h3 className="mt-1 font-display text-base font-semibold">{title}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const chip = (active: boolean) =>
  cn(
    "rounded-xl border px-3 py-2 text-sm transition-colors",
    active
      ? "border-primary/40 bg-primary/12 text-primary"
      : "border-border bg-card text-muted-foreground hover:border-primary/25 hover:text-foreground",
  );

function AutomationBuilder() {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState<AutomationTrigger>("carrinho_abandonado");
  const [selected, setSelected] = useState<string[]>([conditions[1]]);
  const [delay, setDelay] = useState("1 hora");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [template, setTemplate] = useState(whatsappTemplates[0]?.name ?? "");

  const templates = channel === "whatsapp" ? whatsappTemplates : emailTemplates;
  const preview = templates.find((t) => t.name === template);

  const toggleCondition = (c: string) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((i) => i !== c) : [...prev, c]));

  return (
    <AppShell
      title="Nova automação"
      subtitle="Construtor visual · dados de demonstração"
      actions={
        <button
          type="button"
          onClick={() => toast.success("Automação salva", { description: name || "Sem título" })}
          className="inline-flex items-center gap-2 rounded-xl bg-rush px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Save className="size-4" />
          <span className="hidden sm:inline">Salvar</span>
        </button>
      }
    >
      <Link
        to="/automacoes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para automações
      </Link>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard bodyClassName="space-y-8 p-5 sm:p-6">
          <div>
            <label className="text-sm font-medium" htmlFor="nome">
              Nome da automação
            </label>
            <input
              id="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Carrinho abandonado — 1ª mensagem"
              className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary/40"
            />
          </div>

          <StepShell
            index={1}
            title="Gatilho"
            description="O evento da Nuvemshop que inicia o fluxo."
            icon={Zap}
          >
            <div className="flex flex-wrap gap-2">
              {triggers.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTrigger(value)}
                  className={chip(trigger === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </StepShell>

          <StepShell
            index={2}
            title="Condições"
            description="Filtros opcionais aplicados antes do envio."
            icon={GitBranch}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {conditions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCondition(c)}
                  className={cn(chip(selected.includes(c)), "text-left")}
                >
                  {c}
                </button>
              ))}
            </div>
          </StepShell>

          <StepShell
            index={3}
            title="Tempo de espera"
            description="Quanto tempo aguardar após o gatilho."
            icon={Clock}
          >
            <div className="flex flex-wrap gap-2">
              {delays.map((d) => (
                <button key={d} type="button" onClick={() => setDelay(d)} className={chip(delay === d)}>
                  {d}
                </button>
              ))}
            </div>
          </StepShell>

          <StepShell
            index={4}
            title="Canal e mensagem"
            description="Escolha o canal e o template que será disparado."
            icon={MessageCircle}
          >
            <div className="flex flex-wrap gap-2">
              {(["whatsapp", "email"] as Channel[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setChannel(c);
                    setTemplate(
                      (c === "whatsapp" ? whatsappTemplates : emailTemplates)[0]?.name ?? "",
                    );
                  }}
                  className={cn(chip(channel === c), "inline-flex items-center gap-2")}
                >
                  {c === "whatsapp" ? <MessageCircle className="size-4" /> : <Mail className="size-4" />}
                  {c === "whatsapp" ? "WhatsApp" : "E-mail"}
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.name)}
                  className={cn(chip(template === t.name), "text-left")}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </StepShell>

          <button
            type="button"
            onClick={() => toast("Novo passo adicionado ao fluxo")}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="size-4" />
            Adicionar passo
          </button>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Resumo do fluxo" bodyClassName="space-y-3 text-sm">
            {[
              ["Nome", name || "Sem título"],
              ["Gatilho", triggerLabels[trigger]],
              ["Espera", delay],
              ["Canal", channel === "whatsapp" ? "WhatsApp" : "E-mail"],
              ["Template", template || "—"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{k}</span>
                <span className="truncate text-right font-medium">{v}</span>
              </div>
            ))}
            <div className="pt-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Condições</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Nenhuma</span>
                ) : (
                  selected.map((c) => <StatusBadge key={c} label={c} tone="info" />)
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Prévia da mensagem">
            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              {preview && "subject" in preview ? (
                <p className="mb-2 text-sm font-semibold">{preview.subject}</p>
              ) : null}
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {preview?.content ?? "Selecione um template para visualizar."}
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
