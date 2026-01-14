import { fetchGoatProducts } from "./goat.fetch.ts";
import { ingestGoatProducts } from "./goat.ingest.ts";

async function run() {
    const products = await fetchGoatProducts();
    // console.log(products);
    await ingestGoatProducts(products);
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });