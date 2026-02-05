import { Retailer, Availability, DataSource } from "@prisma/client";
import { prisma } from "../../prisma.js";
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
                slug: slug(product.sourceProductId, product.name),
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
                slug: slug(product.sourceProductId, product.name),
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
function slug(id, name) {
    id = id.slice(0, 6);
    name = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return `${name}:${id}`;
}
//# sourceMappingURL=goat.ingest.js.map