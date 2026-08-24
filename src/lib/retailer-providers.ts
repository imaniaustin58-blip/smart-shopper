import type { RetailerCode, NormalizedProduct, RetailerSearchResponse } from "@/data/normalized-product";
import { searchWalmart, normalizeWalmartResponse } from "@/lib/walmart-search";

export interface RetailerProvider {
  code: RetailerCode;
  label: string;
  isConfigured: boolean;
  search(query: string): Promise<RetailerSearchResponse>;
}

const walmartProvider: RetailerProvider = {
  code: "walmart",
  label: "Walmart",
  isConfigured: true,
  async search(query: string): Promise<RetailerSearchResponse> {
    const response = await searchWalmart(query);
    return normalizeWalmartResponse(response);
  },
};

const ebayProvider: RetailerProvider = {
  code: "ebay",
  label: "eBay",
  isConfigured: false,
  async search(_query: string): Promise<RetailerSearchResponse> {
    return {
      results: [],
      error: "eBay is not yet configured. Waiting for official API credentials.",
    };
  },
};

const allProviders: RetailerProvider[] = [walmartProvider, ebayProvider];

export function getEnabledProviders(): RetailerProvider[] {
  return allProviders.filter((p) => p.isConfigured);
}

export function getAllProviders(): RetailerProvider[] {
  return allProviders;
}

export interface CombinedSearchResult {
  results: NormalizedProduct[];
  errors: Partial<Record<RetailerCode, string>>;
}

export async function searchAllRetailers(query: string): Promise<CombinedSearchResult> {
  const providers = getEnabledProviders();

  const settled = await Promise.allSettled(
    providers.map(async (provider) => {
      const response = await provider.search(query);
      return { provider, response };
    }),
  );

  const results: NormalizedProduct[] = [];
  const errors: Partial<Record<RetailerCode, string>> = {};

  for (const outcome of settled) {
    if (outcome.status === "fulfilled") {
      const { provider, response } = outcome.value;
      results.push(...response.results);
      if (response.error) {
        errors[provider.code] = response.error;
      }
    } else {
      const provider = providers[settled.indexOf(outcome)];
      errors[provider.code] = `${provider.label} search failed unexpectedly.`;
    }
  }

  return { results, errors };
}
