export type RetailerCode = "walmart" | "target" | "amazon" | "bestbuy" | "ebay";

export type AvailabilityStatus = "in_stock" | "out_of_stock" | "limited" | "unknown";

export interface NormalizedProduct {
  retailer: RetailerCode;
  retailerProductId: string;
  productName: string;
  brand: string | null;
  modelNumber: string | null;
  upc: string | null;
  sku: string | null;
  currentPrice: number | null;
  originalPrice: number | null;
  imageUrl: string | null;
  productUrl: string | null;
  affiliateUrl: string | null;
  availability: AvailabilityStatus;
  shippingInfo: string | null;
  pickupAvailable: boolean | null;
  rating: number | null;
  reviewCount: number | null;
  seller: string | null;
  lastChecked: string | null;
}

export interface RetailerSearchResponse {
  results: NormalizedProduct[];
  error: string | null;
}
