import type { Retailer } from "@/data/products";
import { cn } from "@/lib/utils";

export function RetailerTag({
  retailer,
  className,
}: {
  retailer: Retailer;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        retailer === "Walmart"
          ? "border-walmart/25 bg-walmart/10 text-walmart"
          : "border-target/25 bg-target/10 text-target",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          retailer === "Walmart" ? "bg-walmart" : "bg-target",
        )}
      />
      {retailer}
    </span>
  );
}
