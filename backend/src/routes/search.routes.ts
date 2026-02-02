import { Router } from 'express';
import { prisma } from "../prisma.js";
const router = Router();

const SEARCH_LIMIT = 10;
const MAX_PRICE_AGE = 1000 * 60 * 60 * 24;  // 24 Hours

router.get('/', async (req, res) => {
    try {
        const results = await searchDb(req.query);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'GET /search failed' });
    }
});

// Takes user input and returns relevant products (sorted by relevance)
async function searchDb(request: any) {
    const query = request.product?.trim();
    console.log("Query: " + query);

    if (!query || query.length < 2) {
        return { query: query ?? "", results: ["No results found"] };
    }

    const normalized = query.toLowerCase();
    console.log("Normalized: " + normalized);

    // const brands = await prisma.brand.findMany({
    //     where: {
    //         name: { contains: normalized, mode: "insensitive" },
    //     },
    //     take: 3,
    // });
    // There can be some issue here 

    const products = await prisma.product.findMany({
        where: {
            name: { contains: normalized, mode: "insensitive" },
        },
        include: {
            brand: true,
            offers: {
                where: {
                    price: { not: null },
                    availability: { not: "OUT_OF_STOCK" },
                    // lastScrapedAt: {
                    //     gte: new Date(Date.now() - MAX_PRICE_AGE),
                    // },
                },
                select: {
                    price: true,
                    currency: true,
                    retailer: true,
                    lastScrapedAt: true,
                },
            },
        },
        take: 20,
    });
    
    // Normalize Brands
    // const brandResults = brands.map(b => ({
    //     type: "brand",
    //     id: b.id,
    //     name: b.name,
    //     _rankHint: exactMatchScore(b.name, normalized),
    // }));

    // Normalize Products
    const productResults = products.map(p => {
        const prices = p.offers
            .map(o => o.price)
            .filter((p): p is number => p !== null);

        return {
            type: "product",
            id: p.id,
            name: p.name,
            brand: p.brand.name,
            imageUrl: p.imageUrl,
            lowestPrice: prices.length ? Math.min(...prices) : null,
            _rankHint: exactMatchScore(p.name, normalized),
        };
    });

    // const results = [...productResults, ...brandResults].sort((a, b) => {
    const results = [...productResults].sort((a, b) => {
        if (a._rankHint !== b._rankHint) {
            return b._rankHint - a._rankHint;
        }

        if (a.type !== b.type) {
            return a.type === "product" ? -1 : 1;
        }
        return 0;

    }).slice(0, SEARCH_LIMIT).map(({ _rankHint, ...rest }) => rest);

    return {query: query, results};
}

function exactMatchScore(text: string, query: string) {
    const t = text.toLowerCase();

    if (t === query) return 3;
    if (t.startsWith(query)) return 2;
    if (t.includes(query)) return 1;

    return 0;
}

export default router;