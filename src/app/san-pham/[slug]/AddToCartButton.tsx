"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { useToastStore } from "@/lib/toastStore";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const addToast = useToastStore((s) => s.addToast);
  const [added, setAdded] = useState(false);

  const alreadyInCart = cartItems.some((item) => item.product.id === product.id);

  function handleAdd() {
    if (!product.inStock) return;
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

  return (
    <button
      onClick={handleAdd}
      disabled={!product.inStock}
      className="w-full flex items-center justify-center gap-2 whitespace-nowrap bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
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
  );
}
