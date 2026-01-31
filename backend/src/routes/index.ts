import { Router } from 'express'

import productsRoutes from './products.routes.js'
import offersRoutes from './offers.routes.js'
import brandsRoutes from './brands.routes.js'
import searchRoutes from './search.routes.js'

const router = Router()

router.use('/products', productsRoutes)
router.use('/offers', offersRoutes)
router.use('/brands', brandsRoutes)
router.use('/search', searchRoutes)

export default router
