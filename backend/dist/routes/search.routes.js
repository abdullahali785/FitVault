import { Router } from 'express';
import { prisma } from "../prisma.js";
const router = Router();
const SEARCH_LIMIT = 50;
const MAX_PRICE_AGE = 1000 * 60 * 60 * 24; // 24 Hours
router.get('/', async (req, res) => {
    try {
        const results = await searchDb(req.query);
        res.json(results);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'GET /search failed' });
    }
});
// Takes user input and returns relevant products (sorted by relevance)
async function searchDb(request) {
    const query = typeof request.product === "string" ? request.product.trim() : "";
    console.log("Query: " + query);
    if (!query || query.length < 2) {
        return { query, results: [] };
    }
    const tokens = tokenize(query);
    console.log("Tokens: " + tokens);
    if (tokens.length === 0) {
        return { query, results: [] };
    }
    // Products from DB
    const productsPrimary = await prisma.product.findMany({
        where: {
            OR: [
                { AND: tokens.map(token => ({
                        OR: [
                            { name: { contains: token, mode: "insensitive" } },
                            { brand: { name: { contains: token, mode: "insensitive" } } },
                        ],
                    })) },
                { OR: tokens.map(token => ({
                        OR: [
                            { name: { contains: token, mode: "insensitive" } },
                            { brand: { name: { contains: token, mode: "insensitive" } } },
                        ],
                    })) },
            ],
        },
        include: {
            brand: true,
            offers: {
                where: {
                    availability: { not: "OUT_OF_STOCK" },
                    price: { not: null },
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
        take: 50,
    });
    // if (productsPrimary.length < 10) {
    const productsFallback = await prisma.product.findMany({
        where: {
            OR: tokens.map(token => ({
                OR: [
                    { name: { contains: token, mode: "insensitive" } },
                    { brand: { name: { contains: token, mode: "insensitive" } } },
                ],
            })),
        },
        include: {
            brand: true,
            offers: {
                where: {
                    availability: { not: "OUT_OF_STOCK" },
                    price: { not: null },
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
        take: 50,
    });
    // };
    const productMap = new Map();
    productsPrimary.forEach(p => productMap.set(p.id, p));
    productsFallback.forEach(p => productMap.set(p.id, p));
    const products = Array.from(productMap.values());
    // Normalized products data
    const productResults = products.map(p => {
        const prices = p.offers
            .map(o => o.price)
            .filter((p) => p !== null);
        return {
            type: "product",
            id: p.id,
            name: p.name,
            brand: p.brand.name,
            imageUrl: p.imageUrl,
            lowestPrice: prices.length ? Math.min(...prices) : null,
            _rankHint: relevanceScore(p.name, p.brand.name, tokens),
        };
    });
    // Brands from DB
    const brands = await prisma.brand.findMany({
        where: {
            AND: tokens.map(token => ({
                name: { contains: token, mode: "insensitive" },
            })),
        },
        take: 10,
    });
    // Normalized brands data
    const brandResults = brands.map(b => ({
        type: "brand",
        id: b.id,
        name: b.name,
        _rankHint: brandScore(b.name, tokens),
    }));
    // Data order based on relevance
    const results = [...productResults, ...brandResults.map(b => ({ ...b, _rankHint: b._rankHint - 5 }))]
        .filter(r => r._rankHint > 0)
        .sort((a, b) => b._rankHint - a._rankHint)
        .slice(0, SEARCH_LIMIT)
        .map(({ _rankHint, ...rest }) => rest);
    return { query: query, results };
}
function tokenize(q) {
    return q
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(t => t.length > 1);
}
function relevanceScore(name, brand, tokens) {
    name = name.toLowerCase();
    brand = brand.toLowerCase();
    const text = `${brand} ${name}`;
    let score = 0;
    for (const token of tokens) {
        if (name === token)
            score += 10;
        else if (text.startsWith(token))
            score += 6;
        else if (name.includes(token))
            score += 5;
        else if (brand.includes(token))
            score += 3;
        else if (text.includes(token))
            score += 2;
    }
    score += tokens.length * 2;
    return score;
}
function brandScore(name, tokens) {
    const n = name.toLowerCase();
    let score = 0;
    for (const t of tokens) {
        if (n === t)
            score += 8;
        else if (n.startsWith(t))
            score += 5;
        else if (n.includes(t))
            score += 3;
    }
    score -= Math.max(0, tokens.length - 1) * 2;
    return score;
}
export default router;
//# sourceMappingURL=search.routes.js.map