import Link from "next/link";
const API_BASE = "http://localhost:4000/api/v1";

export default async function BrandsPage() {
    const res = await fetch(`${API_BASE}/brands`, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to load brands");
    const brands = await res.json();

    return (
    <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Brands</h1>

        <div className={brands.length <= 2 ? "flex justify-center gap-4" : "grid gap-4 sm:grid-cols-2 md:grid-cols-3"}>
            {brands.map((brand: any) => (
                <Link key={brand.id} href={{ pathname: "/products", query: { brand: brand.name } }} className="group w-full max-w-xs">
                    <div className="rounded-xl border bg-white p-6 text-center shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                        <p className="text-lg font-semibold text-gray-900">{capitalize(brand.name)}</p>
                        <p className="mt-1 text-sm text-gray-500">View products →</p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
    );
}

function capitalize(name: string) {
    return String(name).charAt(0).toUpperCase() + String(name).slice(1);
}