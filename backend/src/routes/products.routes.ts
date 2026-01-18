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

router.get('/:id', async (req, res) => {
    try {
        const data = await fetchProduct(req); // Send id
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function fetchProducts(query: any) {
    // Returns from product table 
}

async function fetchProduct(id: any) {
    // Return product from product table (based on id)
}

export default router;