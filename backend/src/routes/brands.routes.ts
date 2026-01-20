import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const brands = await getBrands();
        res.json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Returns all brands from Brand table 
async function getBrands() {
    const brands = await prisma.brand.findMany({
        orderBy: {
            name: 'asc',
        }
    });

    if (!brands) {
        throw new Error('No Brands found');
    }

    return brands;
}

export default router;