import express, { Application } from 'express';
import routes from './routes/index.ts';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/v1', routes)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
