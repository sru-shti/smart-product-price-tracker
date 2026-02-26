// smart-product-price-tracker/components/DealCard.js
import { Card, CardContent } from "@/components/ui/card";
import { Tag, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DealCard({ deal }) {
  // Ensure we have a valid absolute URL for Amazon
  const productUrl = deal.url.startsWith("http") ? deal.url : `https://www.amazon.in${deal.url}`;

  return (
    <Link href={productUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col border-gray-200 hover:border-orange-300 relative overflow-hidden">
        
        {/* Discount Badge */}
        {deal.discount && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
            {deal.discount}
          </div>
        )}

        <CardContent className="p-4 flex flex-col h-full pt-6">
          
          {/* Product Image */}
          <div className="flex justify-center mb-4 h-48 bg-white p-2 rounded-md">
            {deal.image_url ? (
              <img src={deal.image_url} alt={deal.name} className="object-contain h-full mix-blend-multiply" />
            ) : (
              <div className="text-gray-400 flex items-center justify-center h-full">No Image</div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 text-sm">
            {deal.name}
          </h3>

          {/* Pricing */}
          <div className="mt-auto">
            <p className="text-2xl font-extrabold text-gray-900 mb-1">
              {deal.price}
            </p>
            {deal.original_price && (
              <p className="text-sm text-gray-500 line-through mb-3">
                {deal.original_price}
              </p>
            )}
            
            <div className="flex items-center text-orange-600 text-sm font-semibold mt-2">
              Buy on Amazon <ExternalLink className="w-4 h-4 ml-1" />
            </div>
          </div>
          
        </CardContent>
      </Card>
    </Link>
  );
}