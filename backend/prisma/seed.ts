import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const brands = ["Nike", "Adidas", "Gymshark"];

    for (const name of brands) {
        await prisma.brand.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log("Seeded Brands Successfully!")
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {await prisma.$disconnect()});