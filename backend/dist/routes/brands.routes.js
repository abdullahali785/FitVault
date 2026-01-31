import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = Router();
router.get('/', async (req, res) => {
    try {
        console.log("Request Recieved");
        const brands = await getBrands();
        res.status(200).json(brands);
        return;
    }
    catch (error) {
        console.error("GET /brands failed", error);
        res.status(500).json({ error: 'GET /brands failed' });
    }
});
// Returns all brands from Brand table 
async function getBrands() {
    return await prisma.brand.findMany({
        orderBy: { name: 'asc' }
    });
}
export default router;
//# sourceMappingURL=brands.routes.js.map