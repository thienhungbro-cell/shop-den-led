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
    <span className="bg-accent text-white font-mono font-bold text-lg w-10 h-10 flex items-center justify-center rounded-md">
      {String(n).padStart(2, "0")}
    </span>
  );
}

export default function FlashSale() {
  const flashProducts = (products as unknown as Product[]).filter((p) => p.isFlashSale);
  const { h, m, s } = useCountdown(22);

  if (flashProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-accent via-red-600 to-accent rounded-xl p-6 md:p-8 shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">⚡</span>
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-extrabold">FLASH SALE</h2>
              <p className="text-white/80 text-sm">Ưu đãi hạn chế, mua nhanh kẻo hết!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/20 px-4 py-3 rounded-lg">
            <span className="text-white/80 text-sm font-medium">Kết thúc trong:</span>
            <div className="flex items-center gap-1">
              <Pad n={h} />
              <span className="text-white font-bold text-lg">:</span>
              <Pad n={m} />
              <span className="text-white font-bold text-lg">:</span>
              <Pad n={s} />
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {flashProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
