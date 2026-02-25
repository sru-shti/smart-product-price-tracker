//smart-product-price-tracker\lib\firecrawl.js
import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["extract"],
     // smart-product-price-tracker/lib/firecrawl.js

      extract: {
        prompt:
          "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', product image URL as 'productImageUrl' if available, and whether the product is currently in stock as a boolean 'inStock'.",
        schema: {
          type: "object",
          properties: {
            productName: { type: "string" },
            currentPrice: { type: "number" },
            currencyCode: { type: "string" },
            productImageUrl: { type: "string" },
            inStock: { type: "boolean" }, // Add this line
          },
          required: ["productName", "currentPrice"],
        },
      },
    });
  
    console.log("🔥 Firecrawl raw result:", result);

    // Firecrawl returns data in result.extract
    const extractedData = result.extract;

    if (!extractedData || !extractedData.productName) {
      throw new Error("No data extracted from URL");
    }

    return extractedData;
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
