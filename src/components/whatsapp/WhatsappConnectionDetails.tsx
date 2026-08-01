import { AlertTriangle, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { humanizeStatus } from "@/lib/labels";
import { formatDateTime, orNotProvided } from "@/lib/format";
import { maskPhone, maskSecret } from "@/lib/mask";
import type { WhatsappConnection } from "@/types/connections";

const qualityTone: Record<string, "success" | "warning" | "danger"> = {
  alta: "success",
  media: "warning",
  baixa: "danger",
};

export function WhatsappConnectionDetails({ connection }: { connection: WhatsappConnection }) {
  const isConnecting = connection.status === "conectando";

  return (
    <SectionCard
      title="Conexão"
      description="Número e conta comercial vinculados"
      actions={
        <StatusBadge label={humanizeStatus(connection.status)} tone={statusTones[connection.status] ?? "neutral"} />
      }
    >
      {isConnecting ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Estabelecendo conexão com a Meta…
        </div>
      ) : (
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["Número", maskPhone(connection.phone)],
            ["Conta comercial", orNotProvided(connection.businessName)],
            ["WABA ID", maskSecret(connection.wabaId)],
            ["Phone Number ID", maskSecret(connection.phoneNumberId)],
            [
              "Qualidade",
              connection.quality ? (
                <StatusBadge
                  key="quality"
                  label={humanizeStatus(connection.quality)}
                  tone={qualityTone[connection.quality] ?? "neutral"}
                />
              ) : (
                "—"
              ),
            ],
            ["Limite de envio", orNotProvided(connection.messagingLimit)],
            ["Status da conta", orNotProvided(connection.accountStatus)],
            ["Última sincronização", formatDateTime(connection.lastSyncAt)],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-xl border border-border bg-card p-3">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="mt-1 truncate text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {connection.error ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p className="text-sm leading-relaxed">{connection.error}</p>
        </div>
      ) : null}
    </SectionCard>
  );
}
