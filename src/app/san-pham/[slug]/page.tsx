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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex gap-1.5">
        <a href="/" className="hover:text-primary">Trang chủ</a>
        <span>/</span>
        <a href="/san-pham" className="hover:text-primary">Sản phẩm</a>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
          {discount && (
            <span className="absolute top-4 left-4 bg-accent text-white font-bold text-sm px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Thương hiệu: <span className="font-semibold text-gray-700">{product.brand}</span></p>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {product.salePrice && (
              <span className="text-gray-400 text-lg line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                ✓ Còn hàng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                Hết hàng
              </span>
            )}
          </div>

          {/* Specs */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Thông số kỹ thuật</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {Object.entries(product.specs).map(([k, v]) => (
                <>
                  <dt key={`k-${k}`} className="text-gray-500">{k}</dt>
                  <dd key={`v-${k}`} className="font-medium text-gray-800">{v}</dd>
                </>
              ))}
            </dl>
          </div>

          <AddToCartButton product={product} />

          {/* Description */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
