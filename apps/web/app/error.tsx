'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🤕</div>
        <h1 className="font-display text-4xl md:text-5xl wobbly mb-2">
          Oops! Something <span className="text-crayon-red">Broke</span>
        </h1>
        <p className="font-body text-gray-600 mb-8">
          Don&apos;t worry — it&apos;s not your fault! Our toy engineers are on it.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={reset} className="btn-crayon text-lg px-8 py-3">
            🔄 Try Again
          </button>
          <Link href="/" className="btn-crayon-secondary text-lg px-8 py-3">
            🏠 Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
