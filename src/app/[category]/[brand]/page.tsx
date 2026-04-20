import { notFound } from "next/navigation";
import Link from "next/link";
import categories from "@/data/categories.json";
import allProducts from "@/data/products.json";
import type { Category, Product } from "@/types";

export function generateStaticParams() {
  const params: { category: string; brand: string }[] = [];
  for (const cat of categories as Category[]) {
    for (const brand of cat.brands) {
      params.push({ category: cat.slug, brand: brand.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const { category, brand } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  const b = cat?.brands.find((br) => br.slug === brand);
  return {
    title: cat && b ? `${b.name} — ${cat.name} — Lumen Auto` : "Danh mục",
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const { category, brand } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  if (!cat) notFound();

  const b = cat.brands.find((br) => br.slug === brand);
  if (!b) notFound();

  const products = (allProducts as unknown as Product[]).filter(
    (p) => p.categorySlug === cat.slug && p.brandSlug === brand
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href={`/${cat.slug}`} className="hover:text-primary">
          {cat.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{b.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {cat.name} — {b.name}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {products.length} sản phẩm • {b.vehicles.length} dòng xe
      </p>

      {/* Vehicle model links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {b.vehicles.map((vehicle) => {
          const count = products.filter(
            (p) => p.vehicleSlug === vehicle.slug
          ).length;
          return (
            <Link
              key={vehicle.slug}
              href={`/${cat.slug}/${brand}/${vehicle.slug}`}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary transition-all p-5 group"
            >
              <h3 className="font-bold text-gray-800 group-hover:text-primary mb-1">
                {vehicle.name}
              </h3>
              <p className="text-sm text-gray-500">{count} sản phẩm</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
