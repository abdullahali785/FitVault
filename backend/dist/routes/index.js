import { Router } from 'express';
import productsRoutes from './products.routes.ts';
import offersRoutes from './offers.routes.ts';
import brandsRoutes from './brands.routes.ts';
import searchRoutes from './search.routes.ts';
const router = Router();
router.use('/products', productsRoutes);
router.use('/offers', offersRoutes);
router.use('/brands', brandsRoutes);
router.use('/search', searchRoutes);
export default router;
//# sourceMappingURL=index.js.map