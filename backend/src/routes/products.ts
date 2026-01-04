import { log } from 'console';
import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await fetchProducts(req.query);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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
        sort === "price" ? { price: "asc" as const } :
        sort === "date" ? { createdAt: "desc" as const } : 
        { rating: "desc" as const };

    const where = {
        ...(brand && { brand }),

        ...((minPrice || maxPrice) && {
            price: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
            },
        }),
    }; 

    const data = await prisma.product.findMany({
        where,
        orderBy,
        take,
        skip,
    });

    return data;
}

export default router;