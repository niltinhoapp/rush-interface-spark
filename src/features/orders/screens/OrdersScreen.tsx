import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useOrders } from "@/hooks";
import { SectionCard } from "@/components/common/SectionCard";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/format";
import type { PaymentStatus, PeriodFilter, ShippingStatus } from "@/types";
import { OrdersFilterControls } from "@/components/orders/OrdersFilterControls";
import { OrdersTable } from "@/components/orders/OrdersTable";

const AUTOMATION_OPTIONS = [
  "Pedido enviado + rastreio",
  "Confirmação de pagamento",
  "Lembrete de pagamento",
  "Pedido cancelado — recuperação",
  "Pesquisa de satisfação",
];

export function OrdersScreen() {
  const orders = useOrders({ period: { preset: "30d" } });
  const [query, setQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFiltersCount = useMemo(
    () =>
      [orders.filters.payment, orders.filters.shipping, orders.filters.automation].filter(Boolean)
        .length,
    [orders.filters.payment, orders.filters.shipping, orders.filters.automation],
  );

  function handleSearch(value: string) {
    setQuery(value);
    orders.setSearch(value);
  }

  const filterControls = (
    <OrdersFilterControls
      filters={orders.filters}
      automationOptions={AUTOMATION_OPTIONS}
      onChangePayment={(payment) => orders.setFilters({ payment })}
      onChangeShipping={(shipping) => orders.setFilters({ shipping })}
      onChangeAutomation={(automation) => orders.setFilters({ automation })}
      onChangePeriod={(period: PeriodFilter) => orders.setFilters({ period })}
    />
  );

  return (
    <div className="space-y-4">
      <SectionCard bodyClassName="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <SearchInput
            value={query}
            onChange={handleSearch}
            placeholder="Buscar por número do pedido ou cliente…"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setMobileFiltersOpen(true)}
            className="min-h-11 lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filtros
            {activeFiltersCount > 0 ? (
              <span className="rounded-full bg-primary/15 px-1.5 text-xs text-primary">
                {activeFiltersCount}
              </span>
            ) : null}
          </Button>
        </div>
        <div className="mt-4 hidden lg:block">{filterControls}</div>
      </SectionCard>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Filtros de pedidos</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{filterControls}</div>
        </SheetContent>
      </Sheet>

      <div className="surface-panel overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <p className="text-sm text-muted-foreground">
            {pluralize(orders.total, "pedido encontrado", "pedidos encontrados")}
          </p>
        </div>
        <OrdersTable
          orders={orders.items}
          loading={orders.initialLoading}
          error={orders.error}
          isEmpty={orders.isEmpty}
          onRetry={orders.refetch}
          sortBy={orders.filters.sortBy}
          sortDir={orders.filters.sortDir}
          onSort={orders.sort}
        />
        {!orders.isEmpty && !orders.error ? (
          <Pagination
            page={orders.page}
            pageCount={orders.totalPages}
            total={orders.total}
            onPageChange={orders.setPage}
          />
        ) : null}
      </div>
    </div>
  );
}
