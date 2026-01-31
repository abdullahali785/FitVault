const API_BASE = "http://localhost:4000/api/v1";

export default async function ProductsPage(query : any) {
    // console.log(query.params.Promise.[Symbol(kResourceStore)].url);

    const products = await fetch(`${API_BASE}/products?limit=2`, { cache: "no-store" })
        .then(res => res.json());

    return (
    <div>
        <h1>Products</h1>
        {products.data.map((product: any) => (
            <div key={product.id}>
                <h1>{product.name}</h1>
                <img src={product.imageUrl} alt={product.name} width={300} height={300}/>
            </div>
        ))}
    </div>
    );
}