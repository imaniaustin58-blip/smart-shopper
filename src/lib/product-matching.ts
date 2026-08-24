import type { NormalizedProduct } from "@/data/normalized-product";

export type MatchClassification = "exact" | "likely" | "similar" | "different";

export interface MatchResult {
  classification: MatchClassification;
  confidence: number;
  reasons: string[];
}

export function normalizeString(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeModelNumber(s: string): string {
  return s
    .toUpperCase()
    .replace(/[\s.\-_]/g, "");
}

export function normalizeBrand(s: string): string {
  const n = normalizeString(s);
  return n.replace(/\b(electronics|inc|corp|corporation|company|co|ltd|llc)\b/g, "").trim();
}

export function normalizeUpc(s: string): string {
  return s.replace(/\D/g, "");
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "with", "for", "in", "on", "at", "of", "to",
  "by", "from", "is", "it", "this", "that", "class", "new", "refurbished",
]);

function tokenize(s: string): Set<string> {
  const words = normalizeString(s).split(" ").filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  return new Set(words);
}

export function titleSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function upcMatch(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const na = normalizeUpc(a);
  const nb = normalizeUpc(b);
  if (na.length === 0 || nb.length === 0) return false;
  return na === nb;
}

export function upcConflict(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const na = normalizeUpc(a);
  const nb = normalizeUpc(b);
  if (na.length === 0 || nb.length === 0) return false;
  return na !== nb;
}

export function modelNumberMatch(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const na = normalizeModelNumber(a);
  const nb = normalizeModelNumber(b);
  if (na.length === 0 || nb.length === 0) return false;
  return na === nb;
}

export function modelNumberConflict(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const na = normalizeModelNumber(a);
  const nb = normalizeModelNumber(b);
  if (na.length === 0 || nb.length === 0) return false;
  return na !== nb;
}

export function brandMatch(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const na = normalizeBrand(a);
  const nb = normalizeBrand(b);
  if (na.length === 0 || nb.length === 0) return false;
  return na === nb;
}

interface VariantConflict {
  attribute: string;
  valueA: string;
  valueB: string;
}

const SCREEN_SIZE_RE = /(\d+(?:\.\d+)?)\s*(?:inch|in|")\b/i;
const STORAGE_RE = /(\d+)\s*(gb|tb)\b/i;
const RAM_RE = /(\d+)\s*gb\s*(?:ram|memory)\b/i;
const PACK_COUNT_RE = /(\d+)\s*(?:pack|ct|count|roll|rolls|can|cans|sheets|sheet)\b/i;
const VOLUME_RE = /(\d+(?:\.\d+)?)\s*(?:fl\s*oz|oz|ml|l|liter|liters|gallon|gallons|cup|cups)\b/i;
const WEIGHT_RE = /(\d+(?:\.\d+)?)\s*(?:lb|lbs|pound|pounds|kg|g|gram|grams|ounce|ounces)\b/i;

function extractFirstMatch(text: string, re: RegExp): string | null {
  const m = text.match(re);
  return m ? m[0].replace(/\s+/g, " ").trim().toLowerCase() : null;
}

function checkVariantConflict(titleA: string, titleB: string): VariantConflict | null {
  const pairs: Array<{ attribute: string; re: RegExp }> = [
    { attribute: "Screen size", re: SCREEN_SIZE_RE },
    { attribute: "Storage", re: STORAGE_RE },
    { attribute: "Memory", re: RAM_RE },
    { attribute: "Pack/count", re: PACK_COUNT_RE },
    { attribute: "Volume", re: VOLUME_RE },
    { attribute: "Weight", re: WEIGHT_RE },
  ];

  for (const { attribute, re } of pairs) {
    const va = extractFirstMatch(titleA, re);
    const vb = extractFirstMatch(titleB, re);
    if (va && vb && va !== vb) {
      return { attribute, valueA: va, valueB: vb };
    }
  }

  return null;
}

function formatVariantConflict(c: VariantConflict): string {
  return `${c.attribute} differs: ${c.valueA} vs ${c.valueB}`;
}

const STRONG_TITLE_THRESHOLD = 0.65;
const MODERATE_TITLE_THRESHOLD = 0.4;

export function matchProducts(a: NormalizedProduct, b: NormalizedProduct): MatchResult {
  const reasons: string[] = [];

  if (upcConflict(a.upc, b.upc)) {
    return {
      classification: "different",
      confidence: 0.95,
      reasons: ["UPCs conflict — products are not the same item"],
    };
  }

  if (upcMatch(a.upc, b.upc)) {
    return {
      classification: "exact",
      confidence: 1.0,
      reasons: ["UPCs match"],
    };
  }

  const modelConflict = modelNumberConflict(a.modelNumber, b.modelNumber);
  if (modelConflict) {
    reasons.push("Model numbers conflict — not exact");
  }

  const brandAgree = brandMatch(a.brand, b.brand);
  if (brandAgree) {
    reasons.push("Brands match");
  }

  if (!modelConflict && modelNumberMatch(a.modelNumber, b.modelNumber)) {
    return {
      classification: "exact",
      confidence: 0.95,
      reasons: ["Model numbers match", "Brands match"],
    };
  }

  const titleSim = titleSimilarity(a.productName, b.productName);
  const variantConflict = checkVariantConflict(a.productName, b.productName);

  if (variantConflict) {
    reasons.push(formatVariantConflict(variantConflict));
  }

  if (brandAgree && !variantConflict && !modelConflict && titleSim >= STRONG_TITLE_THRESHOLD) {
    const confidence = 0.75 + (titleSim - STRONG_TITLE_THRESHOLD) * (0.15 / (1 - STRONG_TITLE_THRESHOLD));
    reasons.push(`Strong title similarity (${titleSim.toFixed(2)})`);
    return {
      classification: "likely",
      confidence: Math.min(0.9, confidence),
      reasons,
    };
  }

  if (brandAgree && titleSim >= MODERATE_TITLE_THRESHOLD) {
    const confidence = 0.4 + (titleSim - MODERATE_TITLE_THRESHOLD) * (0.2 / (STRONG_TITLE_THRESHOLD - MODERATE_TITLE_THRESHOLD));
    if (variantConflict || modelConflict) {
      reasons.push(`Title similarity (${titleSim.toFixed(2)})`);
      return {
        classification: "similar",
        confidence: Math.min(0.6, confidence),
        reasons,
      };
    }
    if (titleSim < STRONG_TITLE_THRESHOLD) {
      reasons.push(`Moderate title similarity (${titleSim.toFixed(2)})`);
      return {
        classification: "similar",
        confidence: Math.min(0.6, confidence),
        reasons,
      };
    }
  }

  if (!brandAgree && titleSim < MODERATE_TITLE_THRESHOLD) {
    return {
      classification: "different",
      confidence: 0.1,
      reasons: ["Insufficient shared identifiers"],
    };
  }

  return {
    classification: "different",
    confidence: 0.1,
    reasons: ["Insufficient shared identifiers"],
  };
}
