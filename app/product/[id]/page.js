"use client";

import { useEffect, useState } from "react";
import { getProductById, getPriceHistory, saveToCart, getCompetitor } from "@/app/actions";
import PriceChart from "@/components/PriceChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, CheckCircle, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { use } from "react";

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  
  // Competitor States
  const [competitorData, setCompetitorData] = useState(null);
  const [loadingCompetitor, setLoadingCompetitor] = useState(true);

  useEffect(() => {
    async function loadData() {
      const p = await getProductById(resolvedParams.id);
      const h = await getPriceHistory(resolvedParams.id);
      setProduct(p);
      setHistory(h);

      // Trigger the background competitor search!
      if (p) {
        const isAmazon = p.url.includes("amazon");
        const storeToSearch = isAmazon ? "flipkart" : "amazon";
        const compData = await getCompetitor(p.name, storeToSearch);
        setCompetitorData(compData);
        setLoadingCompetitor(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  if (!product) return <div className="text-center py-20">Loading...</div>;

  const handleSaveToCart = async () => {
    setSaving(true);
    const res = await saveToCart(product.id);
    if (res.success) {
      toast.success("Added to your Cart!");
      setProduct({ ...product, in_cart: true });
    }
    setSaving(false);
  };

  const isAmazon = product.url.includes("amazon");
  const compStoreName = isAmazon ? "Flipkart" : "Amazon";

  // 👇 THE AI BUY VERDICT LOGIC 👇
  let aiVerdict = { text: "Analyzing Data...", color: "bg-gray-100 text-gray-800", icon: AlertCircle };
  if (history.length > 0) {
    const prices = history.map(h => parseFloat(h.price));
    // If we only have 1 price point, compare it to the original scrape price
    const current = parseFloat(product.current_price);
    const lowestPrice = Math.min(...prices, current);
    
    if (current <= lowestPrice) {
      aiVerdict = { text: "Buy Now! (Lowest Price Tracked)", color: "bg-green-100 text-green-800 border-green-300", icon: ShieldCheck };
    } else {
      aiVerdict = { text: "Wait (Price has been lower)", color: "bg-red-100 text-red-800 border-red-300", icon: AlertCircle };
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
        {product.in_cart ? (
          <Button disabled variant="outline" className="text-green-600 border-green-600 bg-green-50 shrink-0">
            <CheckCircle className="w-4 h-4 mr-2" /> Saved in Cart
          </Button>
        ) : (
          <Button onClick={handleSaveToCart} disabled={saving} className="bg-orange-500 hover:bg-orange-600 shrink-0">
            <ShoppingCart className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save to Cart"}
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Image & AI Verdict */}
        <div className="col-span-1 flex flex-col items-center space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full flex justify-center h-72">
            {product.image_url ? (
              <img src={product.image_url} alt="Product" className="max-h-full object-contain" />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </div>
          
          {/* AI BUY VERDICT BADGE */}
          <div className={`w-full p-4 rounded-xl border flex items-center gap-3 ${aiVerdict.color}`}>
            <aiVerdict.icon className="w-8 h-8 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">PriceScout AI</p>
              <p className="text-sm font-semibold">{aiVerdict.text}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Competitor */}
        <div className="col-span-2 space-y-6">
          
          {/* Tracked Store */}
          <div className={`p-6 rounded-xl border-2 relative ${isAmazon ? 'border-orange-400 bg-orange-50/50' : 'border-blue-400 bg-blue-50/50'}`}>
            <Badge className="absolute top-4 right-4" variant={product.in_stock === false ? "destructive" : "secondary"}>
              {product.in_stock === false ? "Out of Stock" : "In Stock"}
            </Badge>
            <h3 className="font-bold text-xl mb-4">{isAmazon ? 'Amazon' : 'Flipkart'} (Tracked)</h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-2">
              {product.currency} {product.current_price}
            </p>
            <p className="text-sm text-gray-700 mb-5 font-medium bg-white p-2 rounded border border-gray-200 inline-block">
              Offers: {product.offers}
            </p>
            <br/>
            <Button asChild className={isAmazon ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"}>
              <Link href={product.url} target="_blank">View on Store <ExternalLink className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          {/* Competitor Auto-Search Store */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white flex flex-col justify-center shadow-sm">
            <h3 className="font-bold text-gray-500 mb-2">{compStoreName} Price</h3>
            
            {loadingCompetitor ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500">Searching {compStoreName}...</p>
              </div>
            ) : competitorData ? (
              <div className="flex items-center justify-between">
                <p className="text-3xl font-extrabold text-gray-800">₹ {competitorData.price}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={competitorData.url} target="_blank">View on {compStoreName} <ExternalLink className="w-3 h-3 ml-2" /></Link>
                </Button>
              </div>
            ) : (
              <p className="text-red-500 font-medium">Currently unavailable on {compStoreName}</p>
            )}
          </div>

        </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Price History</h2>
        <div className="h-80 w-full">
          <PriceChart productId={product.id} />
        </div>
      </div>
    </div>
  );
}