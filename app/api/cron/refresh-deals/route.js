import { refreshTrendingDeals } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET(request) {
  // 1. Security Check: Ensure only Vercel can trigger this
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const categories = ["electronics", "apparel", "kitchen", "beauty", "books"];
  
  try {
    console.log("🚀 Starting Hourly Cron Refresh...");
    
    // 2. Refresh each category one by one
    // We don't use Promise.all to avoid hitting Firecrawl rate limits
    for (const category of categories) {
      console.log(`Scraping category: ${category}`);
      await refreshTrendingDeals(category);
    }

    return NextResponse.json({ 
      success: true, 
      message: "All categories refreshed and sorted successfully." 
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}