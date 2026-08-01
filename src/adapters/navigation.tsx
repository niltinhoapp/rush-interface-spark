/**
 * Adaptador de navegação — desacopla os componentes visuais do roteador.
 * No Next.js App Router basta fornecer outra implementação deste contrato.
 */
import { createContext, useContext, type ReactNode } from "react";

export interface NavigationAdapter {
  push(path: string): void;
  replace(path: string): void;
  back(): void;
  currentPath(): string;
}

const noopAdapter: NavigationAdapter = {
  push: () => {},
  replace: () => {},
  back: () => {},
  currentPath: () => "/",
};

const NavigationContext = createContext<NavigationAdapter>(noopAdapter);

export function NavigationProvider({
  adapter,
  children,
}: {
  adapter: NavigationAdapter;
  children: ReactNode;
}) {
  return <NavigationContext.Provider value={adapter}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationAdapter {
  return useContext(NavigationContext);
}

/** true quando `path` é o caminho atual (ou um prefixo dele, para seções). */
export function isPathActive(currentPath: string, path: string): boolean {
  if (path === "/") return currentPath === "/";
  return currentPath === path || currentPath.startsWith(`${path}/`);
}
