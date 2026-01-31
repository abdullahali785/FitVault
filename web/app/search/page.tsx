const API_BASE = "http://localhost:5000/api/v1/";

export default async function SearchPage(query : any) {
    const results = await fetch(`${API_BASE}/search?${query}`, { cache: "no-store" })
        .then(res => res.json());

    return (
    <div>
        {results.map((product: any) => (
            <div key={product.id}>
                <h1>{product.name}</h1>
                <img src={product.imageUrl} alt={product.name} width={300} height={300}/>
            </div>
        ))}
    </div>
    );
}