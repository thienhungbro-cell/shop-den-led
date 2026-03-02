import products from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import type { Product } from "@/types";

export default function FeaturedProducts() {
  const featured = (products as unknown as Product[]).filter((p) => p.featured).slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          ⭐ Sản phẩm nổi bật
        </h2>
        <Link
          href="/san-pham"
          className="text-sm text-primary hover:underline font-medium"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
