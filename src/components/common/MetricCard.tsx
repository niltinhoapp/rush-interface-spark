import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  delta?: string;
  trend?: "up" | "down";
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  hint,
  delta,
  trend = "up",
  icon: Icon,
  loading,
  className,
}: MetricCardProps) {
  if (loading) {
    return (
      <article className={cn("surface-panel rounded-2xl p-5", className)}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-6 h-8 w-32" />
        <Skeleton className="mt-3 h-3 w-20" />
      </article>
    );
  }

  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <article
      tabIndex={0}
      className={cn(
        "surface-panel group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:glow-ring focus-visible:-translate-y-0.5 focus-visible:glow-ring focus-visible:outline-none",
        className,
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:text-primary">
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-5 font-display text-[1.6rem] font-semibold leading-none tabular-nums sm:text-[1.75rem]">
        {value}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
              trend === "up" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            <TrendIcon className="size-3" />
            {delta}
          </span>
        ) : null}
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
    </article>
  );
}
