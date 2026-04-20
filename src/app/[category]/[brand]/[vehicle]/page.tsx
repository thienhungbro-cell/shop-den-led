import { notFound } from "next/navigation";
import Link from "next/link";
import categories from "@/data/categories.json";
import allProducts from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";
import type { Category, Product } from "@/types";

export function generateStaticParams() {
  const params: { category: string; brand: string; vehicle: string }[] = [];
  for (const cat of categories as Category[]) {
    for (const brand of cat.brands) {
      for (const vehicle of brand.vehicles) {
        params.push({
          category: cat.slug,
          brand: brand.slug,
          vehicle: vehicle.slug,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; brand: string; vehicle: string }>;
}) {
  const { category, brand, vehicle } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  const b = cat?.brands.find((br) => br.slug === brand);
  const v = b?.vehicles.find((ve) => ve.slug === vehicle);
  return {
    title:
      cat && b && v
        ? `${v.name} — ${cat.name} — Lumen Auto`
        : "Sản phẩm",
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ category: string; brand: string; vehicle: string }>;
}) {
  const { category, brand, vehicle } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  if (!cat) notFound();

  const b = cat.brands.find((br) => br.slug === brand);
  if (!b) notFound();

  const v = b.vehicles.find((ve) => ve.slug === vehicle);
  if (!v) notFound();

  const products = (allProducts as unknown as Product[]).filter(
    (p) =>
      p.categorySlug === cat.slug &&
      p.brandSlug === brand &&
      p.vehicleSlug === vehicle
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href={`/${cat.slug}`} className="hover:text-primary">
          {cat.name}
        </Link>
        <span>/</span>
        <Link
          href={`/${cat.slug}/${brand}`}
          className="hover:text-primary"
        >
          {b.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{v.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {cat.name} — {v.name}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {products.length} sản phẩm
      </p>

      {products.length === 0 ? (
        <p className="text-gray-400 text-center py-16">
          Chưa có sản phẩm cho dòng xe này.
        </p>
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
