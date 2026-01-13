import { fetchGoatProducts } from "./goat.fetch.js";
import { ingestGoatProducts } from "./goat.ingest.js";

async function run() {
    const products = await fetchGoatProducts();
    await ingestGoatProducts(products);
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });