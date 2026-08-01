import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, Mail, MessageCircle, Pencil, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { FilterTabs } from "@/components/common/FilterTabs";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { emailTemplates, whatsappTemplates } from "@/data/mocks/templates";
import { formatDate } from "@/lib/format";
import type { Channel } from "@/types";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Nuvem Rush" },
      {
        name: "description",
        content:
          "Modelos de mensagem de WhatsApp e e-mail com variáveis, status de aprovação e prévia.",
      },
      { property: "og:title", content: "Templates — Nuvem Rush" },
      {
        property: "og:description",
        content: "Gerencie templates aprovados pela Meta e modelos de e-mail transacional.",
      },
    ],
  }),
  component: TemplatesPage,
});

interface Preview {
  name: string;
  subject?: string;
  content: string;
  variables: string[];
}

function TemplatesPage() {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [preview, setPreview] = useState<Preview | null>(null);

  const items =
    channel === "whatsapp"
      ? whatsappTemplates.map((t) => ({
          id: t.id,
          name: t.name,
          meta: `${t.category} · ${t.language}`,
          status: t.approval,
          content: t.content,
          variables: t.variables,
          updatedAt: t.updatedAt,
        }))
      : emailTemplates.map((t) => ({
          id: t.id,
          name: t.name,
          meta: t.subject,
          status: t.status,
          content: t.content,
          variables: t.variables,
          updatedAt: t.updatedAt,
        }));

  return (
    <AppShell
      title="Templates"
      subtitle="Modelos de mensagem para WhatsApp e e-mail"
      actions={
        <button
          type="button"
          onClick={() => toast("Novo template", { description: "Editor de demonstração" })}
          className="inline-flex items-center gap-2 rounded-xl bg-rush px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Novo template</span>
        </button>
      }
    >
      <FilterTabs
        options={[
          { value: "whatsapp", label: "WhatsApp", count: whatsappTemplates.length },
          { value: "email", label: "E-mail", count: emailTemplates.length },
        ]}
        value={channel}
        onChange={(v) => setChannel(v as Channel)}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => (
          <SectionCard key={t.id} bodyClassName="space-y-4 p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 truncate font-display font-semibold">
                  {channel === "whatsapp" ? (
                    <MessageCircle className="size-4 shrink-0 text-primary" />
                  ) : (
                    <Mail className="size-4 shrink-0 text-chart-3" />
                  )}
                  <span className="truncate">{t.name}</span>
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{t.meta}</p>
              </div>
              <StatusBadge label={humanize(t.status)} tone={statusTones[t.status] ?? "neutral"} />
            </div>

            <p className="line-clamp-3 whitespace-pre-line rounded-xl bg-secondary/40 p-3 text-sm leading-relaxed text-muted-foreground">
              {t.content}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {t.variables.map((v) => (
                <span
                  key={v}
                  className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-3">
              <span className="truncate text-xs text-muted-foreground">
                Atualizado em {formatDate(t.updatedAt)}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label="Visualizar"
                  onClick={() =>
                    setPreview({
                      name: t.name,
                      subject: channel === "email" ? t.meta : undefined,
                      content: t.content,
                      variables: t.variables,
                    })
                  }
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Eye className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Editar"
                  onClick={() => toast("Editor de template", { description: t.name })}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <Modal
        open={Boolean(preview)}
        onOpenChange={(open) => !open && setPreview(null)}
        title={preview?.name ?? ""}
        description="Prévia do template"
      >
        {preview ? (
          <div className="space-y-3">
            {preview.subject ? (
              <p className="rounded-xl border border-border bg-card p-3 text-sm font-semibold">
                {preview.subject}
              </p>
            ) : null}
            <p className="whitespace-pre-line rounded-xl border border-border bg-secondary/40 p-4 text-sm leading-relaxed">
              {preview.content}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {preview.variables.map((v) => (
                <span
                  key={v}
                  className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </Modal>
    </AppShell>
  );
}
