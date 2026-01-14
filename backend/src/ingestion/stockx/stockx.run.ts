import { fetchStockXProducts } from "./stockx.fetch.ts";
import { ingestStockXProducts } from "./stockx.ingest.ts";

async function run() {
    const products = await fetchStockXProducts();
    // console.log(products);
    await ingestStockXProducts(products);
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });