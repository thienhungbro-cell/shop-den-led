"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import allProducts from "@/data/products.json";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default function ProductsClient() {
  const params = useSearchParams();
  const [localQuery, setLocalQuery] = useState(params.get("q") ?? "");

  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? Infinity);

  const filtered = useMemo(() => {
    return (allProducts as unknown as Product[]).filter((p) => {
      const matchQ =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      const matchCat = !category || p.categoryId === category;
      const effectivePrice = p.salePrice ?? p.price;
      const matchPrice = effectivePrice >= minPrice && effectivePrice <= maxPrice;
      return matchQ && matchCat && matchPrice;
    });
  }, [query, category, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="relative mb-6 max-w-lg">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const p = new URLSearchParams(params.toString());
              if (localQuery) p.set("q", localQuery);
              else p.delete("q");
              window.location.search = p.toString();
            }
          }}
          className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
        <Search
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      <div className="flex gap-6">
        <FilterSidebar />

        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">
            Tìm thấy <span className="font-semibold text-gray-800">{filtered.length}</span> sản phẩm
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Không tìm thấy sản phẩm phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
