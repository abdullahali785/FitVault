import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function main() {
    const products = await prisma.product.findMany({ include: { brand: true } });

    const usedSlugs = new Set<string>();

    for (const p of products) {
        if (!p.slug) {
            let baseSlug = slugify(`${p.brand.name}-${p.name ?? "product"}`);
            let slug = baseSlug;
            let i = 1;

            while (usedSlugs.has(slug) || (await prisma.product.findUnique({ where: { slug } }))) {
                slug = `${baseSlug}-${i++}`;
            }

            await prisma.product.update({
                where: { id: p.id },
                data: { slug },
            });

            usedSlugs.add(slug);
            console.log(`Updated ${p.id} → ${slug}`);
        }
    }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
