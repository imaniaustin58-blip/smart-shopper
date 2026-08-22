import { Link } from "@tanstack/react-router";
import { Search, ListChecks, Bell, User, Home } from "lucide-react";
import type { ReactNode } from "react";
import { useShopping } from "@/lib/shopping-store";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/list", label: "List", icon: ListChecks },
  { to: "/tracker", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { list, tracked } = useShopping();
  const counts: Record<string, number> = { "/list": list.length, "/tracker": tracked.length };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      {title && (
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 px-5 pb-3 pt-5 backdrop-blur-md">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </header>
      )}
      <main className="flex-1 px-5 pb-28 pt-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <ul className="flex items-stretch justify-between px-2 py-2">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ "data-active": "true" }}
                className="group relative flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors data-[active=true]:text-primary"
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  {counts[to] ? (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                      {counts[to]}
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
