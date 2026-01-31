import Link from "next/link";
const API_BASE = "http://localhost:5000/api/v1/";

export default async function BrandsPage() {
    const brands = await fetch(`${API_BASE}/brands`, { cache: "no-store" })
        .then(res => res.json());

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