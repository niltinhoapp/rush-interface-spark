import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrdersSortableHeader({
  label,
  field,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string;
  field: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort: (field: string) => void;
}) {
  const active = sortBy === field;
  const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      aria-sort={ariaSort as "ascending" | "descending" | "none"}
      className={cn(
        "flex min-h-6 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      <Icon aria-hidden className="size-3.5" />
    </button>
  );
}
