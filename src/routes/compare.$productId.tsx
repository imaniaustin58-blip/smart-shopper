import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bell, BellRing, Check, ExternalLink, Plus, Tag, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AssistantCard } from "@/components/AssistantCard";
import { RetailerTag } from "@/components/RetailerTag";
import { cheapestOffer, getProduct, money, unitPrice, type Offer } from "@/data/products";
import { useShopping } from "@/lib/shopping-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — PricePair" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.brand} ${product.name} — Walmart vs Target | PricePair`;
    const description = `Compare ${product.brand} ${product.name} prices at Walmart and Target, including price per ${product.offers[0].unitLabel}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ComparePage,
});

function OfferBlock({
  offer,
  best,
  productName,
}: {
  offer: Offer;
  best: boolean;
  productName: string;
}) {
  return (
    <div
      className={cn(
        "card-soft flex flex-col gap-2 p-3",
        best && "border-primary ring-2 ring-primary/20",
      )}
    >
      <div className="flex items-center justify-between">
        <RetailerTag retailer={offer.retailer} />
        {best && (
          <span className="rounded-full bg-save px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-save-foreground">
            Cheapest
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-semibold">{money(offer.price)}</p>
      {offer.onSale && (
        <p className="flex items-center gap-1 text-[11px] font-semibold text-accent-foreground">
          <Tag className="h-3 w-3" /> On sale
          {offer.wasPrice && (
            <span className="font-normal text-muted-foreground line-through">
              {money(offer.wasPrice)}
            </span>
          )}
        </p>
      )}
      <p className="text-[12px] text-muted-foreground">{offer.size}</p>
      <p className="text-[12px] font-medium">
        {money(unitPrice(offer))} / {offer.unitLabel}
      </p>
      <a
        href={offer.url}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-[12px] font-semibold text-secondary-foreground"
        aria-label={`View ${productName} at ${offer.retailer}`}
      >
        View at {offer.retailer} <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function ComparePage() {
  const { product } = Route.useLoaderData();
  const { inList, toggleList, isTracked, toggleTracked } = useShopping();
  const best = cheapestOffer(product);
  const added = inList(product.id);
  const tracked = isTracked(product.id);

  return (
    <AppShell>
      <Link
        to="/search"
        search={{ q: "" }}
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-muted-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to results
      </Link>

      <div className="mt-3 flex gap-3">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          width={512}
          height={512}
          className="h-28 w-28 shrink-0 rounded-2xl bg-muted object-contain"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {product.brand} · {product.category}
          </p>
          <h1 className="font-display text-xl font-semibold leading-tight">{product.name}</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Cheapest at <span className="font-semibold text-foreground">{best.retailer}</span> —{" "}
            {money(best.price)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {product.offers.map((o) => (
          <OfferBlock
            key={o.id}
            offer={o}
            best={o.id === best.id}
            productName={product.name}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            toggleList(product.id);
            toast.success(added ? "Removed from list" : "Added to shopping list");
          }}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold",
            added
              ? "bg-save text-save-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {added ? "In list" : "Add to list"}
        </button>
        <button
          onClick={() => {
            toggleTracked(product.id);
            toast.success(tracked ? "Price alert removed" : "Tracking price");
          }}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-semibold",
            tracked
              ? "border-accent bg-accent/15 text-accent-foreground"
              : "border-border bg-card text-foreground",
          )}
        >
          {tracked ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {tracked ? "Tracking" : "Track price"}
        </button>
      </div>

      <div className="mt-5">
        <AssistantCard tips={product.assistant} />
      </div>

      {product.storeBrandTip && (
        <section className="card-soft mt-4 p-4">
          <h2 className="text-sm font-semibold">Store-brand alternative</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{product.storeBrandTip}</p>
        </section>
      )}

      <section className="card-soft mt-4 p-4">
        <h2 className="text-sm font-semibold">Recent price history</h2>
        <ul className="mt-3 space-y-2">
          {product.history.map((h) => (
            <li key={h.label} className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground">{h.label}</span>
              <span className="flex gap-4">
                <span className="text-walmart">W {money(h.walmart)}</span>
                <span className="text-target">T {money(h.target)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Sample pricing for prototype purposes. Live retailer data coming soon.
      </p>
    </AppShell>
  );
}
