import { Mail, MessageCircle } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { AsyncSection, SkeletonRows } from "@/components/common/AsyncSection";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { messageStatusLabels } from "@/lib/labels";
import { formatDateTime, orNotProvided } from "@/lib/format";
import { useMessages } from "@/hooks";

export function OrderMessagesSection({ orderNumber }: { orderNumber: string }) {
  const messages = useMessages({ orderNumber });

  return (
    <SectionCard title="Mensagens relacionadas" description="Disparos vinculados a este pedido">
      <AsyncSection
        loading={messages.initialLoading}
        error={messages.error}
        onRetry={messages.refetch}
        empty={messages.isEmpty}
        emptyTitle="Nenhuma mensagem enviada"
        emptyDescription="Ainda não há disparos vinculados a este pedido."
        skeleton={<SkeletonRows rows={3} />}
      >
        <ul className="space-y-3">
          {messages.items.map((message) => {
            const Icon = message.channel === "whatsapp" ? MessageCircle : Mail;
            return (
              <li key={message.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3 text-sm">
                <div className="flex min-w-0 items-start gap-2">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{message.automation}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Enviada {orNotProvided(formatDateTime(message.sentAt))}
                    </p>
                  </div>
                </div>
                <StatusBadge label={messageStatusLabels[message.status]} tone={statusTones[message.status]} />
              </li>
            );
          })}
        </ul>
      </AsyncSection>
    </SectionCard>
  );
}
