import { prisma } from "../prisma.js";

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeID(id: string) {
    return id.slice(0, 6);
}

async function main() {
    const products = await prisma.product.findMany({ include: { brand: true } });

    for (const p of products) {
        const slug = `${slugify(p.name)}:${normalizeID(p.id)}`;
        
        await prisma.product.update({
            where: { id: p.id },
            data: { slug },
        });
    }
}

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());
