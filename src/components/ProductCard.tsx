import { Link } from "@tanstack/react-router";
import { ArrowRight, Tag } from "lucide-react";
import { cheapestOffer, money, unitPrice, type ProductGroup } from "@/data/products";
import { RetailerTag } from "./RetailerTag";

export function ProductCard({ product }: { product: ProductGroup }) {
  const best = cheapestOffer(product);
  const other = product.offers.find((o) => o.id !== best.id)!;
  const diff = other.price - best.price;

  return (
    <Link
      to="/compare/$productId"
      params={{ productId: product.id }}
      className="card-soft block overflow-hidden active:scale-[0.99] transition-transform"
    >
      <div className="flex gap-3 p-3">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          loading="lazy"
          width={512}
          height={512}
          className="h-20 w-20 shrink-0 rounded-xl bg-muted object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
          <h3 className="truncate text-sm font-semibold leading-snug text-foreground">
            {product.name}
          </h3>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <p className="font-display text-xl font-semibold text-foreground">
                {money(best.price)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {money(unitPrice(best))}/{best.unitLabel} · {best.size}
              </p>
            </div>
            <RetailerTag retailer={best.retailer} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 bg-save px-3 py-2 text-[12px] font-medium text-save-foreground">
        <span className="flex items-center gap-1.5">
          {best.onSale && <Tag className="h-3.5 w-3.5" />}
          Save {money(diff)} vs {other.retailer}
        </span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
