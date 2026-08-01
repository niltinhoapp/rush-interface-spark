import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { AsyncSection, SkeletonCards } from "@/components/common/AsyncSection";
import { SearchInput } from "@/components/common/SearchInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WhatsappTemplateCard } from "@/components/templates/WhatsappTemplateCard";
import { EmailTemplateCard } from "@/components/templates/EmailTemplateCard";
import { WhatsappPreviewModal } from "@/components/templates/WhatsappPreviewModal";
import { EmailPreviewModal } from "@/components/templates/EmailPreviewModal";
import { EmailEditorModal } from "@/components/templates/EmailEditorModal";
import { useEmailConnection, useTemplates } from "@/hooks";
import type { EmailTemplate, WhatsappTemplate } from "@/types";

export function TemplatesScreen() {
  const { data, loading, initialLoading, error, refetch } = useTemplates();
  const emailConnection = useEmailConnection();
  const [search, setSearch] = useState("");
  const [whatsappPreview, setWhatsappPreview] = useState<WhatsappTemplate | null>(null);
  const [emailPreview, setEmailPreview] = useState<EmailTemplate | null>(null);
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [emailEditorOpen, setEmailEditorOpen] = useState(false);

  const whatsapp = useMemo(
    () =>
      (data?.whatsapp ?? []).filter((t) => t.name.toLowerCase().includes(search.trim().toLowerCase())),
    [data, search],
  );
  const email = useMemo(
    () => (data?.email ?? []).filter((t) => t.name.toLowerCase().includes(search.trim().toLowerCase())),
    [data, search],
  );

  const defaultSender = emailConnection.data?.connection.senderEmail ?? "contato@loja.com.br";

  return (
    <AppShell
      title="Templates"
      subtitle="Modelos de mensagem para WhatsApp e e-mail"
      actions={
        <Button
          type="button"
          onClick={() =>
            toast("Criação de template", {
              description: "Fluxo de criação de demonstração — envie para aprovação da Meta ou salve como rascunho.",
            })
          }
          className="min-h-11"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">Criar template</span>
        </Button>
      }
    >
      <Tabs defaultValue="whatsapp" className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="email">E-mail</TabsTrigger>
          </TabsList>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome…" className="sm:max-w-xs" />
        </div>

        <TabsContent value="whatsapp">
          <AsyncSection
            loading={initialLoading}
            error={error}
            empty={!loading && whatsapp.length === 0}
            onRetry={refetch}
            skeleton={<SkeletonCards count={6} />}
            emptyTitle="Nenhum template de WhatsApp encontrado"
            emptyDescription="Ajuste a busca ou crie um novo template."
          >
            <div className="mt-2 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {whatsapp.map((t) => (
                <WhatsappTemplateCard
                  key={t.id}
                  template={t}
                  onView={() => setWhatsappPreview(t)}
                  onDuplicate={() =>
                    toast.success("Template duplicado", {
                      description: `“${t.name} (cópia)” criado como rascunho para nova aprovação.`,
                    })
                  }
                  onEdit={() =>
                    toast("Editor de rascunho", { description: `Editando ${t.name} (demonstração)` })
                  }
                />
              ))}
            </div>
          </AsyncSection>
        </TabsContent>

        <TabsContent value="email">
          <AsyncSection
            loading={initialLoading}
            error={error}
            empty={!loading && email.length === 0}
            onRetry={refetch}
            skeleton={<SkeletonCards count={6} />}
            emptyTitle="Nenhum template de e-mail encontrado"
            emptyDescription="Ajuste a busca ou crie um novo template."
          >
            <div className="mt-2 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {email.map((t) => (
                <EmailTemplateCard
                  key={t.id}
                  template={t}
                  onView={() => setEmailPreview(t)}
                  onEdit={() => {
                    setEditingEmail(t);
                    setEmailEditorOpen(true);
                  }}
                />
              ))}
            </div>
          </AsyncSection>
        </TabsContent>
      </Tabs>

      <WhatsappPreviewModal
        template={whatsappPreview}
        onOpenChange={(open) => !open && setWhatsappPreview(null)}
      />
      <EmailPreviewModal template={emailPreview} onOpenChange={(open) => !open && setEmailPreview(null)} />
      <EmailEditorModal
        open={emailEditorOpen}
        template={editingEmail}
        defaultSender={defaultSender}
        onOpenChange={(open) => {
          setEmailEditorOpen(open);
          if (!open) setEditingEmail(null);
        }}
      />
    </AppShell>
  );
}
