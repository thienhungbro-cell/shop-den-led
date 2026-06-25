import Link from "next/link";
import Image from "next/image";
import categories from "@/data/categories.json";

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Danh mục sản phẩm</h2>
        <p className="text-gray-600 text-sm mt-2">Khám phá các loại đèn xe và phụ kiện ánh sáng chất lượng cao</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${cat.slug}`}
            className="flex flex-col items-center gap-3 p-5 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-primary transition-all group"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-md p-2 group-hover:bg-primary-light transition-colors">
              <Image
                src={cat.icon}
                alt={cat.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                unoptimized
              />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {cat.brands.length} thương hiệu
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
