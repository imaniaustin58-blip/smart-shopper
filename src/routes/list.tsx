import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBasket, SquareSplitHorizontal as SplitSquareHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AssistantCard } from "@/components/AssistantCard";
import { RetailerTag } from "@/components/RetailerTag";
import { getProduct, money, offerFor } from "@/data/products";
import { useShopping } from "@/lib/shopping-store";

export const Route = createFileRoute("/list")({
  head: () => ({
    meta: [
      { title: "Shopping List Comparison — ShopScout" },
      {
        name: "description",
        content:
          "See your estimated Walmart and Target totals, the cheapest store overall, and how much a split trip would save.",
      },
      { property: "og:title", content: "Shopping List Comparison — ShopScout" },
      {
        property: "og:description",
        content: "Compare basket totals across Walmart and Target before you shop.",
      },
    ],
  }),
  component: ListPage,
});

function ListPage() {
  const { list, toggleList, clearList } = useShopping();
  const products = list.map(getProduct).filter((p) => p !== undefined);

  const walmartTotal = products.reduce((s, p) => s + offerFor(p, "Walmart").price, 0);
  const targetTotal = products.reduce((s, p) => s + offerFor(p, "Target").price, 0);
  const splitTotal = products.reduce(
    (s, p) => s + Math.min(offerFor(p, "Walmart").price, offerFor(p, "Target").price),
    0,
  );
  const cheapestStore = walmartTotal <= targetTotal ? "Walmart" : "Target";
  const singleStoreTotal = Math.min(walmartTotal, targetTotal);
  const savings = Math.max(walmartTotal, targetTotal) - singleStoreTotal;
  const splitSavings = singleStoreTotal - splitTotal;

  return (
    <AppShell title="Shopping list" subtitle={`${products.length} item${products.length === 1 ? "" : "s"}`}>
      {products.length === 0 ? (
        <div className="card-soft flex flex-col items-center gap-2 p-8 text-center">
          <ShoppingBasket className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm font-semibold">Your list is empty</p>
          <p className="text-[12px] text-muted-foreground">
            Add products from a comparison to see basket totals.
          </p>
          <Link
            to="/search"
            search={{ q: "" }}
            className="mt-2 rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3">
            {(["Walmart", "Target"] as const).map((r) => {
              const total = r === "Walmart" ? walmartTotal : targetTotal;
              const isBest = r === cheapestStore;
              return (
                <div
                  key={r}
                  className={`card-soft p-3 ${isBest ? "border-primary ring-2 ring-primary/20" : ""}`}
                >
                  <RetailerTag retailer={r} />
                  <p className="mt-2 font-display text-2xl font-semibold">{money(total)}</p>
                  <p className="text-[11px] text-muted-foreground">Estimated basket total</p>
                </div>
              );
            })}
          </section>

          <section className="card-soft mt-3 flex items-center justify-between p-4">
            <div>
              <p className="text-[12px] text-muted-foreground">Cheapest store overall</p>
              <p className="font-display text-lg font-semibold">{cheapestStore}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-muted-foreground">You save</p>
              <p className="font-display text-lg font-semibold text-save-foreground">
                {money(savings)}
              </p>
            </div>
          </section>

          {splitSavings > 0.5 && (
            <section className="card-soft mt-3 flex gap-3 p-4">
              <SplitSquareHorizontal className="h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold">Split the trip and save {money(splitSavings)}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Buying each item at its cheaper store brings your total to {money(splitTotal)}.
                </p>
              </div>
            </section>
          )}

          <h2 className="mt-5 text-sm font-semibold">Item by item</h2>
          <ul className="mt-3 space-y-3">
            {products.map((p) => {
              const w = offerFor(p, "Walmart");
              const t = offerFor(p, "Target");
              const cheaper = w.price <= t.price ? "Walmart" : "Target";
              return (
                <li key={p.id} className="card-soft flex items-center gap-3 p-3">
                  <img
                    src={p.image}
                    alt={`${p.brand} ${p.name}`}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="h-14 w-14 shrink-0 rounded-lg bg-muted object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">
                      {p.brand} {p.name}
                    </p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      W {money(w.price)} · T {money(t.price)}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-save-foreground">
                      Cheaper at {cheaper}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleList(p.id)}
                    aria-label={`Remove ${p.name} from list`}
                    className="rounded-lg p-2 text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4">
            <AssistantCard
              title="Assistant basket summary"
              tips={[
                `${cheapestStore} is the cheapest single-store trip at ${money(singleStoreTotal)}.`,
                splitSavings > 0.5
                  ? `Splitting between both stores saves an extra ${money(splitSavings)}.`
                  : "A split trip wouldn't save enough to be worth the second stop.",
                "Swapping two items for store brands could cut roughly $6 more.",
              ]}
            />
          </div>

          <button
            onClick={clearList}
            className="mt-4 w-full rounded-xl border border-border bg-card py-3 text-[13px] font-semibold text-muted-foreground"
          >
            Clear list
          </button>
        </>
      )}
    </AppShell>
  );
}
