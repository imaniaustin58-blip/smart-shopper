export interface WalmartLiveResult {
  productId: string;
  title: string;
  price: number | null;
  priceString: string | null;
  unitPrice: string | null;
  image: string | null;
  productPageUrl: string | null;
  rating: number | null;
  reviews: number | null;
  seller: string | null;
  availability: string | null;
  size: string | null;
  onSale: boolean;
  wasPrice: number | null;
}

export interface WalmartLiveResponse {
  results: WalmartLiveResult[];
  error: string | null;
}
