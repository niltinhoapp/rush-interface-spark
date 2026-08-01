import { useEffect, useState, type ReactNode } from "react";
import { Bell, CloudLightning, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "./nav-items";
import { AppLink } from "@/components/common/AppLink";
import { isPathActive, useNavigation } from "@/adapters/navigation";

export interface ChannelIndicator {
  name: string;
  connected: boolean;
  detail?: string;
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-rush text-primary-foreground">
        <CloudLightning aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate font-display text-base font-semibold">Nuvem Rush</p>
        <p className="truncate text-xs text-muted-foreground">Automações Nuvemshop</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const navigation = useNavigation();
  const pathname = navigation.currentPath();

  return (
    <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-6 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {group.label}
          </p>
          <ul className="mt-2 space-y-1">
            {group.items.map((item) => {
              const active = isPathActive(pathname, item.url);
              return (
                <li key={item.url}>
                  <AppLink
                    to={item.url}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon aria-hidden className="size-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                    {active ? (
                      <span aria-hidden className="ml-auto size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function ChannelStatus({ channels }: { channels: ChannelIndicator[] }) {
  if (channels.length === 0) return null;
  return (
    <div className="mt-6 space-y-2 rounded-2xl border border-border bg-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Canais
      </p>
      {channels.map((channel) => (
        <div key={channel.name} className="flex items-center justify-between gap-2 text-sm">
          <span className="truncate text-muted-foreground">{channel.name}</span>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1.5 text-xs font-medium",
              channel.connected ? "text-success" : "text-muted-foreground",
            )}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            {channel.connected ? "Conectado" : "Desconectado"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  breadcrumb,
  channels = [],
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  channels?: ChannelIndicator[];
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigation = useNavigation();
  const pathname = navigation.currentPath();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-full w-full bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Brand />
        <div className="mt-8 flex flex-1 flex-col">
          <NavList />
        </div>
        <ChannelStatus channels={channels} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            tabIndex={-1}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
            className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-sidebar-border bg-sidebar px-4 py-6"
          >
            <div className="flex items-start justify-between gap-3">
              <Brand />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={() => setMobileOpen(false)}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
            <div className="mt-8 flex flex-1 flex-col">
              <NavList onNavigate={() => setMobileOpen(false)} />
            </div>
            <ChannelStatus channels={channels} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:grid-cols-[minmax(0,1fr)_auto] lg:px-8 lg:py-4">
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground lg:hidden"
          >
            <Menu aria-hidden className="size-4" />
          </button>

          <div className="min-w-0">
            {breadcrumb ? <div className="mb-1 text-xs text-muted-foreground">{breadcrumb}</div> : null}
            <h1 className="truncate font-display text-lg font-semibold sm:text-xl lg:text-2xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <button
              type="button"
              aria-label="Notificações"
              className="relative hidden size-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <Bell aria-hidden className="size-4" />
              <span aria-hidden className="absolute right-3 top-3 size-2 rounded-full bg-accent" />
            </button>
            <div className="hidden items-center gap-3 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3 xl:flex">
              <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-xs font-semibold">
                LR
              </span>
              <div className="text-left">
                <p className="text-xs font-medium leading-tight">Loja Rush</p>
                <p className="text-[11px] leading-tight text-muted-foreground">Plano Pro</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-5 lg:px-8 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
