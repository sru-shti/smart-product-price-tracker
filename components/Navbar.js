import Image from "next/image";
import Link from "next/link";
import AuthButton from "./AuthButton";
import { createClient } from "@/utils/supabase/server";
import { ShoppingCart } from "lucide-react";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
  
  {/* UPDATED LOGO SECTION */}
  <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition p-2 bg-white rounded-md">
    <Image 
      src="/logo.png"          
      alt="PriceScoute Logo" 
      width={300}              // 👇 1. Increase the width property to allow for more rendering space
      height={80}               // 👇 2. Increase the height property accordingly
      className="h-16 w-auto"  // 👇 3. This is the main fix! Remove h-10 and use h-16 or h-20 for a much bigger icon.
      priority                
    />
  </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/about" className="hover:text-orange-500 transition">About</Link>
          <Link href="/deals" className="hover:text-orange-500 transition">Latest Deals</Link>
          <Link href="/contact" className="hover:text-orange-500 transition">Contact Us</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-orange-500 font-medium">
              <ShoppingCart className="w-5 h-5" /> My Cart
            </Link>
          )}
          <AuthButton user={user} />
        </div>
      </div>
    </header>
  );
}