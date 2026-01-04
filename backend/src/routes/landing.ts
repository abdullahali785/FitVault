import { log } from 'console';
import express, { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();
router.use(express.static(path.resolve('web/build')));

router.get('/', (req, res) => {
    try {
        res.sendFile(path.resolve('../web/public', 'index.html'));
        log("Done");
    } catch (e) {
        log(e);
    }
});

export default router;