import express, { Application } from 'express';
import products from './routes/products.js';
import landing from './routes/landing.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', landing);
app.use('/products', products);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
