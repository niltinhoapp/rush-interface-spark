import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/common/SectionCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import type { RevenuePoint } from "@/types";

export function RevenueChart({
  data,
  loading,
}: {
  data: RevenuePoint[];
  loading: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <SectionCard title="Receita recuperada" description="Carrinhos e pós-venda">
      <div className="h-72 w-full">
        {loading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : data.length === 0 ? (
          <EmptyState title="Sem receita no período" description="Ainda não há dados de recuperação." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -14, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickFormatter={(v: number) => `${v / 1000}k`}
              />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--popover-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="receita"
                stroke="var(--chart-4)"
                strokeWidth={2}
                fill="url(#fillReceita)"
                isAnimationActive={!reducedMotion}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}
