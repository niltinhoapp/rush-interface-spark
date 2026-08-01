import { Mail, MessageCircle } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { SkeletonRows } from "@/components/common/AsyncSection";
import { formatNumber, formatPercent } from "@/lib/format";
import { channelLabels } from "@/lib/labels";
import type { ChannelSummary } from "@/types";

export function ChannelSummaryList({
  channels,
  loading,
}: {
  channels: ChannelSummary[];
  loading: boolean;
}) {
  return (
    <SectionCard title="Resumo por canal" bodyClassName="space-y-3">
      {loading ? (
        <SkeletonRows rows={2} />
      ) : channels.length === 0 ? (
        <EmptyState title="Sem envios no período" />
      ) : (
        channels.map((c) => {
          const Icon = c.channel === "whatsapp" ? MessageCircle : Mail;
          return (
            <div key={c.channel} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                  <Icon aria-hidden className="size-4 shrink-0 text-primary" />
                  <span className="truncate">{channelLabels[c.channel]}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  leitura {formatPercent(c.readRate)}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { k: "Enviadas", v: formatNumber(c.sent) },
                  { k: "Entregues", v: formatNumber(c.delivered) },
                  { k: "Erros", v: formatNumber(c.failed) },
                ].map((s) => (
                  <div key={s.k} className="rounded-lg bg-secondary/60 py-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</dt>
                    <dd className="mt-0.5 text-sm font-semibold tabular-nums">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })
      )}
    </SectionCard>
  );
}
