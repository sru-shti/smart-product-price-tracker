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
  
  {/* 👇 1. UPDATED LOGO SECTION (Merged with your styling) 👇 */}
  <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition rounded-md">
    <Image 
      // 👇 Assume you saved the SVG code from the previous turn as 'pricescoute-logo.svg' in /public
      src="/pricescoute-logo.svg"          
      alt="PriceScoute Logo" 
      
      // 👇 2. Define the baseline dimensions from the SVG viewbox (400x150) for aspect ratio.
      // This tells Next.js how much space to reserve, preventing layout shift.
      width={400}               
      height={150}              

      // 👇 3. This is the main scaling fix!
      // h-20 (5rem/80px) makes the logo physically 'BIG', much larger than h-10 or h-16.
      // w-auto maintains the perfect aspect ratio.
      className="h-20 w-auto"  
      
      priority                
    />
  </Link>
  {/* 👆 END LOGO SECTION 👆 */}

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