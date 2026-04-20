import { notFound } from "next/navigation";
import Link from "next/link";
import categories from "@/data/categories.json";
import type { Category } from "@/types";

export function generateStaticParams() {
  return (categories as Category[]).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  return { title: cat ? `${cat.name} — Lumen Auto` : "Danh mục" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = (categories as Category[]).find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{cat.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cat.name}</h1>
          <p className="text-sm text-gray-500">{cat.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cat.brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/${cat.slug}/${brand.slug}`}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary transition-all p-6 group"
          >
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary mb-3">
              {brand.name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {brand.vehicles.length} dòng xe
            </p>
            <ul className="space-y-1">
              {brand.vehicles.slice(0, 3).map((v) => (
                <li key={v.slug} className="text-sm text-gray-600">
                  • {v.name}
                </li>
              ))}
              {brand.vehicles.length > 3 && (
                <li className="text-sm text-primary font-medium">
                  + {brand.vehicles.length - 3} dòng xe khác
                </li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
}
