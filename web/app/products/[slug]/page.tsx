const API_BASE = "http://localhost:5000/api/v1/";

export default async function SlugProductPage({ params } : any) {
    const { slug } = params;

    const product = await fetch(`${API_BASE}/products/?slug=${slug}`, { cache: "no-store" })
        .then(res => res.json());

    return (
        <div key={product.id}>
            <h1>{product.model}</h1>
            <img src={product.imageUrl}></img>
        </div>
    );
}