"use client";

import { useEffect, useState } from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartReminderPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return visitor reminder (Welcome back with cart items)
  useEffect(() => {
    if (!mounted) return;

    const hasCheckedSession = sessionStorage.getItem("cart-session-initialized");
    if (!hasCheckedSession) {
      sessionStorage.setItem("cart-session-initialized", "true");
      // If user returns with items already in cart, show popup after 2 seconds
      if (totalItems > 0) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [mounted, totalItems]);



  if (!mounted || !isOpen || totalItems === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fade-in_0.2s_ease-out_forwards]"
      onClick={(e) => {
        // Close modal when clicking on the backdrop
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-2xl animate-[slide-in_0.3s_ease-out_forwards]">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent w-full" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Đóng popup"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-6 text-left">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-50 text-primary rounded-2xl animate-bounce">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                Bạn ơi! Đừng bỏ lỡ giỏ hàng
              </h3>
              <p className="text-xs text-gray-500">
                Bạn đang có {totalItems} sản phẩm chưa thanh toán trong giỏ.
              </p>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="max-h-44 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl px-3 bg-gray-50/50 mb-5">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-3 py-3 items-center">
                <div className="relative w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary">
                    {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-5">
            <span className="text-sm font-semibold text-gray-700">Tổng thanh toán:</span>
            <span className="text-lg font-black text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link
              href="/gio-hang"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>Xem giỏ hàng & Thanh toán</span>
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-800 py-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
