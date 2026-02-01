const API_BASE = "http://localhost:4000/api/v1/";

export default async function OffersPage() {
    const offers = await fetch(`${API_BASE}offers?availability=IN_STOCK&sort=date`, { cache: "no-store" })
        .then(res => res.json());

    return (
    <div>
        <h1>Latest Offers</h1>
        {offers.map((offer: any) => (
            <div key={offer.id}>
                <h1>{offer.product.name}</h1>
                <img src={offer.product.imageUrl} alt={offer.product.name} width={300} height={300}/>
            </div>
        ))}
    </div>
    );
}