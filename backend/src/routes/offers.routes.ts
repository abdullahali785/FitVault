import { Router, Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const offers = await fetchOffers(req.query);
        res.json(offers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function fetchOffers(query: any) {
    // Returns from offer table 
}

export default router;