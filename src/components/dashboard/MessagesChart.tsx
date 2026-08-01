import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import type { MetricPoint } from "@/types";

export function MessagesChart({
  data,
  loading,
}: {
  data: MetricPoint[];
  loading: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <SectionCard
      className="xl:col-span-2"
      title="Mensagens enviadas por período"
      description="WhatsApp e e-mail"
    >
      <div className="h-72 w-full">
        {loading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : data.length === 0 ? (
          <EmptyState title="Sem dados de mensagens" description="Nenhum envio no período selecionado." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="whatsapp"
                name="WhatsApp"
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
                isAnimationActive={!reducedMotion}
              />
              <Bar
                dataKey="email"
                name="E-mail"
                fill="var(--chart-3)"
                radius={[6, 6, 0, 0]}
                isAnimationActive={!reducedMotion}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}
