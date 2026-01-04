import { log } from 'console';
import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (req, res) => {
    const {
        brand,
        minPrice,
        maxPrice,
        sort,
        limit = 20,
        offset = 0,
    } = req.query;

    log(brand, minPrice, maxPrice, sort, limit, offset);
    res.send('All products');
});

export default router;
