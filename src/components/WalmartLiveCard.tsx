import { ExternalLink, Star, Tag } from "lucide-react";
import type { WalmartLiveResult } from "@/data/walmart-types";
import { RetailerTag } from "./RetailerTag";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function WalmartLiveCard({ product }: { product: WalmartLiveResult }) {
  const hasPrice = product.price !== null;
  const hasUrl = product.productPageUrl !== null;

  return (
    <div className="card-soft block overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 bg-walmart/5 px-3 py-1.5">
        <RetailerTag retailer="Walmart" />
        <span className="rounded-full bg-walmart/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-walmart">
          Live Walmart Data
        </span>
      </div>

      <div className="flex gap-3 p-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-xl bg-muted object-contain"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted">
            <span className="text-[10px] text-muted-foreground">No image</span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {product.title}
          </h3>

          {product.seller && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">Sold by {product.seller}</p>
          )}

          {product.rating !== null && product.rating > 0 && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {product.rating.toFixed(1)}
              {product.reviews !== null &&
                product.reviews > 0 &&
                ` (${product.reviews.toLocaleString()})`}
            </p>
          )}

          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              {hasPrice ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="font-display text-xl font-semibold text-foreground">
                      {product.priceString ?? money(product.price!)}
                    </p>
                    {product.onSale && product.wasPrice !== null && (
                      <p className="text-[11px] text-muted-foreground line-through">
                        {money(product.wasPrice)}
                      </p>
                    )}
                  </div>
                  {product.unitPrice ? (
                    <p className="text-[11px] text-muted-foreground">{product.unitPrice}</p>
                  ) : product.size ? (
                    <p className="text-[11px] text-muted-foreground">{product.size}</p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">Unit price unavailable</p>
                  )}
                </>
              ) : (
                <p className="font-display text-sm font-semibold text-muted-foreground">
                  Price unavailable
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {product.availability && (
        <p className="px-3 pb-1 text-[11px] text-muted-foreground">{product.availability}</p>
      )}

      {hasUrl ? (
        <a
          href={product.productPageUrl!}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center justify-center gap-1.5 border-t border-border/60 px-3 py-2 text-[12px] font-semibold text-walmart"
        >
          View at Walmart <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <div className="flex items-center justify-center gap-1.5 border-t border-border/60 px-3 py-2 text-[12px] font-medium text-muted-foreground">
          <Tag className="h-3.5 w-3.5" />
          Product link unavailable
        </div>
      )}
    </div>
  );
}

export function WalmartLiveError({ message }: { message: string }) {
  return (
    <div className="card-soft overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/60 bg-walmart/5 px-3 py-1.5">
        <RetailerTag retailer="Walmart" />
        <span className="rounded-full bg-walmart/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-walmart">
          Live Walmart Data
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 p-6 text-center">
        <Tag className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">{message}</p>
        <p className="text-[12px] text-muted-foreground">
          Target results below are sample data and remain available.
        </p>
      </div>
    </div>
  );
}

export function WalmartLiveLoading() {
  return (
    <div className="card-soft overflow-hidden animate-pulse">
      <div className="flex items-center justify-between border-b border-border/60 bg-walmart/5 px-3 py-1.5">
        <RetailerTag retailer="Walmart" />
        <span className="rounded-full bg-walmart/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-walmart">
          Live Walmart Data
        </span>
      </div>
      <div className="flex gap-3 p-3">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-6 w-20 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
