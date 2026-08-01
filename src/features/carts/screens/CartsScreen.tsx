import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/common/SectionCard";
import { MetricCard } from "@/components/common/MetricCard";
import { Pagination } from "@/components/common/Pagination";
import { ErrorState } from "@/components/common/ErrorState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { CartsFilters } from "@/components/carts/CartsFilters";
import { CartsTable } from "@/components/carts/CartsTable";
import { CartCardList } from "@/components/carts/CartCardList";
import { CartDetailDrawer } from "@/components/carts/CartDetailDrawer";
import { useCarts } from "@/hooks";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Cart } from "@/types";

export function CartsScreen() {
  const carts = useCarts();
  const isMobile = useIsMobile();
  const [detail, setDetail] = useState<Cart | null>(null);
  const [reprocessTarget, setReprocessTarget] = useState<Cart | null>(null);
  const [reprocessingId, setReprocessingId] = useState<string | null>(null);

  const { potential, recovered, recoveryRate } = useMemo(() => {
    const items = carts.items;
    const potentialSum = items
      .filter((c) => c.status !== "recuperado")
      .reduce((sum, c) => sum + c.value, 0);
    const recoveredSum = items.reduce((sum, c) => sum + c.recoveredValue, 0);
    const totalValue = items.reduce((sum, c) => sum + c.value, 0);
    return {
      potential: potentialSum,
      recovered: recoveredSum,
      recoveryRate: totalValue > 0 ? (recoveredSum / totalValue) * 100 : null,
    };
  }, [carts.items]);

  const handleCopyLink = (cart: Cart) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cart.recoveryLink).catch(() => {});
    }
    toast("Link de recuperação copiado", { description: cart.recoveryLink });
  };

  const handleReprocess = async () => {
    if (!reprocessTarget) return;
    const cart = reprocessTarget;
    setReprocessTarget(null);
    setReprocessingId(cart.id);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setReprocessingId(null);
    toast.success("Carrinho reprocessado", { description: cart.customer });
  };

  return (
    <AppShell title="Carrinhos abandonados" subtitle="Recuperação automática por WhatsApp e e-mail">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Valor potencial em aberto"
          value={formatCurrency(potential)}
          hint="carrinhos não recuperados"
          icon={ShoppingCart}
          loading={carts.initialLoading}
        />
        <MetricCard
          label="Recuperado"
          value={formatCurrency(recovered)}
          hint="no período carregado"
          loading={carts.initialLoading}
        />
        <MetricCard
          label="Taxa de recuperação"
          value={recoveryRate === null ? "—" : formatPercent(recoveryRate, 1)}
          hint="sobre o valor total"
          loading={carts.initialLoading}
        />
      </div>

      <SectionCard className="mt-4" bodyClassName="p-4 sm:p-5">
        <CartsFilters
          search={carts.filters.search ?? ""}
          onSearchChange={carts.setSearch}
          filters={carts.filters}
          onFiltersChange={carts.setFilters}
        />
      </SectionCard>

      <div className="surface-panel mt-4 overflow-hidden rounded-2xl">
        {carts.error ? (
          <ErrorState description={carts.error} onRetry={carts.refetch} />
        ) : isMobile ? (
          <CartCardList
            carts={carts.items}
            loading={carts.loading}
            onViewDetails={setDetail}
            onCopyLink={handleCopyLink}
            onReprocess={setReprocessTarget}
            reprocessingId={reprocessingId}
          />
        ) : (
          <CartsTable
            carts={carts.items}
            loading={carts.loading}
            onViewDetails={setDetail}
            onCopyLink={handleCopyLink}
            onReprocess={setReprocessTarget}
            reprocessingId={reprocessingId}
          />
        )}
        {!carts.error && carts.items.length > 0 ? (
          <Pagination
            page={carts.page}
            pageCount={carts.totalPages}
            total={carts.total}
            onPageChange={carts.setPage}
          />
        ) : null}
      </div>

      <CartDetailDrawer cart={detail} onOpenChange={(open) => !open && setDetail(null)} />

      <ConfirmDialog
        open={Boolean(reprocessTarget)}
        onOpenChange={(open) => !open && setReprocessTarget(null)}
        title="Reprocessar carrinho?"
        description={
          reprocessTarget
            ? `Isso vai reiniciar o fluxo de recuperação para ${reprocessTarget.customer}.`
            : ""
        }
        confirmLabel="Reprocessar"
        onConfirm={handleReprocess}
      />
    </AppShell>
  );
}
