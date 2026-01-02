import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const nike = await prisma.brand.findUnique({
        where: { name: "Nike" },
    });
    if (!nike) throw new Error("Nike not found");

    await prisma.product.createMany({
        data: [
        {
            name: "Nike Air Zoom Pegasus",
            category: "Running Shoes",
            price: 119.99,
            releaseDate: new Date("2024-01-10"),
            rating: 4.6,
            reviewCount: 1280,
            affiliateUrl: "https://nike.com/pegasus",
            imageUrl: "https://nike.com/pegasus.jpg",
            brandId: nike.id,
        },
        ],
    });
    console.log("Seeded products!");
}

async function test() {
    const products = await prisma.product.findMany({
        include: { brand: true },
    });
    console.log(products);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

// test()
//     .catch(console.error)
//     .finally(() => prisma.$disconnect());