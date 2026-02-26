export const metadata = { title: "About Us | PriceScout" };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About PriceScout</h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        PriceScout was built to solve a simple problem: e-commerce sites change their prices daily, and shoppers are missing out on the best deals. 
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mb-8">
        We use advanced AI scraping technology to track the true price of products across Amazon and Flipkart, analyzing bank offers, stock availability, and historical data to tell you exactly when to buy.
      </p>
      <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
        <h3 className="text-2xl font-semibold text-orange-800 mb-2">Our Mission</h3>
        <p className="text-orange-700">To make online shopping transparent, affordable, and stress-free.</p>
      </div>
    </div>
  );
}