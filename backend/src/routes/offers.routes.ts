import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const MAX_PRICE_AGE = 1000 * 60 * 60 * 24; // 24 Hours

router.get('/', async (req, res) => {
    try {
        const offers = await fetchOffers(req.query);
        res.json(offers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Returns all offers from Offer table 
async function fetchOffers(query: any) {
    const {
        retailer,
        minPrice,
        maxPrice,
        availability,
        sort,
        limit = 20,
        offset = 0,
    } = query;

    const take = Number(limit ?? 20);
    const skip = Number(offset ?? 0);

    const orderBy =
        sort === "date" ? { createdAt: "desc" as const } : 
        sort === "price" ? { price: "asc" as const } : 
        { lastScrapedAt: "desc" as const };

    const where = {
        ...(retailer && { retailer: retailer.toUpperCase() }),
        ...(availability && { availability }),

        ...(minPrice || maxPrice ? {
            price: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
            },
        } : {}),

        price: { not: null },
        lastScrapedAt: {
            gte: new Date(Date.now() - MAX_PRICE_AGE),
        },
    };

    const include = {
        product: {
            select: {
                id: true,
                name: true,
                model: true,
                sku: true,
                imageUrl: true,
                brand: {
                    select: { name: true },
                },
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
        price: o.price,
        currency: o.currency ?? "USD",
        availability: o.availability,
        productUrl: o.productUrl,
        affiliateUrl: o.affiliateUrl,
        lastScrapedAt: o.lastScrapedAt,

        product: {
            id: o.product.id,
            name: o.product.name,
            model: o.product.model,
            sku: o.product.sku,
            imageUrl: o.product.imageUrl,
            brand: o.product.brand.name,
        },
    }));
}

export default router;