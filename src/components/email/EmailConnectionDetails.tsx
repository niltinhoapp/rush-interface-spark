import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge, statusTones } from "@/components/common/StatusBadge";
import { humanizeStatus } from "@/lib/labels";
import { orNotProvided } from "@/lib/format";
import { maskEmail } from "@/lib/mask";
import type { EmailConnection } from "@/types/connections";

const verificationTone: Record<string, "success" | "warning" | "danger"> = {
  verificado: "success",
  pendente: "warning",
  falhou: "danger",
};

export function EmailConnectionDetails({
  connection,
  onEdit,
}: {
  connection: EmailConnection;
  onEdit: () => void;
}) {
  return (
    <SectionCard
      title="Remetente"
      description="Identidade usada nos envios"
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge label={humanizeStatus(connection.status)} tone={statusTones[connection.status] ?? "neutral"} />
          <button
            type="button"
            onClick={onEdit}
            className="min-h-9 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Editar
          </button>
        </div>
      }
    >
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          ["Nome do remetente", orNotProvided(connection.senderName)],
          ["E-mail do remetente", maskEmail(connection.senderEmail)],
          ["E-mail de resposta", maskEmail(connection.replyTo)],
          ["Provedor", orNotProvided(connection.provider)],
          ["Domínio", orNotProvided(connection.domain)],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-xl border border-border bg-card p-3">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
            <dd className="mt-1 truncate text-sm font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Domínio verificado</p>
          <div className="mt-1.5">
            <StatusBadge
              label={connection.domainVerified ? "Verificado" : "Pendente"}
              tone={connection.domainVerified ? "success" : "warning"}
            />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">SPF</p>
          <div className="mt-1.5">
            <StatusBadge label={humanizeStatus(connection.spf)} tone={verificationTone[connection.spf]} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">DKIM</p>
          <div className="mt-1.5">
            <StatusBadge label={humanizeStatus(connection.dkim)} tone={verificationTone[connection.dkim]} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
