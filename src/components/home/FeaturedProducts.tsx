"use client";

import { Suspense } from "react";
import products from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import type { Product } from "@/types";

function FeaturedProductsInner() {
  const allProducts = products as unknown as Product[];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Tất cả sản phẩm
        </h2>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <FilterSidebar />

        {/* Products grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {allProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturedProducts() {
  return (
    <Suspense fallback={null}>
      <FeaturedProductsInner />
    </Suspense>
  );
}
