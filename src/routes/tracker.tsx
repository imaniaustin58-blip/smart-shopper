import { createFileRoute, Link } from "@tanstack/react-router";
import { BellOff, TrendingDown, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cheapestOffer, getProduct, money } from "@/data/products";
import { useShopping } from "@/lib/shopping-store";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Price Tracker — ShopScout" },
      {
        name: "description",
        content: "Watch tracked products and see when Walmart or Target drops the price.",
      },
      { property: "og:title", content: "Price Tracker — ShopScout" },
      {
        property: "og:description",
        content: "Track price drops on the products you buy most.",
      },
    ],
  }),
  component: TrackerPage,
});

function TrackerPage() {
  const { tracked, toggleTracked } = useShopping();
  const products = tracked.map(getProduct).filter((p) => p !== undefined);

  return (
    <AppShell title="Price tracker" subtitle="Alerts when prices drop">
      {products.length === 0 ? (
        <div className="card-soft flex flex-col items-center gap-2 p-8 text-center">
          <BellOff className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-semibold">No products tracked</p>
          <p className="text-[12px] text-muted-foreground">
            Tap “Track price” on any comparison to watch it here.
          </p>
          <Link
            to="/search"
            search={{ q: "" }}
            className="mt-2 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground"
          >
            Find products
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => {
            const best = cheapestOffer(p);
            const prev = p.history[p.history.length - 2];
            const prevBest = Math.min(prev.walmart, prev.target);
            const delta = best.price - prevBest;
            const down = delta <= 0;
            return (
              <li key={p.id} className="card-soft flex items-center gap-3 p-3">
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-16 w-16 shrink-0 rounded-xl bg-muted object-contain"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/compare/$productId"
                    params={{ productId: p.id }}
                    className="block truncate text-[13px] font-semibold"
                  >
                    {p.brand} {p.name}
                  </Link>
                  <p className="mt-0.5 font-display text-lg font-semibold">
                    {money(best.price)}{" "}
                    <span className="text-[11px] font-medium text-muted-foreground">
                      at {best.retailer}
                    </span>
                  </p>
                  <p
                    className={`mt-0.5 flex items-center gap-1 text-[11px] font-semibold ${
                      down ? "text-save-foreground" : "text-target"
                    }`}
                  >
                    {down ? (
                      <TrendingDown className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingUp className="h-3.5 w-3.5" />
                    )}
                    {down ? "Down" : "Up"} {money(Math.abs(delta))} since last month
                  </p>
                </div>
                <button
                  onClick={() => toggleTracked(p.id)}
                  aria-label={`Stop tracking ${p.name}`}
                  className="rounded-lg p-2 text-muted-foreground"
                >
                  <BellOff className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-5 text-center text-[11px] text-muted-foreground">
        Prototype alerts use sample price history.
      </p>
    </AppShell>
  );
}
