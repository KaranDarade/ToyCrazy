'use client';

import { useEffect, useState } from 'react';

interface Doodle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  rotation: number;
}

const emojis = ['✦', '⬭', '⬮', '⬬', '✦', '⬭', '⬮', '⬬'];
const shapes = ['△', '◇', '○', '☆', '⬠', '⬡', '♢', '♤', '♧', '♡'];

export function BackgroundDoodles() {
  const [doodles, setDoodles] = useState<Doodle[]>([]);

  useEffect(() => {
    const items: Doodle[] = [];
    const allSymbols = [...emojis, ...shapes];

    for (let i = 0; i < 18; i++) {
      items.push({
        id: i,
        emoji: allSymbols[Math.floor(Math.random() * allSymbols.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 14 + Math.random() * 20,
        speed: 15 + Math.random() * 25,
        delay: Math.random() * 10,
        rotation: Math.random() * 360,
      });
    }
    setDoodles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {doodles.map((d) => (
        <div
          key={d.id}
          className="absolute text-ink/8 select-none"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            fontSize: `${d.size}px`,
            animation: `doodleFloat ${d.speed}s ease-in-out ${d.delay}s infinite alternate`,
            transform: `rotate(${d.rotation}deg)`,
          }}
        >
          {d.emoji}
        </div>
      ))}

      {/* Subtle dotted grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #2D2D2D 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <style>{`
        @keyframes doodleFloat {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.08; }
          50% { transform: translateY(-30px) rotate(5deg); opacity: 0.12; }
          100% { transform: translateY(10px) rotate(-3deg); opacity: 0.06; }
        }
      `}</style>
    </div>
  );
}
