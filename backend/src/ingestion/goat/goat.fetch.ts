import { mapCategory } from "../category.mapper.ts";
import dotenv from 'dotenv';
dotenv.config();

const GOAT_URL =
    "https://api.kicks.dev/v3/goat/products" +
    // "?query=&slugs=&sku=&page=&limit=" +
    "?query=&slugs=&sku=" +
    "&filters=brand+%3D+%27Nike%27" +
    "&display%5Bvariants%5D=true" +
    "&sort=rank%3Aasc&market=US";

export type ExtractedProduct = {
    sourceProductId: string;

    brandName: string;
    name: string;
    model: string | null;
    sku: string;
    category: "SHOES" | "APPAREL" | "OTHER";
    rawCategory: string | null;
    gender: string | null;
    description: string | null;

    productUrl: string;
    imageUrl: string;

    price: number | null;
    currency: "USD" | null;
    availability: "IN_STOCK" | "OUT_OF_STOCK";
};

export async function fetchGoatProducts() {
    const response = await fetch(GOAT_URL, {
        headers: {
            Authorization: `Bearer ${process.env.GOAT_API_KEY}`
        }
    })

    if (!response.ok) {
        throw new Error(`GOAT API failed: ${response.status}`);
    }

    const json = await response.json();

    if (!Array.isArray(json?.data)) {
        throw new Error("Invalid GOAT response shape");
    }

    const products: ExtractedProduct[] = [];

    for (const raw of json.data) {
        const extracted = extractProduct(raw);
        if (extracted) products.push(extracted);
    }

    return products;
}

function extractProduct(raw: any): ExtractedProduct | null {
    if (!raw?.id || !raw?.name || !raw?.brand) return null;

    const price = avgPrice(raw.variants);
    const availability = price ? "IN_STOCK" : "OUT_OF_STOCK";

    return {
        sourceProductId: String(raw.id),

        brandName: normStr(raw.brand)!,
        name: normStr(raw.name)!,
        model: normStr(raw.model),
        sku: normStr(raw.sku) ?? `GOAT-${raw.id}`,
        category: mapCategory(raw.category),
        rawCategory: normStr(raw.category),
        gender: normStr(raw.gender),
        description: normStr(raw.description),

        productUrl: raw.link,
        imageUrl: raw.image_url,

        price,
        currency: price ? "USD" : null,
        availability,
    };
}

// Helper Functions
function normStr(value?: string | null): string | null {
    return value?.trim() || null;
}

function avgPrice(variants: any[]): number | null {
    if (!Array.isArray(variants)) return null;

    const prices = variants
        .filter(v => v.available === true && v.lowest_ask > 0)
        .map(v => v.lowest_ask);

    if (!prices.length) return null;
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
}