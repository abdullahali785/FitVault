type PageProps = {searchParams: Promise<Record<string, string | string[] | undefined>>};
const API_BASE = "http://localhost:4000/api/v1";

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    let query = [];

    for (const [key, value] of Object.entries(params)) {
        query.push(`${key}=${value}`);
    };

    const products = await fetch(`${API_BASE}/products?${query.join("&")}`, { cache: "no-store" })
        .then(res => res.json());

    return (
    <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="mt-1 text-sm text-gray-500">Browse our curated selection</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.data.map((product: any) => (
                <div key={product.id} className="group rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-square flex items-center justify-center">
                        <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"/>
                    </div>

                    <div className="p-4 bg-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h2>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}