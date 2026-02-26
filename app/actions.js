// smart-product-price-tracker/app/actions.js
"use server";

import { getLiveAmazonDeals } from "@/lib/firecrawl";
import { createClient } from "@/utils/supabase/server";
import { scrapeProduct } from "@/lib/firecrawl";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { searchCompetitorPrice } from "@/lib/firecrawl";

export async function addProduct(formData) {
  const url = formData.get("url");

  if (!url) {
    return { error: "URL is required" };
  }

  // 👇 BACKEND URL VALIDATION 👇
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    const isValidStore = 
      hostname.includes('amazon') || 
      hostname.includes('amzn') || 
      hostname.includes('flipkart');

    if (!isValidStore) {
      return { error: "PriceScout currently only supports Amazon and Flipkart URLs." };
    }
  } catch (error) {
    return { error: "Please enter a valid URL format." };
  }
  // 👆 END VALIDATION 👆

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Scrape product data with Firecrawl
    const productData = await scrapeProduct(url);

    if (!productData.productName || !productData.currentPrice) {
      console.log(productData, "productData");
      return { error: "Could not extract product information from this URL" };
    }

    const newPrice = parseFloat(productData.currentPrice);
    const currency = productData.currencyCode || "USD";

    // Check if product exists to determine if it's an update
    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    const isUpdate = !!existingProduct;

  // Upsert product (insert or update based on user_id + url)
    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          url,
          name: productData.productName,
          current_price: newPrice,
          currency: currency,
          image_url: productData.productImageUrl,
          in_stock: productData.inStock !== false, 
          offers: productData.offers || "No special offers detected", // 👇 ADD THIS LINE
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,url",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw error;

    // Add to price history if it's a new product OR price changed
    const shouldAddHistory =
      !isUpdate || existingProduct.current_price !== newPrice;

    if (shouldAddHistory) {
      await supabase.from("price_history").insert({
        product_id: product.id,
        price: newPrice,
        currency: currency,
      });
    }

    revalidatePath("/");
    return {
      success: true,
      product,
      message: isUpdate
        ? "Product updated with latest price!"
        : "Product added successfully!",
    };
  } catch (error) {
    console.error("Add product error:", error);
    return { error: error.message || "Failed to add product" };
  }
}

export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get price history error:", error);
    return [];
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function getProductById(productId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Get product error:", error);
    return null;
  }
}

// Add this at the bottom of app/actions.js
export async function saveToCart(productId) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ in_cart: true })
      .eq("id", productId);

    if (error) throw error;
    
    revalidatePath("/cart");
    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getCompetitor(productName, store) {
  return await searchCompetitorPrice(productName, store);
}

export async function refreshTrendingDeals(category = "electronics") {
  try {
    const supabase = await createClient();
    
    // 1. Fetch fresh data from Firecrawl (The slow part)
    const freshDeals = await getLiveAmazonDeals(category);
    
    if (freshDeals && freshDeals.length > 0) {
      // 2. Clear out the old stale deals for this specific category
      await supabase.from("trending_deals").delete().eq("category", category);
      
      // 3. Prepare data for insertion
      const dealsToSave = freshDeals.map(deal => ({
        category,
        name: deal.name,
        price: deal.price,
        original_price: deal.original_price,
        discount: deal.discount,
        image_url: deal.image_url,
        url: deal.url,
        updated_at: new Date().toISOString()
      }));
      
      // 4. Save to database (The fast part for the next user)
      const { error } = await supabase.from("trending_deals").insert(dealsToSave);
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to refresh deals:", error);
    return { error: error.message };
  }
}