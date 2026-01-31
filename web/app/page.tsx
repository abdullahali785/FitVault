"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    brand: string;
    slug: string;
    model: string;
    productUrl: string;
};

const API_BASE = "http://localhost:5000/api/v1/";

export default function LandingPage() {
    const [offers, setOffers] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLatestOffers() {
            try {
                const res = await fetch(API_BASE + "offers?availability=IN_STOCK&sort=date");
                const data = await res.json();
                setOffers(data);
            } catch (err) {
                console.error("Failed to fetch latest offers", err);
            } finally {
                setLoading(false);
            }
        }
        fetchLatestOffers();
    }, []);

    return (
        <section className="flex flex-col items-center text-center gap-8 py-20">
            <div>
                {/* Header */}
                <div className="max-w-2xl space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Fitness? Found.</h1>
                    <p className="text-gray-600 text-lg">Every top brand, one seamless shop!</p>
                </div>

                {/* Shoes/Apparel */}
                <div className="flex gap-4 pt-4">
                    <Link href="/products?category=shoes&sort=date" className="rounded-md bg-black px-6 py-3 text-white text-sm font-medium hover:bg-gray-900">Shop Shoes</Link>
                    <Link href="/products?category=apparel&sort=date" className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-gray-100">Shop Apparel</Link>
                </div>
            </div>

            {/* Latest Offers */}
            <div className="w-full max-w-6xl px-4">
                <h2 className="text-xl font-semibold mb-6">Latest Offers</h2>

                {loading ? (<p className="text-gray-500">Loading latest offers...</p>) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {offers.map((product) => (
                            <Link key={product.id} href={`/products/${product.slug}`} className="rounded-lg border bg-white shadow-sm hover:shadow-md transition text-left">
                                <img src={product.imageUrl} alt={product.name} className="h-40 w-full object-cover rounded-t-lg"/>

                                <div className="p-4 space-y-1">
                                    <p className="text-xs text-gray-500">{product.brand}</p>
                                    <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
                                    <p className="text-lg font-bold">${product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}