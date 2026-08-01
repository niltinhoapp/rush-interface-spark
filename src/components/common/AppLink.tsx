import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useNavigation } from "@/adapters/navigation";
import { cn } from "@/lib/utils";

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  children: ReactNode;
  replace?: boolean;
};

/**
 * Link abstrato: renderiza uma âncora real (SEO, teclado, botão do meio)
 * e navega pelo NavigationAdapter — sem acoplar a nenhum roteador.
 */
export function AppLink({ to, children, className, replace, onClick, ...rest }: AppLinkProps) {
  const navigation = useNavigation();

  return (
    <a
      href={to}
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        event.preventDefault();
        if (replace) navigation.replace(to);
        else navigation.push(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
