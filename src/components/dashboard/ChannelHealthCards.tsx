import { Mail, MessageCircle } from "lucide-react";
import { AppLink } from "@/components/common/AppLink";
import { StatusBadge, type BadgeTone } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { humanizeStatus } from "@/lib/labels";
import { formatDateTime } from "@/lib/format";
import type { EmailConnection, WhatsappConnection } from "@/types";

const toneByStatus: Record<string, BadgeTone> = {
  conectado: "success",
  conectando: "info",
  nao_conectado: "neutral",
  desconectado: "neutral",
  incompleto: "warning",
  atencao: "warning",
  erro: "danger",
};

function ChannelCard({
  icon: Icon,
  title,
  status,
  detail,
  lastSyncAt,
  href,
  loading,
  error,
}: {
  icon: typeof MessageCircle;
  title: string;
  status: string | undefined;
  detail: string;
  lastSyncAt: string | null | undefined;
  href: string;
  loading: boolean;
  error?: string | null;
}) {
  return (
    <div className="surface-panel rounded-2xl p-5">
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Icon aria-hidden className="size-4 text-primary" />
              {title}
            </span>
            {status ? (
              <StatusBadge label={humanizeStatus(status)} tone={toneByStatus[status] ?? "neutral"} />
            ) : null}
          </div>
          <p className="mt-3 truncate text-sm text-muted-foreground">
            {error ?? detail}
          </p>
          {lastSyncAt ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Última sincronização {formatDateTime(lastSyncAt)}
            </p>
          ) : null}
          <AppLink
            to={href}
            className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
          >
            Gerenciar
          </AppLink>
        </>
      )}
    </div>
  );
}

export function ChannelHealthCards({
  whatsapp,
  whatsappLoading,
  whatsappError,
  email,
  emailLoading,
  emailError,
}: {
  whatsapp: WhatsappConnection | null;
  whatsappLoading: boolean;
  whatsappError?: string | null;
  email: EmailConnection | null;
  emailLoading: boolean;
  emailError?: string | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChannelCard
        icon={MessageCircle}
        title="WhatsApp"
        status={whatsapp?.status}
        detail={whatsapp?.businessName ?? whatsapp?.phone ?? "Nenhuma conta conectada"}
        lastSyncAt={whatsapp?.lastSyncAt}
        href="/whatsapp"
        loading={whatsappLoading}
        error={whatsappError}
      />
      <ChannelCard
        icon={Mail}
        title="E-mail"
        status={email?.status}
        detail={email?.senderEmail ?? email?.senderName ?? "Nenhum remetente configurado"}
        lastSyncAt={email?.lastSyncAt}
        href="/email"
        loading={emailLoading}
        error={emailError}
      />
    </div>
  );
}
