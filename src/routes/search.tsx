import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, SearchX } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/data/products";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Search Results — PricePair" },
      {
        name: "description",
        content: "Walmart and Target matches for your search, ranked by price and price per unit.",
      },
      { property: "og:title", content: "Search Results — PricePair" },
      {
        property: "og:description",
        content: "Side-by-side Walmart and Target pricing for everyday products.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q);
  const results = searchProducts(q);

  return (
    <AppShell title="Search results" subtitle={q ? `“${q}”` : "All tracked products"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/search", search: { q: input } });
        }}
        className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2"
      >
        <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search a product…"
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>

      <p className="mt-4 text-[12px] text-muted-foreground">
        {results.length} product{results.length === 1 ? "" : "s"} · prices from Walmart & Target
      </p>

      <div className="mt-3 space-y-3">
        {results.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="card-soft mt-6 flex flex-col items-center gap-2 p-8 text-center">
          <SearchX className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-semibold">No matches yet</p>
          <p className="text-[12px] text-muted-foreground">
            Try “Tide”, “Coca-Cola”, “Bounty” or “Dove”.
          </p>
        </div>
      )}
    </AppShell>
  );
}
