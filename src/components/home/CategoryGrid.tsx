import Link from "next/link";
import categories from "@/data/categories.json";

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/danh-muc/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all group"
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-xs font-medium text-gray-700 group-hover:text-primary text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
