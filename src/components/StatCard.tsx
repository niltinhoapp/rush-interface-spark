import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Trend } from "@/data/mock";

export function StatCard({
  label,
  value,
  delta,
  trend,
  hint,
}: {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  hint: string;
}) {
  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <article
      tabIndex={0}
      className="surface-panel group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:glow-ring focus-visible:-translate-y-0.5 focus-visible:glow-ring focus-visible:outline-none"
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          trend === "up" ? "bg-success/60" : "bg-destructive/60"
        }`}
      />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <span
          className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
            trend === "up" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          }`}
        >
          <Icon className="size-3 shrink-0" />
          {delta}
        </span>
      </div>
      <p className="mt-5 font-display text-[1.75rem] font-semibold leading-none tabular-nums sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </article>
  );
}
