import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";

export default async function CategoryPage({ params }) {
  // 1. Get the category name from the URL (e.g., "mobiles" or "computers")
  const resolvedParams = await params;
  const categoryName = resolvedParams.slug;
  
  // Capitalize the first letter for the display title (e.g., "mobiles" -> "Mobiles")
  const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  // 2. Fetch products from the database
  const supabase = await createClient();
  
  // Note: Right now this grabs the latest 10 products you've tracked. 
  // To make it filter perfectly by category in the future, you would add a 'category' column to your Supabase!
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .limit(10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{displayName}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (Like in your screenshot) */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Store</h3>
            <div className="space-y-3">
              {['Amazon', 'Flipkart'].map((store) => (
                <label key={store} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
                  />
                  <span className="text-sm text-gray-700">{store}</span>
                </label>
              ))}
            </div>
            
            <hr className="my-6 border-gray-100" />
            
            <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products?.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
               <p className="text-gray-500 text-lg">No products tracked in this category yet.</p>
             </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2 items-start">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}