import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const SEARCH_LIMIT = 10;
const MAX_PRICE_AGE = 1000 * 60 * 60 * 24;  // 24 Hours

router.get('/', async (req, res) => {
    try {
        const results = await searchDb(req.query);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Takes user input and returns relevant products (sorted by relevance)
async function searchDb(query: any) {
    
}

export default router;