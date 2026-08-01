import { AlertTriangle, ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import type { WhatsappConnection } from "@/types/connections";

export function WhatsappWarnings({ connection }: { connection: WhatsappConnection }) {
  const isHealthy = connection.status === "conectado";

  return (
    <SectionCard title="Saúde do canal" bodyClassName="space-y-3">
      {isHealthy ? (
        <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 p-3 text-success">
          <ShieldCheck className="size-4 shrink-0" />
          <p className="text-sm">Número verificado e operando normalmente.</p>
        </div>
      ) : null}
      {connection.warnings.length === 0 && isHealthy ? null : connection.warnings.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum aviso no momento.</p>
      ) : (
        connection.warnings.map((w) => (
          <div
            key={w}
            className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/10 p-3 text-warning"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm leading-relaxed">{w}</p>
          </div>
        ))
      )}
    </SectionCard>
  );
}
