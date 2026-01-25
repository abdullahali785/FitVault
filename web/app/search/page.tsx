export default async function SearchPage(query : any) {
    const results = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search?${query}`,
        { cache: "no-store" }
    ).then(res => res.json());

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