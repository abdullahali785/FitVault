import { PrismaClient, Retailer, Availability, DataSource } from "@prisma/client";
const prisma = new PrismaClient();
export async function ingestGoatProducts(products) {
    for (const product of products) {
        await ingestSingleProduct(product);
    }
    console.log(`Ingested ${products.length} GOAT products`);
}
async function ingestSingleProduct(product) {
    await prisma.$transaction(async (tx) => {
        const brand = await tx.brand.upsert({
            where: { name: product.brandName },
            update: {},
            create: { name: product.brandName },
        });
        const dbProduct = await tx.product.upsert({
            where: { sku: product.sku },
            update: {
                name: product.name,
                model: product.model,
                category: product.category,
                rawCategory: product.rawCategory,
                gender: product.gender,
                description: product.description,
                updatedAt: new Date(),
                imageUrl: product.imageUrl,
            },
            create: {
                brandId: brand.id,
                name: product.name,
                model: product.model,
                sku: product.sku,
                category: product.category,
                rawCategory: product.rawCategory,
                gender: product.gender,
                description: product.description,
                imageUrl: product.imageUrl,
            },
        });
        await tx.offer.upsert({
            where: {
                productId_retailer: {
                    productId: dbProduct.id,
                    retailer: Retailer.GOAT,
                },
            },
            update: {
                price: product.price,
                currency: product.currency,
                availability: mapAvailability(product.availability),
                priceSource: DataSource.API,
                imageSource: DataSource.API,
                lastPriceUpdate: new Date(),
            },
            create: {
                productId: dbProduct.id,
                retailer: Retailer.GOAT,
                productUrl: product.productUrl,
                affiliateUrl: product.productUrl,
                price: product.price,
                currency: product.currency,
                availability: mapAvailability(product.availability),
                priceSource: DataSource.API,
                imageSource: DataSource.API,
                sourceProductId: product.sourceProductId,
                lastPriceUpdate: new Date(),
            },
        });
    });
}
function mapAvailability(value) {
    switch (value) {
        case "IN_STOCK":
            return Availability.IN_STOCK;
        case "OUT_OF_STOCK":
            return Availability.OUT_OF_STOCK;
        default:
            return Availability.UNKNOWN;
    }
}
//# sourceMappingURL=goat.ingest.js.map