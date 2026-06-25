import { notFound } from "next/navigation";
import Image from "next/image";
import allProducts from "@/data/products.json";
import type { Product } from "@/types";
import { formatPrice, calcDiscount } from "@/lib/utils";
import AddToCartButton from "./AddToCartButton";
import ProductCard from "@/components/product/ProductCard";

export function generateStaticParams() {
  return (allProducts as unknown as Product[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (allProducts as unknown as Product[]).find((p) => p.slug === slug);
  return { title: p ? `${p.name} — LampStore` : "Sản phẩm" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (allProducts as unknown as Product[]).find((p) => p.slug === slug);
  if (!product) notFound();

  const discount = product.salePrice
    ? calcDiscount(product.price, product.salePrice)
    : null;

  const related = (allProducts as unknown as Product[])
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-[88px] z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-xs text-gray-600 flex gap-1.5">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <span className="text-gray-400">/</span>
            <a href="/san-pham" className="hover:text-primary transition-colors">Sản phẩm</a>
            <span className="text-gray-400">/</span>
            <span className="text-primary font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-lg p-6 md:p-8 shadow-sm mb-8">
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
              {discount && (
                <span className="absolute top-4 left-4 bg-accent text-white font-bold text-sm px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">{product.brand}</p>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating: always 5 filled stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="border-y border-gray-200 py-4 mb-6">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-extrabold text-primary">
                  {product.price === 0 && !product.salePrice ? "Liên hệ" : formatPrice(product.salePrice ?? product.price)}
                </span>
                {product.salePrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock & Actions */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 px-4 py-2 rounded-md">
                    ✓ Còn hàng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-gray-500 text-sm font-semibold bg-gray-100 px-4 py-2 rounded-md">
                    Hết hàng
                  </span>
                )}
              </div>
              
              <AddToCartButton product={product} />
            </div>

            {/* Specs Quick View */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">Thông số chính</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <p className="text-gray-600">{k}</p>
                    <p className="font-semibold text-gray-900">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Description tab */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            {/* Full specs */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông số kỹ thuật chi tiết</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([k, v], idx) => (
                    <tr key={k} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-700 border-b border-gray-200 w-40">{k}</td>
                      <td className="px-4 py-3 text-gray-600 border-b border-gray-200">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">Sản phẩm liên quan</h2>
              <p className="text-gray-600 text-sm mt-2">Các sản phẩm cùng danh mục có thể bạn quan tâm</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
