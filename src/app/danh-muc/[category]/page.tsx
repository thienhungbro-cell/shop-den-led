import { notFound } from "next/navigation";
import allProducts from "@/data/products.json";
import categories from "@/data/categories.json";
import type { Product, Category } from "@/types";
import ProductCard from "@/components/product/ProductCard";

export function generateStaticParams() {
  return (categories as Category[]).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  return { title: cat ? `${cat.name} — LampStore` : "Danh mục" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  if (!cat) notFound();

  const products = (allProducts as unknown as Product[]).filter(
    (p) => p.categoryId === cat.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{cat.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cat.name}</h1>
          <p className="text-sm text-gray-500">{products.length} sản phẩm</p>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Chưa có sản phẩm trong danh mục này.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
