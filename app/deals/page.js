import { createClient } from "@/utils/supabase/server";
import { refreshTrendingDeals } from "@/app/actions";
import DealCard from "@/components/DealCard";
import Link from "next/link";

export default async function DealsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "electronics";
  const supabase = await createClient();

  // 1. Fetch from Database (Instant: ~100ms)
  let { data: deals } = await supabase
    .from("trending_deals")
    .select("*")
    .eq("category", currentCategory)
    .order("updated_at", { ascending: false });

  // 2. TRIGGER REFRESH IN BACKGROUND (Do NOT 'await' this)
  const isStale = !deals || deals.length === 0 || 
    (new Date() - new Date(deals[0]?.updated_at) > 3600000); // 1 hour

  if (isStale) {
    // Note: No 'await' here. The page continues to load instantly.
    refreshTrendingDeals(currentCategory).catch(err => console.error("BG Refresh failed", err));
  }

  const categories = [
    { id: "electronics", label: "📱 Electronics" },
    { id: "apparel", label: "👕 Fashion" },
    { id: "kitchen", label: "🍳 Kitchen" },
    { id: "beauty", label: "💄 Beauty" },
    { id: "books", label: "📚 Books" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Latest Deals</h1>
        {deals?.[0] && (
          <p className="text-xs text-gray-400">Last updated: {new Date(deals[0].updated_at).toLocaleTimeString()}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <Link key={cat.id} href={`/deals?category=${cat.id}`} 
            className={`px-4 py-2 rounded-full border ${currentCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white'}`}>
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {deals?.length > 0 ? (
          deals.map((deal, i) => <DealCard key={i} deal={deal} />)
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Scanning Amazon for the first time... please refresh in 30 seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}