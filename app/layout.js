import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "PriceScoute - Never Miss a Price Drop",
  description: "Track product prices across e-commerce sites and get alerts on price drops",
};

// 1. We keep ONLY the RootLayout as the default export
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50/50 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>

        {/* 2. We call the Footer here so it shows up on every page */}
        <Footer />

        <Toaster richColors />
      </body>
    </html>
  );
}

// 3. We removed 'default' from here so it doesn't conflict
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="PriceScoute Logo" 
              width={120} 
              height={30} 
              className="h-6 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"
            />
          </div>

          <nav className="flex gap-6 text-xs font-medium text-gray-500">
            <Link href="/about" className="hover:text-orange-500 transition">About</Link>
            <Link href="/deals" className="hover:text-orange-500 transition">Deals</Link>
            <Link href="/contact" className="hover:text-orange-500 transition">Contact</Link>
            <Link href="/privacy" className="hover:text-orange-500 transition">Privacy</Link>
          </nav>

          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            © 2026 PriceScoute. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}