import express from 'express';
import routes from './routes/index.js';
const app = express();
const port = 4000;
app.use(express.json());
app.use('/api/v1', routes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map