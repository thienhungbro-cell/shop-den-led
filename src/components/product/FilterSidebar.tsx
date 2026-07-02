"use client";

import { useRouter, useSearchParams } from "next/navigation";
import categories from "@/data/categories.json";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";

const PRICE_RANGES = [
  { label: "Dưới 500.000đ", min: 0, max: 500000 },
  { label: "500.000 – 1.000.000đ", min: 500000, max: 1000000 },
  { label: "1.000.000 – 3.000.000đ", min: 1000000, max: 3000000 },
  { label: "Trên 3.000.000đ", min: 3000000, max: Infinity },
];

export default function FilterSidebar({ basePath = "/san-pham" }: { basePath?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const activeCategory = params.get("category") ?? "";
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? Infinity);

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`${basePath}?${p.toString()}`);
  }

  function setPriceRange(min: number, max: number) {
    const p = new URLSearchParams(params.toString());
    p.set("minPrice", String(min));
    if (max === Infinity) p.delete("maxPrice");
    else p.set("maxPrice", String(max));
    router.push(`${basePath}?${p.toString()}`);
  }

  function clearFilters() {
    const p = new URLSearchParams(params.toString());
    p.delete("category");
    p.delete("minPrice");
    p.delete("maxPrice");
    router.push(`${basePath}?${p.toString()}`);
  }

  return (
    <aside className="w-full md:w-56 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden sticky top-24">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-red-700 px-4 py-3 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm">
            <SlidersHorizontal size={15} />
            Bộ lọc sản phẩm
          </h3>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-[11px] font-medium text-white/80 border border-white/30 rounded-md px-2 py-0.5 hover:text-white hover:border-white/60 hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>
            Xóa lọc
          </button>
        </div>

        <div className="p-3 space-y-5">
          {/* Category filter */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              Danh mục
            </p>
            <ul className="space-y-0.5">
              <li>
                <button
                  onClick={() => setParam("category", "")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                    !activeCategory
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${!activeCategory ? "bg-white" : "bg-gray-300"}`} />
                  Tất cả
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setParam("category", cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                      activeCategory === cat.slug
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    <div className="relative w-4 h-4 flex-shrink-0">
                      <Image src={cat.icon} alt="" fill className="object-contain" unoptimized />
                    </div>
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-gray-100" />

          {/* Price filter */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              Khoảng giá
            </p>
            <ul className="space-y-0.5">
              {PRICE_RANGES.map((r) => {
                const isActive = minPrice === r.min && maxPrice === r.max;
                return (
                  <li key={r.label}>
                    <button
                      onClick={() => setPriceRange(r.min, r.max)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-white" : "bg-gray-300"}`} />
                      {r.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
