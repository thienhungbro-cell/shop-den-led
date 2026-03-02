"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Tag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount =
    product.salePrice ? calcDiscount(product.price, product.salePrice) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group flex flex-col">
      {/* Image */}
      <Link href={`/san-pham/${product.slug}`} className="relative block overflow-hidden rounded-t-xl">
        <div className="relative aspect-square w-full bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag size={10} />
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
              Hết hàng
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-primary font-bold text-base">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {product.salePrice && (
              <span className="text-gray-400 text-xs line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={() => product.inStock && addItem(product)}
            disabled={!product.inStock}
            className="mt-2 w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            <ShoppingCart size={15} />
            {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}
