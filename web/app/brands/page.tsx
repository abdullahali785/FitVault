import Link from "next/link";

export default async function BrandsPage() {
    const brands = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brands`,
        { cache: "no-store" }
    ).then(res => res.json());

    return (
    <div>
        <h1>Brands</h1>
        {brands.map((brand: any) => (
            <Link href={{pathname: "/products", query: { brand: brand.name }}}>
                <div key={brand.id}>
                    <h1>{brand.name}</h1>
                </div>
            </Link>
        ))}
    </div>
    );
}