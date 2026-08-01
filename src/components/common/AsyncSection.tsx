import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";

/**
 * Encapsula os estados obrigatórios de toda tela:
 * carregando, erro com nova tentativa, vazio e sucesso.
 */
export function AsyncSection({
  loading,
  error,
  empty,
  onRetry,
  skeleton,
  emptyTitle = "Nada por aqui",
  emptyDescription,
  emptyAction,
  children,
}: {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  onRetry?: () => void;
  skeleton?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}) {
  if (error) return <ErrorState description={error} onRetry={onRetry} />;
  if (loading) {
    return (
      <div aria-busy="true" aria-live="polite">
        {skeleton ?? <SkeletonRows />}
      </div>
    );
  }
  if (empty) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
    );
  }
  return <>{children}</>;
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={`row-${index}`} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={`card-${index}`} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
  );
}
