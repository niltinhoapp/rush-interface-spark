import { CalendarRange } from "lucide-react";
import { periodLabels } from "@/lib/labels";
import type { PeriodFilter, PeriodPreset } from "@/types/filters";
import { cn } from "@/lib/utils";

const presets: PeriodPreset[] = ["hoje", "7d", "30d", "custom"];

export function PeriodSelector({
  value,
  onChange,
  className,
}: {
  value: PeriodFilter;
  onChange: (value: PeriodFilter) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div
        className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1"
        role="group"
        aria-label="Selecionar período"
      >
        <CalendarRange aria-hidden className="ml-2 size-4 shrink-0 text-muted-foreground" />
        {presets.map((preset) => {
          const active = value.preset === preset;
          return (
            <button
              key={preset}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ ...value, preset })}
              className={cn(
                "min-h-9 rounded-lg px-3 text-sm transition-colors",
                active
                  ? "bg-primary/15 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {periodLabels[preset]}
            </button>
          );
        })}
      </div>

      {value.preset === "custom" ? (
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="sr-only sm:not-sr-only">De</span>
            <input
              type="date"
              value={value.from ?? ""}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              aria-label="Data inicial"
              className="min-h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="sr-only sm:not-sr-only">até</span>
            <input
              type="date"
              value={value.to ?? ""}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              aria-label="Data final"
              className="min-h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
