export type CanonicalCategory = "SHOES" | "APPAREL" | "OTHER";

export function mapCategory(input?: string | null, extraSignals?: string[] | null): CanonicalCategory {
    const haystack = [ input ?? "", ...(extraSignals ?? [])]
        .join(" ")
        .toLowerCase();

    if (SHOE_KEYWORDS.some(k => haystack.includes(k))) {
        return "SHOES";
    }

    if (APPAREL_KEYWORDS.some(k => haystack.includes(k))) {
        return "APPAREL";
    }

    return "OTHER";
}

const SHOE_KEYWORDS = [
  "shoe",
  "sneaker",
  "trainer",
  "running",
  "basketball",
  "tennis",
  "soccer",
  "football",
  "cleat",
  "boot",
  "court",
  "track",
  "slide",
  "footwear",
  "air max",
  "air force",
  "jordan",
  "dunk",
  "yeezy",
  "ultraboost",
  "new balance",
  "asics",
  "hoka",
  "brooks",
  "saucony",
  "on running",
];

const APPAREL_KEYWORDS = [
  "apparel",
  "clothing",
  "sportswear",
  "activewear",
  "training",
  "shirt",
  "tee",
  "tank",
  "hoodie",
  "sweatshirt",
  "jacket",
  "short",
  "pant",
  "legging",
  "jogger",
  "tracksuit",
  "compression",
  "base layer",
  "sports bra",
  "sock",
];