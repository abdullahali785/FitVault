import "./globals.css";
import Link from "next/link";

export const metadata = {
    title: "FitVault",
    description: "Every top brand, one seamless shop!",
};

export default function RootLayout({children} : {children: React.ReactNode}) {
    return (
    <html lang="en">
        <body className="bg-gray-50 text-gray-900">
            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-6">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold tracking-tight">FitVault</Link>

                    {/* Search */}
                    <form action="/search" method="GET" className="flex-1 max-w-md">
                        <input type="text" name="q" placeholder="Search shoes, apparel, brands..." className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"/>
                    </form>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        <Link href="/brands" className="hover:underline">Brands</Link>
                        {/* <Link href="/products" className="hover:underline">Products</Link> */}
                        <Link href="/offers" className="hover:underline">Offers</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-16 border-t bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-500 flex justify-between">
                    <span>© {new Date().getFullYear()} FitVault</span>
                    <span>One app. Every Brand.</span>
                </div>
            </footer>
        </body>
    </html>
    )
}