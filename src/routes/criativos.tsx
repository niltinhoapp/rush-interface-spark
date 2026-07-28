import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { creatives } from "@/data/mock";

export const Route = createFileRoute("/criativos")({
  head: () => ({
    meta: [
      { title: "Criativos — Nuvem Rush" },
      {
        name: "description",
        content: "Desempenho de criativos: CTR, CPA e score de fadiga por peça publicitária.",
      },
      { property: "og:title", content: "Criativos — Nuvem Rush" },
      {
        property: "og:description",
        content: "CTR, CPA e score de fadiga por criativo.",
      },
    ],
  }),
  component: Criativos,
});

function Criativos() {
  return (
    <DashboardLayout title="Criativos" subtitle="4 peças ativas · score calculado nas últimas 72h">
      <div className="grid gap-4 md:grid-cols-2">
        {creatives.map((c) => (
          <article key={c.id} className="surface-panel rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">{c.name}</h2>
                <p className="text-xs text-muted-foreground">{c.format}</p>
              </div>
              <span className="font-display text-2xl font-semibold text-rush">{c.score}</span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-rush" style={{ width: `${c.score}%` }} />
            </div>
            <div className="mt-4 flex gap-8 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">CTR</p>
                <p className="mt-1 font-medium">{c.ctr}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CPA</p>
                <p className="mt-1 font-medium">{c.cpa}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
}
