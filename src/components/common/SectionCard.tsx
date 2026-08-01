import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  actions,
  children,
  bodyClassName,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
  className?: string;
}) {
  return (
    <section className={cn("surface-panel overflow-hidden rounded-2xl", className)}>
      {title ? (
        <header className="grid gap-3 border-b border-border px-5 py-4 sm:flex sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-semibold sm:text-lg">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </section>
  );
}
