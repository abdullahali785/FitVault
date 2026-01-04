import express, { Router, Request, Response } from 'express';
import path from 'path';

const router: Router = Router();
router.use(express.static(path.resolve('web/build')));

router.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve('web/build', 'index.html'));
});

export default router;