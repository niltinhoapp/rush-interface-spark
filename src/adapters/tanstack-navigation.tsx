/**
 * Implementação do NavigationAdapter para o TanStack Router.
 * Este é o ÚNICO arquivo da UI que conhece o roteador atual.
 * Ao migrar para o Next.js, substitua por uma versão com `useRouter`/`usePathname`.
 */
import { useMemo, type ReactNode } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { NavigationProvider, type NavigationAdapter } from "./navigation";

export function TanstackNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const adapter = useMemo<NavigationAdapter>(
    () => ({
      push: (path) => {
        void router.navigate({ to: path });
      },
      replace: (path) => {
        void router.navigate({ to: path, replace: true });
      },
      back: () => {
        router.history.back();
      },
      currentPath: () => pathname,
    }),
    [router, pathname],
  );

  return <NavigationProvider adapter={adapter}>{children}</NavigationProvider>;
}
