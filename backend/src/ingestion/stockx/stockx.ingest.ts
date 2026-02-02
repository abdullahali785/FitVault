import { Retailer, Availability, DataSource } from "@prisma/client";
import type { ExtractedProduct } from "./stockx.fetch.js";
import { prisma } from "../../prisma.js";

export async function ingestStockXProducts(products: ExtractedProduct[]) {
    for (const product of products) {
        await ingestSingleProduct(product);
    }

    console.log(`Ingested ${products.length} StockX products`);
}

async function ingestSingleProduct(product: ExtractedProduct) {
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
                slug: slugify(`${brand.name}-${product.name ?? "product"}`),
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
                slug: slugify(`${brand.name}-${product.name ?? "product"}`),
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
                    retailer: Retailer.STOCKX,
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
                retailer: Retailer.STOCKX,
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


function mapAvailability(value: ExtractedProduct["availability"]): Availability {
    switch (value) {
        case "IN_STOCK":
            return Availability.IN_STOCK;
        case "OUT_OF_STOCK":
            return Availability.OUT_OF_STOCK;
        default:
            return Availability.UNKNOWN;
    }
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}