// smart-product-price-tracker/app/api/cron/check-prices/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeProduct } from "@/lib/firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;

    console.log(`Found ${products.length} products to check`);

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertsSent: 0,
    };

    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url);

        if (!productData.currentPrice) {
          results.failed++;
          continue;
        }

        const newPrice = parseFloat(productData.currentPrice);
        const oldPrice = parseFloat(product.current_price);

        await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            in_stock: productData.inStock !== false, // Stock Status logic
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        // 1. Update the chart history ONLY if the price changed
        if (oldPrice !== newPrice) {
          await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
          });
          results.priceChanges++;
        }

        // 2. Determine if we should send an email based on the TARGET PRICE
        let shouldSendEmail = false;

        if (product.target_price && newPrice <= parseFloat(product.target_price)) {
          // Send email if it hits your custom target price!
          shouldSendEmail = true;
        } else if (!product.target_price && newPrice < oldPrice) {
          // If you didn't set a target, send email if it dropped at all
          shouldSendEmail = true;
        }

        // 3. Send the email
        if (shouldSendEmail) {
          const {
            data: { user },
          } = await supabase.auth.admin.getUserById(product.user_id);

          if (user?.email) {
            const emailResult = await sendPriceDropAlert(
              user.email,
              product,
              oldPrice,
              newPrice
            );

            if (emailResult.success) {
              results.alertsSent++;
            }
          }
        }

        results.updated++;
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Price check endpoint is working. Use POST to trigger.",
  });
}