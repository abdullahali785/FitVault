import Link from "next/link";

export default function LandingPage() {
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
                    <Link href="/products?category=shoes" className="rounded-md bg-black px-6 py-3 text-white text-sm font-medium hover:bg-gray-900">Shop Shoes</Link>
                    <Link href="/products?category=apparel" className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-gray-100">Shop Apparel</Link>
                </div>
            </div>

            <div>
                {/* Best offers */}
                <div className="flex gap-4 pt-4">
                    <p>Best Offers</p>
                </div>
            </div>
        </section>
    );
}