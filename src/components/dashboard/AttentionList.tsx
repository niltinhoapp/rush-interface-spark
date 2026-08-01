import { AlertTriangle } from "lucide-react";
import { AppLink } from "@/components/common/AppLink";
import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonRows } from "@/components/common/AsyncSection";
import type { Automation } from "@/types";

export function AttentionList({
  attention,
  loading,
}: {
  attention: Automation[];
  loading: boolean;
}) {
  return (
    <SectionCard
      title="Precisam de atenção"
      description="Automações com falha ou baixo desempenho"
      bodyClassName="space-y-3"
      actions={
        <AppLink
          to="/automacoes"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Ver todas
        </AppLink>
      }
    >
      {loading ? (
        <SkeletonRows rows={2} />
      ) : attention.length === 0 ? (
        <EmptyState title="Tudo em ordem" description="Nenhuma automação precisa de atenção agora." />
      ) : (
        attention.map((a) => (
          <AppLink
            key={a.id}
            to={`/automacoes/${a.id}`}
            className="block rounded-xl border border-border border-l-2 border-l-warning bg-card p-4 transition-colors hover:bg-secondary/40"
          >
            <p className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle aria-hidden className="size-4 shrink-0 text-warning" />
              <span className="truncate">{a.name}</span>
            </p>
            {a.needsAttention ? (
              <p className="mt-1 truncate text-xs leading-relaxed text-muted-foreground">
                {a.needsAttention}
              </p>
            ) : null}
          </AppLink>
        ))
      )}
    </SectionCard>
  );
}
