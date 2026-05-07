import Link from "next/link";
import Image from "next/image";
import categories from "@/data/categories.json";

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${cat.slug}`}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all group"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
              <Image
                src={cat.icon}
                alt={cat.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                unoptimized
              />
            </div>
            <span className="text-sm font-bold text-gray-800 group-hover:text-primary text-center leading-tight">
              {cat.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {cat.brands.length} hãng xe
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
