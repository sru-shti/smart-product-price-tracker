import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "PriceScoute - Never Miss a Price Drop",
  description: "Track product prices across e-commerce sites and get alerts on price drops",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50/50 min-h-screen flex flex-col">
        {/* The Navbar component handles the logo size. 
            Ensure your Navbar.js uses className="h-24 w-auto" for the 'zoom' effect. */}
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>

        {/* Minimalist Footer with no extra buttons as requested */}
        <Footer />

        <Toaster richColors />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6"> 
        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            © 2026 PriceScoute. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}