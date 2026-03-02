"use client";

import { useState, useEffect } from "react";
import products from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

function useCountdown(targetHour: number) {
  const getRemaining = () => {
    const now = new Date();
    const target = new Date();
    target.setHours(targetHour, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
    return {
      h: Math.floor(diff / 3600),
      m: Math.floor((diff % 3600) / 60),
      s: diff % 60,
    };
  };

  const [time, setTime] = useState(getRemaining);

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  });

  return time;
}

function Pad({ n }: { n: number }) {
  return (
    <span className="bg-gray-900 text-white font-mono font-bold text-xl w-10 h-10 flex items-center justify-center rounded">
      {String(n).padStart(2, "0")}
    </span>
  );
}

export default function FlashSale() {
  const flashProducts = (products as unknown as Product[]).filter((p) => p.isFlashSale);
  const { h, m, s } = useCountdown(22); // countdown đến 22:00

  if (flashProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-primary to-red-700 rounded-2xl p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-white text-xl font-bold">FLASH SALE</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/80 text-sm">Kết thúc trong:</span>
            <Pad n={h} />
            <span className="text-white font-bold">:</span>
            <Pad n={m} />
            <span className="text-white font-bold">:</span>
            <Pad n={s} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {flashProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
