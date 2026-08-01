import { useCallback, useMemo, useState } from "react";
import type { BaseFilters, PaginatedResult } from "@/types/filters";
import { useAsyncData } from "./useAsyncData";

export interface ListResource<T, F extends BaseFilters> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  filters: F;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  setFilters: (patch: Partial<F>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  sort: (field: string) => void;
  refetch: () => void;
}

/**
 * Lista paginada com filtros, busca, ordenação, estado vazio e nova tentativa.
 * Independente de biblioteca de dados — recebe apenas uma função de serviço.
 */
export function useListResource<T, F extends BaseFilters>(
  fetcher: (filters: F) => Promise<PaginatedResult<T>>,
  initialFilters: F,
): ListResource<T, F> {
  const [filters, setFiltersState] = useState<F>({
    page: 1,
    pageSize: 8,
    ...initialFilters,
  });

  const key = JSON.stringify(filters);
  const { data, loading, initialLoading, error, refetch } = useAsyncData<PaginatedResult<T>>(
    () => fetcher(filters),
    [key],
  );

  const setFilters = useCallback((patch: Partial<F>) => {
    setFiltersState((current) => ({ ...current, page: 1, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({ page: 1, pageSize: 8, ...initialFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialFilters)]);

  const setPage = useCallback((page: number) => {
    setFiltersState((current) => ({ ...current, page }));
  }, []);

  const setSearch = useCallback(
    (search: string) => setFilters({ search } as Partial<F>),
    [setFilters],
  );

  const sort = useCallback((field: string) => {
    setFiltersState((current) => ({
      ...current,
      page: 1,
      sortBy: field,
      sortDir: current.sortBy === field && current.sortDir === "asc" ? "desc" : "asc",
    }));
  }, []);

  return useMemo(
    () => ({
      items: data?.data ?? [],
      page: data?.page ?? filters.page ?? 1,
      pageSize: data?.pageSize ?? filters.pageSize ?? 8,
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      filters,
      loading,
      initialLoading,
      error,
      isEmpty: !loading && !error && (data?.data.length ?? 0) === 0,
      setFilters,
      resetFilters,
      setPage,
      setSearch,
      sort,
      refetch,
    }),
    [
      data,
      filters,
      loading,
      initialLoading,
      error,
      setFilters,
      resetFilters,
      setPage,
      setSearch,
      sort,
      refetch,
    ],
  );
}
