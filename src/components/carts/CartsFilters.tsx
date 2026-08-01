import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { PeriodSelector } from "@/components/common/PeriodSelector";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cartStatusLabels, channelLabels } from "@/lib/labels";
import type { CartFilters as CartFiltersType } from "@/types/filters";
import type { CartRecoveryStatus, Channel } from "@/types";

const statusOptions: { value: string; label: string }[] = [
  { value: "todos", label: "Todos" },
  ...(Object.keys(cartStatusLabels) as CartRecoveryStatus[]).map((s) => ({
    value: s,
    label: cartStatusLabels[s],
  })),
];

const channelOptions: { value: string; label: string }[] = [
  { value: "todos", label: "Todos" },
  ...(Object.keys(channelLabels) as Channel[]).map((c) => ({ value: c, label: channelLabels[c] })),
];

export function CartsFilters({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filters: CartFiltersType;
  onFiltersChange: (patch: Partial<CartFiltersType>) => void;
}) {
  const isMobile = useIsMobile();

  const body = (
    <div className="grid gap-3">
      <SearchInput value={search} onChange={onSearchChange} placeholder="Buscar cliente…" />
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Status
        </p>
        <FilterTabs
          options={statusOptions}
          value={filters.status ?? "todos"}
          onChange={(value) =>
            onFiltersChange({ status: value === "todos" ? undefined : (value as CartRecoveryStatus) })
          }
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Canal
        </p>
        <FilterTabs
          options={channelOptions}
          value={filters.channel ?? "todos"}
          onChange={(value) =>
            onFiltersChange({ channel: value === "todos" ? undefined : (value as Channel) })
          }
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Período
        </p>
        <PeriodSelector
          value={filters.period ?? { preset: "30d" }}
          onChange={(period) => onFiltersChange({ period })}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileFiltersSheet search={search} onSearchChange={onSearchChange}>
        {body}
      </MobileFiltersSheet>
    );
  }

  return <div className="grid gap-4">{body}</div>;
}

function MobileFiltersSheet({
  search,
  onSearchChange,
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <SearchInput
          className="flex-1"
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar cliente…"
        />
        <button
          type="button"
          aria-label="Abrir filtros"
          onClick={() => setOpen(true)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
        </button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{children}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
