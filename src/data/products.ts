import detergent from "@/assets/detergent.jpg";
import cola from "@/assets/cola.jpg";
import papertowels from "@/assets/papertowels.jpg";
import bodywash from "@/assets/bodywash.jpg";

export type Retailer = "Walmart" | "Target";

export interface Offer {
  id: string;
  retailer: Retailer;
  price: number;
  size: string;
  unitCount: number;
  unitLabel: string; // e.g. "oz", "roll", "can"
  onSale: boolean;
  wasPrice?: number;
  url: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  keywords: string[];
  storeBrandTip?: string;
  offers: Offer[];
  assistant: string[];
  history: { label: string; walmart: number; target: number }[];
}

/**
 * MOCK DATA LAYER
 * ---------------
 * All pricing below is sample data. When real retailer price APIs become
 * available, replace the functions at the bottom of this file with async
 * calls — the UI only consumes searchProducts() / getProduct().
 */
export const PRODUCTS: ProductGroup[] = [
  {
    id: "tide-original-92oz",
    name: "Original Liquid Laundry Detergent",
    brand: "Tide",
    category: "Laundry",
    image: detergent,
    keywords: ["tide", "laundry", "detergent", "soap"],
    storeBrandTip: "Great Value Original Detergent, 100 oz — $9.98 ($0.10/oz)",
    offers: [
      {
        id: "tide-w",
        retailer: "Walmart",
        price: 19.97,
        size: "92 fl oz (64 loads)",
        unitCount: 92,
        unitLabel: "fl oz",
        onSale: false,
        url: "https://www.walmart.com",
      },
      {
        id: "tide-t",
        retailer: "Target",
        price: 17.49,
        size: "84 fl oz (59 loads)",
        unitCount: 84,
        unitLabel: "fl oz",
        onSale: true,
        wasPrice: 20.99,
        url: "https://www.target.com",
      },
    ],
    assistant: [
      "Target has the lowest price for this product right now — $17.49 vs $19.97.",
      "Walmart's 92 oz jug costs more upfront but works out to $0.217/oz vs Target's $0.208/oz — still slightly pricier per ounce.",
      "Consider the Great Value 100 oz store brand to save about $10.00 on this trip.",
    ],
    history: [
      { label: "Mar", walmart: 21.44, target: 20.99 },
      { label: "Apr", walmart: 20.97, target: 20.99 },
      { label: "May", walmart: 19.97, target: 19.49 },
      { label: "Jun", walmart: 19.97, target: 17.49 },
    ],
  },
  {
    id: "coke-12pack",
    name: "Coca-Cola Classic 12 Pack Cans",
    brand: "Coca-Cola",
    category: "Beverages",
    image: cola,
    keywords: ["coca", "cola", "coke", "soda", "12 pack", "pop"],
    storeBrandTip: "Good & Gather Cola 12 pack — $4.99 ($0.42/can)",
    offers: [
      {
        id: "coke-w",
        retailer: "Walmart",
        price: 8.98,
        size: "12 cans × 12 fl oz",
        unitCount: 12,
        unitLabel: "can",
        onSale: false,
        url: "https://www.walmart.com",
      },
      {
        id: "coke-t",
        retailer: "Target",
        price: 9.49,
        size: "12 cans × 12 fl oz",
        unitCount: 12,
        unitLabel: "can",
        onSale: true,
        wasPrice: 10.99,
        url: "https://www.target.com",
      },
    ],
    assistant: [
      "Walmart wins on this exact item — $8.98 vs $9.49, a $0.51 difference.",
      "Target's sale price is still $0.04 more per can, so the promo doesn't close the gap.",
      "Buying two 12-packs at Walmart saves about $1.02 versus Target.",
    ],
    history: [
      { label: "Mar", walmart: 9.48, target: 10.99 },
      { label: "Apr", walmart: 9.28, target: 10.49 },
      { label: "May", walmart: 8.98, target: 10.99 },
      { label: "Jun", walmart: 8.98, target: 9.49 },
    ],
  },
  {
    id: "bounty-paper-towels",
    name: "Select-A-Size Paper Towels",
    brand: "Bounty",
    category: "Paper Goods",
    image: papertowels,
    keywords: ["bounty", "paper", "towels", "kitchen"],
    storeBrandTip: "Up & Up Paper Towels, 8 rolls — $10.99 ($1.37/roll)",
    offers: [
      {
        id: "bounty-w",
        retailer: "Walmart",
        price: 24.94,
        size: "12 double rolls",
        unitCount: 12,
        unitLabel: "roll",
        onSale: true,
        wasPrice: 27.94,
        url: "https://www.walmart.com",
      },
      {
        id: "bounty-t",
        retailer: "Target",
        price: 21.99,
        size: "8 double rolls",
        unitCount: 8,
        unitLabel: "roll",
        onSale: false,
        url: "https://www.target.com",
      },
    ],
    assistant: [
      "Target is cheaper at the register ($21.99), but you get 4 fewer rolls.",
      "Walmart's larger pack costs more upfront and is cheaper per roll — $2.08 vs $2.75.",
      "If you go through paper towels quickly, the Walmart 12-pack is the better value.",
    ],
    history: [
      { label: "Mar", walmart: 27.94, target: 22.99 },
      { label: "Apr", walmart: 26.44, target: 22.99 },
      { label: "May", walmart: 24.94, target: 21.99 },
      { label: "Jun", walmart: 24.94, target: 21.99 },
    ],
  },
  {
    id: "dove-body-wash",
    name: "Deep Moisture Body Wash",
    brand: "Dove",
    category: "Personal Care",
    image: bodywash,
    keywords: ["dove", "body", "wash", "shower", "soap"],
    storeBrandTip: "Equate Deep Moisture Body Wash, 22 oz — $4.47 ($0.20/oz)",
    offers: [
      {
        id: "dove-w",
        retailer: "Walmart",
        price: 8.47,
        size: "22 fl oz",
        unitCount: 22,
        unitLabel: "fl oz",
        onSale: false,
        url: "https://www.walmart.com",
      },
      {
        id: "dove-t",
        retailer: "Target",
        price: 9.29,
        size: "22 fl oz",
        unitCount: 22,
        unitLabel: "fl oz",
        onSale: false,
        url: "https://www.target.com",
      },
    ],
    assistant: [
      "Walmart has the lowest price for this exact product — save $0.82.",
      "Same 22 oz bottle at both stores, so price per ounce follows the shelf price.",
      "Consider the Equate store-brand alternative to save $4.00.",
    ],
    history: [
      { label: "Mar", walmart: 8.97, target: 9.29 },
      { label: "Apr", walmart: 8.47, target: 9.29 },
      { label: "May", walmart: 8.47, target: 8.99 },
      { label: "Jun", walmart: 8.47, target: 9.29 },
    ],
  },
];

export const unitPrice = (o: Offer) => o.price / o.unitCount;

export const cheapestOffer = (g: ProductGroup) =>
  g.offers.reduce((a, b) => (a.price <= b.price ? a : b));

export const offerFor = (g: ProductGroup, r: Retailer) =>
  g.offers.find((o) => o.retailer === r)!;

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Swap these for real API calls later. */
export function searchProducts(query: string): ProductGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter((p) =>
    [p.name, p.brand, p.category, ...p.keywords].join(" ").toLowerCase().includes(q),
  );
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export const POPULAR_SEARCHES = [
  "Tide laundry detergent",
  "Coca-Cola 12 pack",
  "Bounty paper towels",
  "Dove body wash",
];
