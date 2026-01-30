export default async function SlugProductPage({ params } : any) {
    const { slug } = params;

    const product = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/?slug=${slug}`,
        { cache: "no-store" }
    ).then(res => res.json());

    return (
        <div key={product.id}>
            <h1>{product.model}</h1>
            <img src={product.imageUrl}></img>
        </div>
    );
}