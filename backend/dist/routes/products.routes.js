import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();
const MAX_PRICE_AGE = 1000 * 60 * 60 * 24; // 24 Hours
router.get('/', async (req, res) => {
    try {
        const products = await fetchProducts(req.query);
        res.json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'GET /products failed' });
    }
});
router.get('/:slug', async (req, res) => {
    try {
        const data = await fetchProduct({ slug: req.params.slug });
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'GET /products/:slug failed' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const data = await fetchProduct({ id: req.params.id });
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'GET /products/:id failed' });
    }
});
// Returns multiple products from Product table 
async function fetchProducts(query) {
    const { category, sort, brand, minPrice, maxPrice, } = query;
    const page = Number(query.page ?? 1);
    const take = Number(query.limit ?? 20);
    const skip = (page - 1) * take;
    const orderBy = sort === "date" ? { createdAt: "desc" } : { updatedAt: "desc" };
    const where = {
        ...(category && { category }),
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
    };
    const data = await prisma.product.findMany({
        where,
        include,
        orderBy,
        take,
        skip,
    });
    let results = [];
    data.map(p => {
        const prices = p.offers
            .map(o => o.price)
            .filter((p) => p !== null);
        const productInfo = {
            id: p.id,
            brand: {
                id: p.brand.id,
                name: p.brand.name,
            },
            model: p.model,
            slug: p.slug,
            imageUrl: p.imageUrl,
            lowestPrice: prices.length ? Math.min(...prices) : null,
            currency: p.offers[0]?.currency ?? 'USD',
            offerCount: prices.length,
        };
        results.push(productInfo);
    });
    const total = await prisma.product.count({ where });
    return {
        "data": results,
        "meta": {
            "page": 1,
            "limit": take,
            "total": total,
            "totalPages": total / take + 1
        }
    };
}
// Returns a single product from Product table based on slug or id
async function fetchProduct({ id, slug }) {
    if (!id && !slug) {
        throw new Error("Either id or slug must be provided");
    }
    let where = { slug };
    if (id)
        where = { id };
    const product = await prisma.product.findUnique({
        where,
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
    const prices = product.offers
        .map(o => o.price)
        .filter((p) => p !== null);
    const productInfo = {
        id: product.id,
        brand: {
            id: product.brand.id,
            name: product.brand.name,
        },
        model: product.model,
        slug: product.slug,
        imageUrl: product.imageUrl,
        lowestPrice: prices.length ? Math.min(...prices) : null,
        currency: product.offers[0]?.currency ?? 'USD',
        offerCount: prices.length,
    };
    return { "data": productInfo };
}
export default router;
//# sourceMappingURL=products.routes.js.map