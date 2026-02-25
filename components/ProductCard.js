//smart-product-price-tracker\components\ProductCard.js
"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/actions";
import PriceChart from "./PriceChart";
import { createClient } from "@/utils/supabase/client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Trash2,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const supabase = createClient();

    const [targetPrice, setTargetPrice] = useState(product.target_price || "");
    const [savingTarget, setSavingTarget] = useState(false);


  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;

    setDeleting(true);
    await deleteProduct(product.id);
  };
  const saveTargetPrice = async () => {
  if (!targetPrice) {
    alert("Please enter a target price");
    return;
  }

  setSavingTarget(true);

  const { error } = await supabase
    .from("products")
    .update({ target_price: targetPrice })
    .eq("id", product.id);

  setSavingTarget(false);

  if (error) {
    alert("Failed to save target price");
  } else {
    alert("Target price saved ✅");
  }
};

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md border"
            />
          )}

         <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">
                {product.currency} {product.current_price}
              </span>
              
              {/* 👇 NEW STOCK STATUS BADGE 👇 */}
              <Badge 
                variant={product.in_stock === false ? "destructive" : "secondary"} 
                className="gap-1"
              >
                {product.in_stock === false ? "Out of Stock" : "In Stock"}
              </Badge>

              {/* Existing Tracking Badge */}
              <Badge variant="secondary" className="gap-1">
                <TrendingDown className="w-3 h-3" />
                Tracking
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
  {/* Action buttons */}
  <div className="flex flex-wrap gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowChart(!showChart)}
      className="gap-1"
    >
      {showChart ? (
        <>
          <ChevronUp className="w-4 h-4" />
          Hide Chart
        </>
      ) : (
        <>
          <ChevronDown className="w-4 h-4" />
          Show Chart
        </>
      )}
    </Button>

    <Button variant="outline" size="sm" asChild className="gap-1">
      <Link href={product.url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-4 h-4" />
        View Product
      </Link>
    </Button>

    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
    >
      <Trash2 className="w-4 h-4" />
      Remove
    </Button>
  </div>

  {/* 🎯 Target price section */}
  <div className="mt-4 flex items-center gap-2">
    <input
      type="number"
      placeholder="Alert price"
      value={targetPrice}
      onChange={(e) => setTargetPrice(e.target.value)}
      className="border rounded px-2 py-1 w-32 text-sm"
    />

    <Button
      size="sm"
      onClick={saveTargetPrice}
      disabled={savingTarget}
    >
      {savingTarget ? "Saving..." : "Save"}
    </Button>
{targetPrice && (
  <span className="text-sm text-gray-500">
    Alert when ≤ {product.currency} {targetPrice}
  </span>
)}

  </div>
</CardContent>

      {showChart && (
        <CardFooter className="pt-0">
          <PriceChart productId={product.id} />
        </CardFooter>
      )}
    </Card>
  );
}
