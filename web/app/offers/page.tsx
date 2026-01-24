export default async function ProductsPage() {
    const offers = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offers`,
        { cache: "no-store" }
    ).then(res => res.json());

    return (
    <div>
        {offers.map((offer: any) => (
            <div key={offer.id}>
                <h1>{offer.product.name}</h1>
                <img src={offer.product.imageUrl} alt={offer.product.name} width={300} height={300}/>
            </div>
        ))}
    </div>
    );
}