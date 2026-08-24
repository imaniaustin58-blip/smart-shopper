import type { WalmartLiveResponse, WalmartLiveResult } from "@/data/walmart-types";
import type { NormalizedProduct, RetailerSearchResponse } from "@/data/normalized-product";

export function normalizeWalmartResult(result: WalmartLiveResult): NormalizedProduct {
  return {
    retailer: "walmart",
    retailerProductId: result.productId,
    productName: result.title,
    brand: null,
    modelNumber: null,
    upc: null,
    sku: result.productId,
    currentPrice: result.price,
    originalPrice: result.wasPrice,
    imageUrl: result.image,
    productUrl: result.productPageUrl,
    affiliateUrl: null,
    availability: result.availability === "Out of stock" ? "out_of_stock" : "in_stock",
    shippingInfo: null,
    pickupAvailable: null,
    rating: result.rating,
    reviewCount: result.reviews,
    seller: result.seller,
    lastChecked: new Date().toISOString(),
  };
}

export function normalizeWalmartResponse(response: WalmartLiveResponse): RetailerSearchResponse {
  return {
    results: response.results.map(normalizeWalmartResult),
    error: response.error,
  };
}

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

export async function searchWalmart(query: string): Promise<WalmartLiveResponse> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    return {
      results: [],
      error: "Live Walmart pricing is temporarily unavailable.",
    };
  }

  try {
    const endpoint = `${supabaseUrl}/functions/v1/walmart-search?query=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      return {
        results: [],
        error: "Live Walmart pricing is temporarily unavailable.",
      };
    }

    const json = (await response.json()) as SerpApiWalmartResponse & { error?: string };

    if (json.error) {
      return {
        results: [],
        error: "Live Walmart pricing is temporarily unavailable.",
      };
    }

    const results = (json.organic_results ?? []).map(mapResult);

    return { results, error: null };
  } catch {
    return {
      results: [],
      error: "Live Walmart pricing is temporarily unavailable.",
    };
  }
}
