import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export const metadata = { title: "My Cart | PriceScout" };

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <div className="p-20 text-center text-xl">Please sign in to view your cart.</div>;

  // ONLY fetch products saved to the cart
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .eq("in_cart", true) 
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-orange-500" /> My Saved Products
      </h1>
      
      {products?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <Link href="/" className="text-orange-500 font-semibold hover:underline">Go track some deals!</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}