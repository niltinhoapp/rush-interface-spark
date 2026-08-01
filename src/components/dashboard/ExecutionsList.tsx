import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonRows } from "@/components/common/AsyncSection";
import { StatusBadge, humanize, statusTones } from "@/components/common/StatusBadge";
import { channelLabels } from "@/lib/labels";
import { formatDateTime } from "@/lib/format";
import type { ExecutionLog } from "@/types";

export function ExecutionsList({
  executions,
  loading,
}: {
  executions: ExecutionLog[];
  loading: boolean;
}) {
  return (
    <SectionCard
      title="Últimas execuções"
      description="Disparos mais recentes"
      bodyClassName="divide-y divide-border/70 p-0 px-5 sm:px-6"
    >
      {loading ? (
        <div className="py-4">
          <SkeletonRows rows={3} />
        </div>
      ) : executions.length === 0 ? (
        <div className="py-6">
          <EmptyState title="Nenhuma execução recente" />
        </div>
      ) : (
        executions.map((e) => (
          <div key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{e.automation}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {e.customer} · {channelLabels[e.channel]} · {formatDateTime(e.at)}
              </p>
            </div>
            <StatusBadge label={humanize(e.status)} tone={statusTones[e.status]} />
          </div>
        ))
      )}
    </SectionCard>
  );
}
