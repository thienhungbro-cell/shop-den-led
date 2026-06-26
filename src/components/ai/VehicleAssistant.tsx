"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import Link from "next/link";

type Suggestion = {
  categorySlug: string;
  categoryName: string;
  products: any[];
};

export default function VehicleAssistant({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  // text-only assistant: no voice
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSuggestions([]);
    }
  }, [open]);

  // Simple matching: look for vehicle name tokens inside the categories' vehicles
  function findSuggestions(q: string) {
    const text = q.trim().toLowerCase();
    if (!text) {
      setSuggestions([]);
      return;
    }

    const allProducts = products as any[];

    const results: Suggestion[] = [];
    for (const cat of (categories as any[])) {
      // check if any vehicle name contains the query
      let matched = false;
      for (const brand of cat.brands || []) {
        for (const v of brand.vehicles || []) {
          if (v.name.toLowerCase().includes(text) || text.includes(brand.name.toLowerCase())) {
            matched = true;
            break;
          }
        }
        if (matched) break;
      }

      if (matched) {
        // find top 4 products from this category
        const matchedProducts = allProducts.filter((p) => p.categorySlug === cat.slug).slice(0, 4);
        results.push({ categorySlug: cat.slug, categoryName: cat.name, products: matchedProducts });
      }
    }

    // fallback: try to match against product names
    if (results.length === 0) {
      const fallbackProducts = allProducts.filter((p) => p.name.toLowerCase().includes(text)).slice(0, 6);
      if (fallbackProducts.length) {
        const grp: Suggestion = { categorySlug: "", categoryName: "Gợi ý sản phẩm", products: fallbackProducts };
        results.push(grp);
      }
    }

    setSuggestions(results);
  }

  // text-only: no speech recognition

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-bold">Trợ lý chọn phụ kiện (AI)</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">Đóng</button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">Nói hoặc gõ mẫu xe của bạn (ví dụ: "Honda SH 2021"), mình sẽ gợi ý phụ kiện phù hợp.</p>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập loại xe của bạn..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            />
            <button
              onClick={() => findSuggestions(query)}
              className="bg-primary text-white px-4 py-2 rounded-full"
            >
              Tìm
            </button>
          </div>

          <div className="mt-4">
            {suggestions.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có gợi ý nào. Thử nhập tên xe cụ thể hơn.</p>
            ) : (
              suggestions.map((s) => (
                <div key={s.categorySlug + s.categoryName} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">Gợi ý: {s.categoryName}</h4>
                    {s.categorySlug && (
                      <Link href={`/san-pham?category=${s.categorySlug}`} className="text-sm text-primary">Xem danh mục</Link>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {s.products.map((p) => (
                      <Link key={p.id} href={`/san-pham/${p.slug}`} className="flex flex-col bg-gray-50 p-2 rounded-md border hover:shadow-md">
                        <div className="relative w-full h-24 bg-white rounded-md overflow-hidden">
                          <Image src={p.images[0]} alt={p.name} fill className="object-contain p-2" unoptimized />
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">{p.name}</div>
                        <div className="text-sm text-primary font-bold mt-1">{Number(p.salePrice ?? p.price).toLocaleString()} đ</div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
