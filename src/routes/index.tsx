import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, TrendingDown, Sparkles, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, POPULAR_SEARCHES } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PricePair — Compare Walmart & Target Prices Instantly" },
      {
        name: "description",
        content:
          "Search everyday products and compare Walmart and Target prices side by side, with per-unit pricing, sale flags and smart savings tips.",
      },
      { property: "og:title", content: "PricePair — Compare Walmart & Target Prices" },
      {
        property: "og:description",
        content: "Find the cheapest store for your shopping list before you leave the house.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const go = (query: string) => {
    if (!query.trim()) return;
    navigate({ to: "/search", search: { q: query } });
  };

  return (
    <AppShell>
      <div className="-mx-5 -mt-4 gradient-hero px-5 pb-8 pt-8 text-primary-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">PricePair</p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">
          Know the cheaper store before you go.
        </h1>
        <p className="mt-2 text-sm opacity-90">
          Compare Walmart and Target prices on the things you buy every week.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(q);
          }}
          className="mt-5 flex items-center gap-2 rounded-2xl bg-card p-2 shadow-lg"
        >
          <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a product…"
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Compare
          </button>
        </form>
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-foreground">Popular searches</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((s) => (
            <button
              key={s}
              onClick={() => go(s)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <div className="card-soft p-3">
          <TrendingDown className="h-5 w-5 text-primary" />
          <p className="mt-2 font-display text-lg font-semibold">$14.80</p>
          <p className="text-[11px] text-muted-foreground">Potential savings this week</p>
        </div>
        <Link to="/list" className="card-soft p-3">
          <Sparkles className="h-5 w-5 text-accent" />
          <p className="mt-2 font-display text-lg font-semibold">Smart list</p>
          <p className="text-[11px] text-muted-foreground">Split your trip and save more</p>
        </Link>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Trending comparisons</h2>
          <Link to="/search" search={{ q: "" }} className="flex items-center gap-1 text-[12px] font-semibold text-primary">
            See all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
