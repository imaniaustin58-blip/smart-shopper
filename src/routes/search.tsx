import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, SearchX, CircleAlert as AlertCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { WalmartLiveCard, WalmartLiveError, WalmartLiveLoading } from "@/components/WalmartLiveCard";
import { searchProducts, type ProductGroup } from "@/data/products";
import { searchWalmart } from "@/lib/walmart-search";

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
  const mockResults = searchProducts(q);

  const walmartQuery = useQuery({
    queryKey: ["walmart-search", q],
    queryFn: () => searchWalmart(q),
    enabled: q.trim().length > 0,
    staleTime: 60_000,
  });

  const hasWalmartResults = walmartQuery.data?.results && walmartQuery.data.results.length > 0;
  const walmartError = walmartQuery.data?.error;
  const showWalmartError = walmartError && !hasWalmartResults;

  return (
    <AppShell title="Search results" subtitle={q ? `"${q}"` : "All tracked products"}>
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

      {q.trim() && (
        <section className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Walmart results</h2>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-walmart">
              Live Walmart Data
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {walmartQuery.isLoading && <WalmartLiveLoading />}

            {walmartQuery.isError && (
              <WalmartLiveError message="Live Walmart pricing is temporarily unavailable." />
            )}

            {showWalmartError && <WalmartLiveError message={walmartError!} />}

            {hasWalmartResults &&
              walmartQuery.data!.results.map((product) => (
                <WalmartLiveCard key={product.productId} product={product} />
              ))}

            {walmartQuery.isSuccess &&
              !hasWalmartResults &&
              !walmartError &&
              walmartQuery.data &&
              walmartQuery.data.results.length === 0 && (
                <div className="card-soft flex flex-col items-center gap-2 p-6 text-center">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-semibold">No live Walmart matches found</p>
                  <p className="text-[12px] text-muted-foreground">
                    Try a more specific search term.
                  </p>
                </div>
              )}
          </div>
        </section>
      )}

      <section className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Target results</h2>
          <span className="rounded-full bg-target/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-target">
            Sample Data
          </span>
        </div>

        <p className="mt-2 text-[12px] text-muted-foreground">
          {mockResults.length} product{mockResults.length === 1 ? "" : "s"} · sample pricing
        </p>

        <div className="mt-3 space-y-3">
          {mockResults.map((p: ProductGroup) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {mockResults.length === 0 && (
          <div className="card-soft mt-3 flex flex-col items-center gap-2 p-8 text-center">
            <SearchX className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-semibold">No sample matches</p>
            <p className="text-[12px] text-muted-foreground">
              Try "Tide", "Coca-Cola", "Bounty" or "Dove".
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
