import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** true na primeira carga, false em recarregamentos. */
  initialLoading: boolean;
  refetch: () => void;
  setData: (updater: T | ((current: T | null) => T)) => void;
}

/**
 * Carregamento assíncrono genérico com loading, erro, dados e nova tentativa.
 * Executa somente no cliente (efeito), portanto é seguro em SSR.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = [],
): AsyncState<T> {
  const [data, setDataState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const loadedOnce = useRef(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((result) => {
        if (!active) return;
        loadedOnce.current = true;
        setDataState(result);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Não foi possível carregar os dados.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  const setData = useCallback((updater: T | ((current: T | null) => T)) => {
    setDataState((current) =>
      typeof updater === "function" ? (updater as (c: T | null) => T)(current) : updater,
    );
  }, []);

  return {
    data,
    loading,
    error,
    initialLoading: loading && !loadedOnce.current,
    refetch,
    setData,
  };
}
