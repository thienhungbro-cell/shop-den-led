"use client";

import { useRouter, useSearchParams } from "next/navigation";
import categories from "@/data/categories.json";
import { SlidersHorizontal } from "lucide-react";

const PRICE_RANGES = [
  { label: "Dưới 500.000đ", min: 0, max: 500000 },
  { label: "500.000 – 1.000.000đ", min: 500000, max: 1000000 },
  { label: "1.000.000 – 3.000.000đ", min: 1000000, max: 3000000 },
  { label: "Trên 3.000.000đ", min: 3000000, max: Infinity },
];

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const activeCategory = params.get("category") ?? "";
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? Infinity);

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`/san-pham?${p.toString()}`);
  }

  function setPriceRange(min: number, max: number) {
    const p = new URLSearchParams(params.toString());
    p.set("minPrice", String(min));
    if (max === Infinity) p.delete("maxPrice");
    else p.set("maxPrice", String(max));
    router.push(`/san-pham?${p.toString()}`);
  }

  function clearFilters() {
    const p = new URLSearchParams(params.toString());
    p.delete("category");
    p.delete("minPrice");
    p.delete("maxPrice");
    router.push(`/san-pham?${p.toString()}`);
  }

  return (
    <aside className="w-full md:w-60 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
            <SlidersHorizontal size={16} className="text-primary" />
            Bộ lọc
          </h3>
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-primary"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Category filter */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-2">Danh mục</p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setParam("category", "")}
                className={`text-sm w-full text-left px-2 py-1 rounded transition-colors ${
                  !activeCategory
                    ? "text-primary font-semibold"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                Tất cả
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setParam("category", cat.slug)}
                  className={`text-sm w-full text-left px-2 py-1 rounded transition-colors flex items-center gap-1.5 ${
                    activeCategory === cat.slug
                      ? "text-primary font-semibold bg-primary-light"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price filter */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Giá</p>
          <ul className="space-y-1">
            {PRICE_RANGES.map((r) => {
              const isActive = minPrice === r.min && maxPrice === r.max;
              return (
                <li key={r.label}>
                  <button
                    onClick={() => setPriceRange(r.min, r.max)}
                    className={`text-sm w-full text-left px-2 py-1 rounded transition-colors ${
                      isActive
                        ? "text-primary font-semibold bg-primary-light"
                        : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    {r.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
