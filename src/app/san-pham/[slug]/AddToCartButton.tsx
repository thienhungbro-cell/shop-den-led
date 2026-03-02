"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!product.inStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!product.inStock}
      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
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
