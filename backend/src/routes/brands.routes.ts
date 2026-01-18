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

async function getBrands() {
    // Query brands table in db
}

export default router;