import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Megaphone,
  Package,
  Sparkles,
  Settings,
  Search,
  Bell,
  CloudLightning,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { title: "Visão geral", url: "/", icon: LayoutDashboard },
  { title: "Campanhas", url: "/campanhas", icon: Megaphone },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Criativos", url: "/criativos", icon: Sparkles },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
] as const;

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
      <div className="flex items-center gap-3 px-2">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-rush text-primary-foreground">
          <CloudLightning className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold">Nuvem Rush</p>
          <p className="text-xs text-muted-foreground">Performance suite</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground glow-ring"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="surface-panel rounded-2xl p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Meta de ROAS</p>
        <p className="mt-2 font-display text-2xl font-semibold text-rush">4,30x</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-[86%] rounded-full bg-rush" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">86% do objetivo do mês</p>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border bg-sidebar px-3 py-2 lg:hidden">
      {nav.map((item) => {
        const active = pathname === item.url;
        return (
          <Link
            key={item.url}
            to={item.url}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs transition-colors ${
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
            }`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <header className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-5 lg:px-8">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
            <Search className="size-4" />
            <span>Buscar campanha, produto…</span>
          </div>
          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Notificações"
          >
            <Bell className="size-4" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-xs font-semibold">
              LR
            </span>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium leading-tight">Loja Rush</p>
              <p className="text-[11px] leading-tight text-muted-foreground">Plano Pro</p>
            </div>
          </div>
          {actions}
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
