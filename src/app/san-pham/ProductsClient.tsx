"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import allProducts from "@/data/products.json";
import categories from "@/data/categories.json";
import FilterSidebar from "@/components/product/FilterSidebar";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

type SortBy = "newest" | "price-asc" | "price-desc" | "popular";

const PRICE_RANGES = [
  { label: "Dưới 500.000đ", min: 0, max: 500000 },
  { label: "500k – 1 triệu", min: 500000, max: 1000000 },
  { label: "1 – 3 triệu", min: 1000000, max: 3000000 },
  { label: "Trên 3 triệu", min: 3000000, max: Infinity },
];

const ALL_BRANDS = Array.from(
  new Set((allProducts as unknown as Product[]).map((p) => p.brand))
).sort();

// Extract unique vehicle brands dynamically
const VEHICLE_BRANDS = Array.from(
  new Map(
    categories.flatMap((cat) =>
      cat.brands.map((b) => [b.slug, { slug: b.slug, name: b.name }])
    )
  ).values()
);

export default function ProductsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const minPrice = Number(params.get("minPrice") ?? 0);
  const maxPrice = Number(params.get("maxPrice") ?? Infinity);
  const brand = params.get("brand") ?? "";
  const vehicleBrand = params.get("vehicleBrand") ?? "";

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`/san-pham?${p.toString()}`);
  }

  function setPriceRange(min: number, max: number) {
    const p = new URLSearchParams(params.toString());
    const currentMin = Number(params.get("minPrice") ?? 0);
    const currentMax = Number(params.get("maxPrice") ?? Infinity);
    if (currentMin === min && currentMax === max) {
      p.delete("minPrice");
      p.delete("maxPrice");
    } else {
      p.set("minPrice", String(min));
      if (max === Infinity) p.delete("maxPrice");
      else p.set("maxPrice", String(max));
    }
    router.push(`/san-pham?${p.toString()}`);
  }

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category) count++;
    if (brand) count++;
    if (minPrice > 0 || maxPrice < Infinity) count++;
    if (vehicleBrand) count++;
    return count;
  }, [category, brand, minPrice, maxPrice, vehicleBrand]);

  const hasActiveTopFilter = brand || minPrice > 0 || maxPrice < Infinity;
  const hasAnyActiveFilter = activeFilterCount > 0;

  const filtered = useMemo(() => {
    let results = (allProducts as unknown as Product[]).filter((p) => {
      const matchQ =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      const matchCat = !category || p.categorySlug === category;
      const effectivePrice = p.salePrice ?? p.price;
      const matchPrice = effectivePrice >= minPrice && effectivePrice <= maxPrice;
      const matchBrand = !brand || p.brand.toLowerCase() === brand.toLowerCase();
      const matchVehicleBrand =
        !vehicleBrand ||
        p.vehicleSlug === "universal" ||
        (p.vehicleSlug && p.vehicleSlug.toLowerCase() === vehicleBrand.toLowerCase());
      return matchQ && matchCat && matchPrice && matchBrand && matchVehicleBrand;
    });

    if (sortBy === "price-asc") {
      results.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === "price-desc") {
      results.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else if (sortBy === "popular") {
      results.sort(() => Math.random() - 0.5);
    }

    return results;
  }, [query, category, minPrice, maxPrice, brand, vehicleBrand, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">

        {/* Desktop Horizontal filter bar */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Price row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest w-28 shrink-0">
              Khoảng giá
            </span>
            <div className="flex flex-wrap gap-2.5">
              {PRICE_RANGES.map((r) => {
                const isActive = minPrice === r.min && maxPrice === r.max;
                return (
                  <button
                    key={r.label}
                    onClick={() => setPriceRange(r.min, r.max)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary-light/10"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Brand row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest w-28 shrink-0">
              Bộ sưu tập
            </span>
            <div className="flex flex-wrap gap-2.5 items-center flex-1">
              {ALL_BRANDS.map((b) => {
                const isActive = brand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    onClick={() => setParam("brand", isActive ? "" : b)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary-light/10"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom actions if filters are active */}
          {hasActiveTopFilter && (
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Đang áp dụng bộ lọc nâng cao
              </span>
              <button
                onClick={() => {
                  const p = new URLSearchParams(params.toString());
                  p.delete("brand");
                  p.delete("minPrice");
                  p.delete("maxPrice");
                  router.push(`/san-pham?${p.toString()}`);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 hover:text-primary hover:border-primary transition-all duration-200"
              >
                <X size={14} />
                Chọn lại (Xóa lọc)
              </button>
            </div>
          )}
        </div>

        {/* Mobile filter bar */}
        <div className="flex md:hidden items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SlidersHorizontal size={16} className="text-primary" />
            <span>Bộ lọc {hasAnyActiveFilter ? `(${activeFilterCount})` : ""}</span>
          </button>
          
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="w-full appearance-none text-center py-2 pr-8 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg border-none hover:bg-gray-100 cursor-pointer focus:outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="popular">Phổ biến</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Sidebar + Products */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-bold text-gray-900">{filtered.length}</span> sản phẩm
              </p>

              {/* Sort dropdown (desktop only, hidden on mobile in favor of top mobile bar) */}
              <div className="hidden md:flex items-center gap-2">
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

      {/* Mobile Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl p-5 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                Bộ lọc sản phẩm
              </h3>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Danh mục</h4>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => {
                        setParam("category", "");
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !category
                          ? "bg-primary text-white"
                          : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      Tất cả danh mục
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => {
                          setParam("category", cat.slug);
                          setIsFilterDrawerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                          category === cat.slug
                            ? "bg-primary text-white"
                            : "text-gray-600 bg-gray-50 hover:bg-gray-100"
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

              {/* Brands (Collection) */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bộ sưu tập</h4>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => setParam("brand", "")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !brand
                          ? "bg-primary text-white"
                          : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      Tất cả hãng sản xuất
                    </button>
                  </li>
                  {ALL_BRANDS.map((b) => (
                    <li key={b}>
                      <button
                        onClick={() => setParam("brand", brand.toLowerCase() === b.toLowerCase() ? "" : b)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          brand.toLowerCase() === b.toLowerCase()
                            ? "bg-primary text-white"
                            : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {b}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Ranges */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Khoảng giá</h4>
                <ul className="space-y-1.5">
                  {PRICE_RANGES.map((r) => {
                    const isActive = minPrice === r.min && maxPrice === r.max;
                    return (
                      <li key={r.label}>
                        <button
                          onClick={() => setPriceRange(r.min, r.max)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          {r.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Vehicle Brands */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Hãng xe</h4>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => setParam("vehicleBrand", "")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !vehicleBrand
                          ? "bg-primary text-white"
                          : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      Tất cả hãng xe
                    </button>
                  </li>
                  {VEHICLE_BRANDS.map((vb) => (
                    <li key={vb.slug}>
                      <button
                        onClick={() => setParam("vehicleBrand", vehicleBrand === vb.slug ? "" : vb.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          vehicleBrand === vb.slug
                            ? "bg-primary text-white"
                            : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {vb.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  const p = new URLSearchParams(params.toString());
                  p.delete("category");
                  p.delete("brand");
                  p.delete("minPrice");
                  p.delete("maxPrice");
                  p.delete("vehicleBrand");
                  router.push(`/san-pham?${p.toString()}`);
                  setIsFilterDrawerOpen(false);
                }}
                className="flex-1 py-2.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Xóa lọc
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors text-center shadow-md shadow-primary/20"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


