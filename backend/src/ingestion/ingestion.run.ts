import { PrismaClient } from "@prisma/client";

import { fetchGoatProducts } from "./goat/goat.fetch.ts";
import { ingestGoatProducts } from "./goat/goat.ingest.ts";
import { fetchStockXProducts } from "./stockx/stockx.fetch.ts";
import { ingestStockXProducts } from "./stockx/stockx.ingest.ts";

const prisma = new PrismaClient();

async function run() {
    const goatProducts = await fetchGoatProducts();
    // console.log(goatProducts);
    await ingestGoatProducts(goatProducts);

    const stockxProducts = await fetchStockXProducts();
    // console.log(stockxProducts);
    await ingestStockXProducts(stockxProducts);
}

run()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(0);
    })
    .catch(async err => {
        console.error(err);
        await prisma.$disconnect();
        process.exit(1);
    });