import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { WalmartLiveResponse, WalmartLiveResult } from "@/data/walmart-types";

interface SerpApiWalmartResult {
  us_item_id?: string;
  product_id?: string;
  title?: string;
  thumbnail?: string | null;
  product_page_url?: string;
  rating?: number;
  reviews?: number;
  seller_name?: string;
  out_of_stock?: boolean;
  primary_offer?: {
    offer_price?: number;
    was_price?: number;
    currency?: string;
  };
  price_per_unit?: {
    amount?: string;
    unit?: string;
    currency?: string;
  };
  product_type?: string;
  description?: string;
}

interface SerpApiWalmartResponse {
  organic_results?: SerpApiWalmartResult[];
  error?: string;
}

function extractSize(result: SerpApiWalmartResult): string | null {
  const sizeRegex =
    /(\d+(?:\.\d+)?\s*(?:fl\s*oz|oz|lb|lbs|pound|pounds|count|ct|pack|roll|rolls|can|cans|sheets|sheet|loads|kg))\b/i;

  if (result.title) {
    const m = result.title.match(sizeRegex);
    if (m) return m[1];
  }
  if (result.description) {
    const m = result.description.match(sizeRegex);
    if (m) return m[1];
  }
  return null;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function mapResult(result: SerpApiWalmartResult): WalmartLiveResult {
  const offerPrice = result.primary_offer?.offer_price;
  const wasPrice = result.primary_offer?.was_price;
  const onSale =
    typeof wasPrice === "number" && typeof offerPrice === "number" && wasPrice > offerPrice;

  return {
    productId: result.us_item_id ?? result.product_id ?? "",
    title: result.title ?? "Untitled product",
    price: typeof offerPrice === "number" ? offerPrice : null,
    priceString: typeof offerPrice === "number" ? formatPrice(offerPrice) : null,
    unitPrice: result.price_per_unit?.amount ?? null,
    image: result.thumbnail ?? null,
    productPageUrl: result.product_page_url ?? null,
    rating: typeof result.rating === "number" ? result.rating : null,
    reviews: typeof result.reviews === "number" ? result.reviews : null,
    seller: result.seller_name ?? null,
    availability: result.out_of_stock ? "Out of stock" : null,
    size: extractSize(result),
    onSale,
    wasPrice: typeof wasPrice === "number" ? wasPrice : null,
  };
}

export const searchWalmart = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const schema = z.object({ query: z.string().min(1) });
    return schema.parse(input);
  })
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error("VITE_SUPABASE_URL is not configured");
      return {
        results: [],
        error: "Live Walmart pricing is temporarily unavailable.",
      } satisfies WalmartLiveResponse;
    }

    try {
      const endpoint = `${supabaseUrl}/functions/v1/walmart-search?query=${encodeURIComponent(data.query)}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        console.error(`Walmart edge function responded with status ${response.status}`);
        return {
          results: [],
          error: "Live Walmart pricing is temporarily unavailable.",
        } satisfies WalmartLiveResponse;
      }

      const json = (await response.json()) as SerpApiWalmartResponse & { error?: string };

      if (json.error) {
        console.error(`Walmart edge function error: ${json.error}`);
        return {
          results: [],
          error: "Live Walmart pricing is temporarily unavailable.",
        } satisfies WalmartLiveResponse;
      }

      const results = (json.organic_results ?? []).map(mapResult);

      return { results, error: null } satisfies WalmartLiveResponse;
    } catch (err) {
      console.error("Walmart edge function request failed:", err);
      return {
        results: [],
        error: "Live Walmart pricing is temporarily unavailable.",
      } satisfies WalmartLiveResponse;
    }
  });
