import dotenv from 'dotenv';
dotenv.config();

const STOCKX_URL =
    "https://api.kicks.dev/v3/stockx/products" + 
    "?display%5Btraits%5D=true&display%5Bvariants%5D=true" + 
    "&display%5Bidentifiers%5D=true&display%5Bprices%5D=true" + 
    "&display%5Bstatistics%5D=true&query=" + 
    "&filters=brand+%3D+%27Nike%27&sort=rank&page=1&limit=20&market=US&currency=USD";

export type ExtractedProduct = {
    sourceProductId: string;

    brandName: string;
    name: string;
    model: string | null;
    sku: string;
    category: string | null;
    gender: string | null;
    description: string | null;

    productUrl: string;

    price: number | null;
    currency: "USD" | null;
    availability: "IN_STOCK" | "OUT_OF_STOCK";
};

export async function fetchStockXProducts() {
    const response = await fetch(STOCKX_URL, {
        headers: {
            Authorization: `Bearer ${process.env.GOAT_API_KEY}`
        }
    })

    if (!response.ok) {
        throw new Error(`StockX API failed: ${response.status}`);
    }

    const json = await response.json();

    if (!Array.isArray(json?.data)) {
        throw new Error("Invalid StockX response shape");
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
        sku: normStr(raw.sku) ?? `StockX-${raw.id}`,
        category: normStr(raw.category),
        gender: normStr(raw.gender),
        description: normStr(raw.description),

        productUrl: raw.link,

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