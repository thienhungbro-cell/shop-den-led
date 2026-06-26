"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Tag, Star, Eye } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toastStore";
import { formatPrice, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const addToast = useToastStore((s) => s.addToast);
  const discount =
    product.salePrice ? calcDiscount(product.price, product.salePrice) : null;

  const alreadyInCart = cartItems.some((item) => item.product.id === product.id);
  
  // Always display 5 stars (no numeric review count)

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col relative">
      {/* Image */}
      <Link href={`/san-pham/${product.slug}`} className="relative block overflow-hidden rounded-t-lg">
        <div className="relative aspect-[4/3] w-full bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            unoptimized
          />
        </div>

        {/* Hover overlay with quick view */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
          <div className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-md font-medium transition-all">
            <Eye size={16} />
            Xem chi tiết
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
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
        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{product.brand}</div>
        
        {/* Rating: always 5 filled stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>

        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto space-y-2">
          {/* Price */}
          <div className="flex items-baseline gap-3">
            {product.price === 0 && !product.salePrice ? (
              <span className="text-sm text-gray-600 font-medium">Liên hệ giá</span>
            ) : (
              <>
                <span className="text-primary font-extrabold text-lg">
                  {formatPrice(product.salePrice ?? product.price)}
                </span>
                {product.salePrice && (
                  <span className="text-gray-400 text-sm line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!product.inStock) return;
                addItem(product);
                addToast(
                  alreadyInCart
                    ? "Sản phẩm đã có trong giỏ, số lượng đã được cập nhật"
                    : "Đã thêm vào giỏ hàng",
                  "success"
                );
              }}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 whitespace-nowrap bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white text-sm font-medium py-2 rounded-md transition-colors"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Giỏ</span>
            </button>
            <Link
              href={`/san-pham/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium py-2 rounded-md transition-colors"
            >
              <span>Mua ngay</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
