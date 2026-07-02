import products from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types";

export default function FeaturedProducts() {
  const allProducts = products as unknown as Product[];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Tất cả sản phẩm
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {allProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
