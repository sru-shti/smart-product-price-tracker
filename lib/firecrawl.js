// smart-product-price-tracker/lib/firecrawl.js
import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

// 1. Single Product Scraper (For tracking and homepage)
export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["extract"],
      extract: {
        prompt:
          "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code as 'currencyCode', product image URL as 'productImageUrl'. Also check if it's in stock as a boolean 'inStock', and extract any bank offers, credit card discounts, or coupons as a string 'offers'.",
        schema: {
          type: "object",
          properties: {
            productName: { type: "string" },
            currentPrice: { type: "number" },
            currencyCode: { type: "string" },
            productImageUrl: { type: "string" },
            inStock: { type: "boolean" },
            offers: { type: "string" },
          },
          required: ["productName", "currentPrice"],
        },
      },
    });

    console.log("🔥 Firecrawl raw result:", result);
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
// smart-product-price-tracker/lib/firecrawl.js

// smart-product-price-tracker/lib/firecrawl.js

export async function getLiveAmazonDeals(category = "electronics") {
  const categoryUrls = {
    electronics: "https://www.amazon.in/gp/bestsellers/electronics/",
    apparel: "https://www.amazon.in/gp/bestsellers/apparel/",
    kitchen: "https://www.amazon.in/gp/bestsellers/kitchen/",
    beauty: "https://www.amazon.in/gp/bestsellers/beauty/",
    books: "https://www.amazon.in/gp/bestsellers/books/"
  };

  const targetUrl = categoryUrls[category] || categoryUrls.electronics;

  try {
    const result = await firecrawl.scrapeUrl(targetUrl, {
      formats: ["extract"],
      // 👇 OPTIMIZED SETTINGS FOR SPEED 👇
      timeout: 90000, // Increase to 90s just in case
      waitFor: 3000,  // Wait 3s for images to load
      extract: {
        // We simplify the prompt to the absolute minimum
        prompt: "Extract the names, current prices, image URLs, and product links for the top 15 items.",
        schema: {
          type: "object",
          properties: {
            deals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "string" },
                  image_url: { type: "string" },
                  url: { type: "string" },
                  discount: { type: "string" }
                },
                required: ["name", "price", "url"]
              }
            }
          }
        }
      }
    });

    // ... (rest of your filtering and sorting logic)

   

    console.log(`🔥 Extracted Live Deals for ${category}:`, result.extract?.deals?.length);
    
    const deals = result.extract?.deals || [];
    
    const validDeals = deals.filter(deal => 
      deal.name && 
      !deal.name.toLowerCase().includes("product 1") &&
      !deal.name.toLowerCase().includes("goa")
    );

    // ... inside getLiveAmazonDeals
    const formattedDeals = validDeals.map(deal => {
      let finalUrl = deal.url || "";
      if (!finalUrl.startsWith("http")) {
        finalUrl = `https://www.amazon.in${finalUrl.startsWith("/") ? "" : "/"}${finalUrl}`;
      }
      return { ...deal, url: finalUrl };
    });

    const sortedByHighestDiscount = formattedDeals.sort((a, b) => {
      const getDiscountNumber = (discountStr) => {
        if (!discountStr) return 0;
        const match = discountStr.match(/\d+/); 
        return match ? parseInt(match[0]) : 0;
      };
      return getDiscountNumber(b.discount) - getDiscountNumber(a.discount); 
    });

    return sortedByHighestDiscount;
  } catch (error) {
    console.error("Failed to fetch live deals:", error);
    return [];
  }
}

// 3. Competitor Search
export async function searchCompetitorPrice(productName, storeToSearch) {
  try {
    const shortName = productName.split(" ").slice(0, 4).join(" ");
    
    let searchUrl = storeToSearch === "flipkart" 
      ? `https://www.flipkart.com/search?q=${encodeURIComponent(shortName)}`
      : `https://www.amazon.in/s?k=${encodeURIComponent(shortName)}`;

    const result = await firecrawl.scrapeUrl(searchUrl, {
      formats: ["extract"],
      extract: {
        prompt: `Look at these search results. Find the first product that matches or is very similar to "${shortName}". If you find it, set 'found' to true, extract its price as a number, and its product link as 'url'. If no similar product is found, set 'found' to false.`,
        schema: {
          type: "object",
          properties: {
            found: { type: "boolean" },
            price: { type: "number" },
            url: { type: "string" }
          },
          required: ["found"]
        }
      }
    });

    const data = result.extract;
    if (data?.found && data?.price && data?.url) {
      let finalUrl = data.url;
      if (!finalUrl.startsWith("http")) {
        finalUrl = storeToSearch === "flipkart" ? `https://www.flipkart.com${finalUrl}` : `https://www.amazon.in${finalUrl}`;
      }
      return { price: data.price, url: finalUrl };
    }
    
    return null; 
  } catch (error) {
    console.error("Competitor search failed:", error);
    return null;
  }
}