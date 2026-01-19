import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const MAX_PRICE_AGE = 1000 * 60 * 60 * 24; // 24 Hours

router.get('/', async (req, res) => {
    try {
        const data = await fetchProducts(req.query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await fetchProduct(req.params.id); 
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Returns multiple products from product table 
async function fetchProducts(query: any) {
    const {
        brand,
        minPrice,
        maxPrice,
        sort,
        limit = 20,
        offset = 0,
    } = query;

    const take = Number(limit ?? 20);
    const skip = Number(offset ?? 0);

    const orderBy =
        sort === "date" ? { createdAt: "desc" as const } : 
        { rating: "desc" as const };

    const where = {
        ...(brand && { brand: { name: brand } }),

        ...(minPrice || maxPrice ? {
            offers: {
                some: {
                    price: {
                        ...(minPrice && { gte: Number(minPrice) }),
                        ...(maxPrice && { lte: Number(maxPrice) }),
                    },
                    lastScrapedAt: {
                        gte: new Date(Date.now() - MAX_PRICE_AGE),
                    },
                },
            },
        } : {}),
    };

    const include = {
        brand: true,
        offers: {
            where: {
                price: { not: null },
                lastScrapedAt: {
                    gte: new Date(Date.now() - MAX_PRICE_AGE),
                },
            },
            select: {
                price: true,
                currency: true,
                retailer: true,
                lastScrapedAt: true,
            },
        },
    }

    const data = await prisma.product.findMany({
        where,
        include,
        take,
        skip,
    });

    return data.map(p => {
        const prices = p.offers
            .map(o => o.price)
            .filter((p): p is number => p !== null);
            
        return {
            id: p.id,
            brand: p.brand,
            model: p.model,
            imageUrl: p.imageUrl,
            lowestPrice: prices.length ? Math.min(...prices) : null,
            currency: p.offers[0]?.currency ?? 'USD',
            offerCount: prices.length,
        };
    });
}

// Return a single product from product table (based on id)
async function fetchProduct(id: any) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            brand: true,
            offers: {
                where: { price: { not: null } },
                orderBy: { price: 'asc' },
            },
        },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    const now = Date.now();

    return {
        ...product,
        offers: product.offers.map(o => ({
            ...o,
            isStale: !o.lastScrapedAt || now - o.lastScrapedAt.getTime() > MAX_PRICE_AGE,
        })),
    };
}

export default router;