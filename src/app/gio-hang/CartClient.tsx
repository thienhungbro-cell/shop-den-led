"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartClient() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link
          href="/san-pham"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            >
              <Link href={`/san-pham/${product.slug}`} className="shrink-0">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/san-pham/${product.slug}`}>
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-primary">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-primary font-bold mt-1">
                  {formatPrice(product.salePrice ?? product.price)}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  {/* Qty controls */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(product.id, quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQty(product.id, quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-gray-900 text-sm">
                  {formatPrice((product.salePrice ?? product.price) * quantity)}
                </span>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            Xóa toàn bộ
          </button>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Tóm tắt đơn hàng</h3>
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Tạm tính</span>
              <span className="font-medium">{formatPrice(totalPrice())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold">Tổng cộng</span>
              <span className="font-bold text-primary text-lg">{formatPrice(totalPrice())}</span>
            </div>
          </div>

          <Link
            href="/lien-he"
            className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Đặt hàng ngay
          </Link>
          <Link
            href="/san-pham"
            className="block w-full text-center text-primary text-sm mt-3 hover:underline"
          >
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
