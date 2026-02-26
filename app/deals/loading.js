export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mb-8"></div>
      <div className="flex gap-3 mb-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-100 animate-pulse rounded-full"></div>
        ))}
      </div>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}