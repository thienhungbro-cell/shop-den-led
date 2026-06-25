"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import allProducts from "@/data/products.json";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

type SortBy = "newest" | "price-asc" | "price-desc" | "popular";

export default function ProductsClient() {
  const params = useSearchParams();
  const [localQuery, setLocalQuery] = useState(params.get("q") ?? "");
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? Infinity);

  const filtered = useMemo(() => {
    let results = (allProducts as unknown as Product[]).filter((p) => {
      const matchQ =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      const matchCat = !category || p.categorySlug === category;
      const effectivePrice = p.salePrice ?? p.price;
      const matchPrice = effectivePrice >= minPrice && effectivePrice <= maxPrice;
      return matchQ && matchCat && matchPrice;
    });

    // Sort
    if (sortBy === "price-asc") {
      results.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === "price-desc") {
      results.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortBy === "popular") {
      results.sort(() => Math.random() - 0.5); // Mock popularity
    }

    return results;
  }, [query, category, minPrice, maxPrice, sortBy]);

  const handleSearch = () => {
    const p = new URLSearchParams(params.toString());
    if (localQuery) p.set("q", localQuery);
    else p.delete("q");
    window.location.search = p.toString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search banner */}
      <div className="bg-white border-b border-gray-200 sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar />

          {/* Main content */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-bold text-gray-900">{filtered.length}</span> sản phẩm
              </p>
              
              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm bg-white cursor-pointer hover:border-primary focus:outline-none focus:border-primary"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="popular">Phổ biến</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
                <p className="text-lg text-gray-500">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-sm text-gray-400 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
