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
    // Takes user input and returns relevant products (sorted by relevance)
}

export default router;