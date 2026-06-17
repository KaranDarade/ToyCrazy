'use client';

import Link from 'next/link';

interface CategoryBubbleProps {
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export function CategoryBubble({ name, slug, color, icon }: CategoryBubbleProps) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className="group flex flex-col items-center gap-2 p-4 md:p-6 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
      style={{ background: `${color}22`, border: '3px solid #2D2D2D' }}
      aria-label={`Browse ${name}`}
    >
      <span className="text-3xl md:text-4xl group-hover:animate-wiggle" aria-hidden="true">
        {icon}
      </span>
      <span className="font-display text-sm md:text-base text-center leading-tight">
        {name}
      </span>
    </Link>
  );
}
