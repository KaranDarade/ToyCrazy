export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-6xl mb-4 animate-bounce">🧸</div>
      <div className="font-display text-2xl text-gray-500 animate-pulse">
        Loading toys...
      </div>
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full bg-crayon-yellow border-2 border-ink"
            style={{ animation: `loadingBounce 1s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
