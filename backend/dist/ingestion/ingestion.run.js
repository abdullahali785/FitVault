import { prisma } from "../prisma.js";
import { fetchStockXProducts } from "./stockx/stockx.fetch.js";
import { ingestStockXProducts } from "./stockx/stockx.ingest.js";
async function run() {
    // const goatProducts = await fetchGoatProducts();
    // console.log(goatProducts);
    // await ingestGoatProducts(goatProducts);
    const stockxProducts = await fetchStockXProducts();
    // console.log(stockxProducts);
    await ingestStockXProducts(stockxProducts);
}
run()
    .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
})
    .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=ingestion.run.js.map