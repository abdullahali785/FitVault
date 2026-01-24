export default async function ProductsPage() {
    const products = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?page=1`,
        { cache: "no-store" }
    ).then(res => res.json());

    return (
    <div>
        {products.map((product: any) => (
            <div key={product.id}>
                <h1>{product.name}</h1>
                <img src={product.imageUrl} alt={product.name} width={300} height={300}/>
            </div>
        ))}
    </div>
    );
}