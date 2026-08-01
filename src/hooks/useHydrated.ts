import { useEffect, useState } from "react";

/** true somente após a hidratação — use antes de tocar em APIs do navegador. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
