import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const response = await fetch('https://api.kicks.dev/v3/goat/products?query=&slugs=&sku=&page=1&limit=1&filters=brand+%3D+%27Nike%27&display%5Bvariants%5D=true&sort=rank%3Aasc&market=US', {
        headers: {
            Authorization: `Bearer ${process.env.GOAT_API_KEY}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
}

function extractProducts(response: any) {
    if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid GOAT response shape");
    }

    const results = [];

    for (let res of response.data) {
        const productData = {
            brandName: res.brand,
            name: res.name,
            model: res.model ?? null,
            sku: res.sku ?? null,
            category: res.category ?? null,
            description: res.description ?? null,
        };

        const averagePrice = extractAveragePrice(res.variants);
        const availability = res.variants?.some(v => v.available && v.lowest_ask > 0) ? "IN_STOCK" : "OUT_OF_STOCK";

        const offerData = {
            retailer: "GOAT",
            productUrl: res.link,
            sourceProductId: String(res.id),
            price: averagePrice,
            currency: averagePrice ? "USD" : null,
            availability,
            priceSource: "API",
        };

        results.push({ productData, offerData });
    }

    return results;
}

function extractAveragePrice(variants: any[]): number | null {
    if (!variants || variants.length === 0) return null;

    const validPrices = variants
        .filter(v => v.available === true && v.lowest_ask > 0)
        .map(v => v.lowest_ask);

    if (validPrices.length === 0) return null;

    const sum = validPrices.reduce((acc, price) => acc + price, 0);
    return Math.round(sum / validPrices.length);
}

main()
    .then(data => {
        const extracted = extractProducts(data);
        console.log(JSON.stringify(extracted, null, 2));
    })
    .catch(err => console.error(err));