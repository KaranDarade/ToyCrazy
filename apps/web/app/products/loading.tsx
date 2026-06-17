export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[20px_8px_20px_8px] border-3 border-ink bg-white p-3 animate-pulse"
            style={{ transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)` }}
          >
            <div className="aspect-square bg-gray-200 rounded-[16px_6px_16px_6px] mb-3" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
