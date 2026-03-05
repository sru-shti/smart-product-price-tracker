"use client";

import { useState } from "react";
import { addProduct } from "@/app/actions";
import { useRouter } from "next/navigation"; // 👇 1. Import useRouter
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddProductForm({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter(); // 👇 2. Initialize router

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      const isValidStore = hostname.includes('amazon') || hostname.includes('amzn') || hostname.includes('flipkart');
      if (!isValidStore) {
        toast.error("PriceScout currently only supports Amazon and Flipkart URLs.");
        return;
      }
    } catch (error) {
      toast.error("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else if (result.success && result.product?.id) { // ⭐ Added safety check here
      toast.success("Product Analyzed!");
      setUrl("");
      setLoading(false); // Ensure loading is stopped before redirect
      // 👇 Redirecting safely now
      router.push(`/product/${result.product.id}`); 
    } else {
      // Fallback if success is true but product data is missing
      toast.error("Product analyzed, but could not redirect. Please check your dashboard.");
      setLoading(false);
    }
  };

  // ... keep the return() statement exactly the same as before

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            // 👇 2. UPDATED PLACEHOLDER 👇
            placeholder="Paste product URL (Amazon or Flipkart only)"
            className="h-12 text-base text-black"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}