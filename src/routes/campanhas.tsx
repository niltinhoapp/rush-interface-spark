import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { campaigns } from "@/data/mock";

export const Route = createFileRoute("/campanhas")({
  head: () => ({
    meta: [
      { title: "Campanhas — Nuvem Rush" },
      {
        name: "description",
        content: "Acompanhe status, investimento, receita e ROAS de cada campanha da sua loja.",
      },
      { property: "og:title", content: "Campanhas — Nuvem Rush" },
      {
        property: "og:description",
        content: "Status, investimento, receita e ROAS por campanha.",
      },
    ],
  }),
  component: Campanhas,
});

function statusClass(status: string) {
  if (status === "Ativa") return "bg-success/15 text-success";
  if (status === "Pausada") return "bg-muted text-muted-foreground";
  return "bg-warning/15 text-warning";
}

function Campanhas() {
  return (
    <DashboardLayout title="Campanhas" subtitle="5 campanhas · 3 ativas no período">
      <div className="surface-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-4 font-medium">Campanha</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Investimento</th>
                <th className="px-5 py-4 font-medium">Receita</th>
                <th className="px-5 py-4 font-medium">CTR</th>
                <th className="px-5 py-4 text-right font-medium">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.objective}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(c.status)}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c.spend}</td>
                  <td className="px-5 py-4">{c.revenue}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.ctr}</td>
                  <td className="px-5 py-4 text-right font-display font-semibold text-rush">
                    {c.roas.toFixed(1)}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
