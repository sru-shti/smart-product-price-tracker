"use client";

import { useState } from "react";
import { addProduct } from "@/app/actions";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddProductForm({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // 👇 1. URL VALIDATION LOGIC 👇
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      
      // Check if it includes amazon, amzn (for short links), or flipkart
      const isValidStore = 
        hostname.includes('amazon') || 
        hostname.includes('amzn') || 
        hostname.includes('flipkart');

      if (!isValidStore) {
        toast.error("PriceScout currently only supports Amazon and Flipkart URLs.");
        return;
      }
    } catch (error) {
      toast.error("Please enter a valid URL.");
      return;
    }
    // 👆 END VALIDATION LOGIC 👆

    setLoading(true);

    const formData = new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product tracked successfully!");
      setUrl("");
    }

    setLoading(false);
  };

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
            className="h-12 text-base"
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