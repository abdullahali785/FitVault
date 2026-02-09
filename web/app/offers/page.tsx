const API_BASE = "http://localhost:4000/api/v1/";

export default async function OffersPage() {
    const offers = await fetch(`${API_BASE}offers?availability=IN_STOCK&sort=date`, { cache: "no-store" })
        .then(res => res.json());

    return (
    <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Latest Offers</h1>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {offers.map((offer: any) => (
                <div key={offer.id} className="group rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-square">
                        <img src={offer.product.imageUrl} alt={offer.product.name} className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"/>
                    </div>

                    <div className="p-4 bg-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">{offer.product.name}</h2>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}