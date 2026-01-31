import { mapCategory } from "../category.mapper.js";
import dotenv from 'dotenv';
dotenv.config();
const STOCKX_URL = "https://api.kicks.dev/v3/stockx/products" +
    "?display%5Btraits%5D=true&display%5Bvariants%5D=true" +
    "&display%5Bidentifiers%5D=true&display%5Bprices%5D=true" +
    "&display%5Bstatistics%5D=true&query=" +
    // "&filters=brand+%3D+%27Nike%27&sort=rank&page=&limit=&market=US&currency=USD";
    "&filters=brand+%3D+%27Adidas%27&sort=rank&market=US&currency=USD";
export async function fetchStockXProducts() {
    const response = await fetch(STOCKX_URL, {
        headers: {
            Accept: '*/*',
            Authorization: `${process.env.GOAT_API_KEY}`
        }
    });
    if (!response.ok) {
        throw new Error(`StockX API failed: ${response.status}`);
    }
    const json = await response.json();
    // console.log(json);
    if (!Array.isArray(json?.data)) {
        throw new Error("Invalid StockX response shape");
    }
    const products = [];
    for (const raw of json.data) {
        // console.log(raw);
        const extracted = extractProduct(raw);
        // console.log(extracted);
        if (extracted) {
            products.push(extracted);
        }
    }
    return products;
}
function extractProduct(raw) {
    if (!raw?.id || !raw?.title || !raw?.brand)
        return null;
    const price = raw.avg_price;
    const availability = price ? "IN_STOCK" : "OUT_OF_STOCK";
    const primaryCategory = raw.breadcrumbs?.[1]?.value ??
        raw.category ??
        raw.product_type ??
        null;
    const extraSignals = [
        ...(raw.categories ?? []),
        raw.secondary_category,
    ];
    return {
        sourceProductId: String(raw.id),
        brandName: normStr(raw.brand),
        name: normStr(raw.title),
        model: normStr(raw.model),
        sku: normStr(raw.sku) ?? `StockX-${raw.id}`,
        category: mapCategory(primaryCategory, extraSignals),
        rawCategory: normStr(raw.category),
        gender: normStr(raw.gender),
        description: normStr(raw.description),
        productUrl: raw.link,
        imageUrl: raw.gallery[0],
        price,
        currency: price ? "USD" : null,
        availability,
    };
}
// Helper Functions
function normStr(value) {
    return value?.trim() || null;
}
//# sourceMappingURL=stockx.fetch.js.map