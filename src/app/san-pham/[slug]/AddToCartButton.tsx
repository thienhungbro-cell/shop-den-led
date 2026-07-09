"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toastStore";
import type { Product } from "@/types";
import { playFlyToCartAnimation } from "@/lib/utils";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const addToast = useToastStore((s) => s.addToast);
  const [added, setAdded] = useState(false);

  const alreadyInCart = cartItems.some((item) => item.product.id === product.id);

  function handleAdd() {
    if (!product.inStock) return;

    // Trigger fly-to-cart animation
    const imgElement = document.getElementById("main-product-image");
    if (imgElement) {
      playFlyToCartAnimation(imgElement, product.images[0]);
    }

    addItem(product);
    addToast(
      alreadyInCart
        ? "Sản phẩm đã có trong giỏ, số lượng đã được cập nhật"
        : "Đã thêm vào giỏ hàng",
      "success"
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleQuickOrder() {
    if (!product.inStock) return;
    window.dispatchEvent(
      new CustomEvent("open-quick-order-popup", { detail: { product } })
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        onClick={handleAdd}
        disabled={!product.inStock}
        className="flex-1 flex items-center justify-center gap-2 whitespace-nowrap bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-base cursor-pointer"
      >
        {added ? (
          <>
            <Check size={20} />
            Đã thêm vào giỏ!
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleQuickOrder}
        disabled={!product.inStock}
        className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-base cursor-pointer"
      >
        Mua ngay siêu tốc
      </button>
    </div>
  );
}
