import { Router } from 'express';
const router = Router();
router.get('/', async (req, res) => {
    try {
        res.json("Welcome to FitVault's API");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'GET / failed' });
    }
});
export default router;
//# sourceMappingURL=api.routes.js.map