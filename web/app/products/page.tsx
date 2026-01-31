type PageProps = {searchParams: Promise<Record<string, string | string[] | undefined>>};
const API_BASE = "http://localhost:4000/api/v1";

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    let query = [];

    for (const [key, value] of Object.entries(params)) {
        query.push(`${key}=${value}`);
    };

    // console.log(`${API_BASE}/products?${query.join("&")}`);

    const products = await fetch(`${API_BASE}/products?${query.join("&")}`, { cache: "no-store" })
        .then(res => res.json());

    console.log(products);

    return (
    <div>
        <h1>Products</h1>
        {/* {products.data.map((product: any) => (
            <div key={product.id}>
                <h1>{product.name}</h1>
                <img src={product.imageUrl} alt={product.name} width={300} height={300}/>
            </div>
        ))} */}
    </div>
    );
}