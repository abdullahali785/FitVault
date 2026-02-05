type PageProps = {searchParams: Promise<Record<string, string | string[] | undefined>>};
const API_BASE = "http://localhost:4000/api/v1";

export default async function SearchPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const data = await fetch(`${API_BASE}/search?product=${params.q}`, { cache: "no-store" })
    const products = await data.json();

    // console.log(products);

    return (
    <div>
        <h1>Search results for {products.query}</h1>
        {products.results.map((product: any) => (
            <div key={product.id}>
                <h1>{product.name}</h1>
                <img src={product.imageUrl} alt={product.name} width={300} height={300}/>
            </div>
        ))}
    </div>
    );
}