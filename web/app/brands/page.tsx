import Link from "next/link";
const API_BASE = "http://localhost:4000/api/v1";

export default async function BrandsPage() {
    const res = await fetch(`${API_BASE}/brands`, { cache: "no-store" });
    if (!res.ok) {throw new Error("Failed to load brands")};

    const brands = await res.json();

    return (
    <div>
        <h1>Brands</h1>
        {brands.map((brand: any) => (
            <Link href={{pathname: "/products", query: { brand: brand.name }}}>
                <div key={brand.id}>
                    <p>{brand.name}</p>
                </div>
            </Link>
        ))}
    </div>
    );
}