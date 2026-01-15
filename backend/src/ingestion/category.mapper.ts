export type CanonicalCategory = "SHOES" | "APPAREL" | "OTHER";

export function mapCategory(input?: string | null, extraSignals?: string[] | null): CanonicalCategory {
    const values = [];

    if (input) values.push(input);
    if (extraSignals?.length) values.push(...extraSignals);

    const haystack = values.join(" ").toLowerCase();

    if (
        haystack.includes("shoe") ||
        haystack.includes("sneaker") ||
        haystack.includes("slide") ||
        haystack.includes("sandal") ||
        haystack.includes("boot") ||
        haystack.includes("cleat") ||
        haystack.includes("footwear")
    ) {
        return "SHOES";
    }

    if (
        haystack.includes("apparel") ||
        haystack.includes("clothing") ||
        haystack.includes("shirt") ||
        haystack.includes("hoodie") ||
        haystack.includes("jacket") ||
        haystack.includes("pant") ||
        haystack.includes("short") ||
        haystack.includes("tee") ||
        haystack.includes("sweater")
    ) {
        return "APPAREL";
    }

    return "OTHER";
}