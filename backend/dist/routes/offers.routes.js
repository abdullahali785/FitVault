import { Router } from 'express';
import { prisma } from "../prisma.js";
const router = Router();
const MAX_PRICE_AGE = 1000 * 60 * 60 * 24; // 24 Hours
router.get('/', async (req, res) => {
    try {
        const offers = await fetchOffers(req.query);
        res.json(offers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'GET /offers failed' });
    }
});
// Returns all offers from Offer table 
async function fetchOffers(query) {
    const { availability, sort, retailer, minPrice, maxPrice, limit, offset, } = query;
    const take = Number(limit ?? 20);
    const skip = Number(offset ?? 0);
    const orderBy = sort === "date" ? { createdAt: "desc" } :
        sort === "price" ? { price: "asc" } :
            { lastScrapedAt: "desc" };
    const where = {
        ...(availability && { availability }),
        ...(retailer && { retailer: retailer.toUpperCase() }),
        ...(minPrice || maxPrice ? {
            price: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
            },
        } : {}),
        price: { not: null },
        // lastScrapedAt: {gte: new Date(Date.now() - MAX_PRICE_AGE)},
        // Enable after a api scraper is set up to keep prices fresh
    };
    const include = {
        product: {
            select: {
                id: true,
                name: true,
                slug: true,
                model: true,
                sku: true,
                imageUrl: true,
                brand: { select: { name: true } },
            },
        },
    };
    const offers = await prisma.offer.findMany({
        where,
        include,
        orderBy,
        take,
        skip,
    });
    return offers.map(o => ({
        id: o.id,
        retailer: o.retailer,
        price: round(o.price),
        currency: o.currency ?? "USD",
        availability: o.availability,
        productUrl: o.productUrl,
        affiliateUrl: o.affiliateUrl,
        lastScrapedAt: o.lastScrapedAt,
        product: {
            id: o.product.id,
            name: o.product.name,
            slug: o.product.slug,
            model: o.product.model,
            sku: o.product.sku,
            imageUrl: o.product.imageUrl,
            brand: o.product.brand.name,
        },
    }));
}
export default router;
function round(price) {
    if (price === null || price === undefined) {
        return 0;
    }
    return Math.round(price);
}
//# sourceMappingURL=offers.routes.js.map