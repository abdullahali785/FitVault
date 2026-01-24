export default async function ProductsPage() {
    const brands = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brands`,
        { cache: "no-store" }
    ).then(res => res.json());

    return (
    <div>
        {brands.map((brand: any) => (
            <div key={brand.id}>
                <h1>{brand.name}</h1>
            </div>
        ))}
    </div>
    );
}