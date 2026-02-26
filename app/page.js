// smart-product-price-tracker/app/page.js

import { createClient } from "@/utils/supabase/server";
import AddProductForm from "@/components/AddProductForm";
import { LineChart, ShoppingCart, Zap } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. HERO SECTION WITH SEARCH BAR */}
      <section className="bg-[#1e1b4b] text-white py-24 px-4 flex flex-col justify-center border-b-[6px] border-orange-500">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Shop Smarter, <span className="text-orange-500">Not Harder.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Paste any Amazon or Flipkart product link below. We'll extract the true price, check bank offers, and show you the price history instantly.
          </p>

          {/* The Search / Add Bar */}
          <div className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto">
            <AddProductForm user={user} />
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION (Replaced the old Categories) */}
      <section className="max-w-7xl mx-auto px-4 py-20 w-full bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why use PriceScout?</h2>
          <p className="text-gray-600 mt-4 text-lg">Stop guessing. Make data-driven purchasing decisions.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Offer Extraction</h3>
            <p className="text-gray-600 leading-relaxed">
              Standard prices lie. We use AI to read the page and find hidden bank offers and coupons to give you the "True Price".
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LineChart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Price History</h3>
            <p className="text-gray-600 leading-relaxed">
              Never buy at the peak. View interactive charts and get our AI Verdict on whether it's a good time to buy or wait.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Save & Compare</h3>
            <p className="text-gray-600 leading-relaxed">
              Save products to your personal cart. Compare Amazon and Flipkart prices side-by-side before you checkout.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}