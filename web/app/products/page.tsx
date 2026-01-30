export default async function ProductsPage(query : any) {
    const products = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${query}`,
        { cache: "no-store" }
    ).then(res => res.json());

    return (
    <div>
        <h1>Products</h1>
        {products.map((product: any) => (
            <div key={product.id}>
                <h1>{product.name}</h1>
                <img src={product.imageUrl} alt={product.name} width={300} height={300}/>
            </div>
        ))}
    </div>
    );
}