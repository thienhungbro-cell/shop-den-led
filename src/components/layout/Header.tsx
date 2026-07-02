"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, X, Zap } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import categories from "@/data/categories.json";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-40 bg-[#d70018] shadow-md">
      {/* Top bar */}
      <div className="bg-[#b00010] text-white text-[10px] sm:text-xs py-1.5 overflow-hidden leading-tight border-b border-white/5">
        <div className="animate-marquee whitespace-nowrap inline-block">
          💡 XUÂN LỢI STORE &nbsp;—&nbsp; NÂNG TẦM ÁNH SÁNG, AN TOÀN TRÊN MỌI HÀNH TRÌNH &nbsp;—&nbsp; Hotline hỗ trợ:{" "}
          <a href="tel:0359663118" className="font-bold underline">
            0359663118
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          💡 XUÂN LỢI STORE &nbsp;—&nbsp; NÂNG TẦM ÁNH SÁNG, AN TOÀN TRÊN MỌI HÀNH TRÌNH &nbsp;—&nbsp; Hotline hỗ trợ:{" "}
          <a href="tel:0359663118" className="font-bold underline">
            0359663118
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {searchOpen && (
          <div className="flex md:hidden items-center gap-3 w-full animate-slide-in">
            <button
              onClick={() => setSearchOpen(false)}
              className="text-white bg-white/10 border border-white/20 rounded-xl p-2 hover:bg-white/20 transition"
            >
              <X size={20} />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query) {
                    window.location.href = `/san-pham?q=${encodeURIComponent(query)}`;
                  }
                }}
                className="w-full bg-white border border-gray-100 rounded-full pl-4 pr-10 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400 transition-all duration-200"
              />
              <Link
                href={query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <Search size={18} />
              </Link>
            </div>
            <Link
              href="/gio-hang"
              className="relative text-white bg-white/10 border border-white/20 rounded-xl p-2 flex items-center gap-1 hover:bg-white/20 transition whitespace-nowrap"
            >
              <ShoppingCart size={24} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#d70018] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border border-[#d70018]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        <div className={`flex-1 grid grid-cols-3 items-center gap-4 ${searchOpen ? "hidden md:grid" : "grid"}`}>
          <div className="flex items-center gap-3">
            {/* Mobile: Link to /san-pham */}
            <Link
              href="/san-pham"
              className="md:hidden text-white bg-white/10 border border-white/20 rounded-xl p-2 hover:bg-white/20 transition"
            >
              <Menu size={24} />
            </Link>

            {/* Desktop: Sản Phẩm link */}
            <Link
              href="/san-pham"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-white bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white hover:text-[#d70018] hover:border-white transition-all duration-200 shadow-sm group"
            >
              <Menu size={16} className="text-white group-hover:text-[#d70018] transition-colors duration-200" />
              <span>Sản Phẩm</span>
            </Link>
          </div>

          <Link href="/" className="flex items-center justify-center gap-2">
            <span className="font-bold text-lg sm:text-xl text-white tracking-tight whitespace-nowrap">
              XUÂN LỢI <span className="text-red-100 font-semibold opacity-90">STORE</span>
            </span>
          </Link>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm đèn xe, phụ kiện..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      window.location.href = query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham";
                    }
                  }}
                  className="w-full bg-white border border-gray-100 rounded-full pl-4 pr-10 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-400 transition-all duration-200"
                />
                <Link
                  href={query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Search size={18} />
                </Link>
              </div>
            </div>

            <button
              className="md:hidden text-white bg-white/10 border border-white/20 rounded-xl p-2 hover:bg-white/20 transition"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={22} />
            </button>

            <Link
              href="/gio-hang"
              className="relative text-white bg-white/10 border border-white/20 rounded-xl p-2 flex items-center gap-1 hover:bg-white/20 transition whitespace-nowrap"
            >
              <ShoppingCart size={24} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#d70018] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border border-[#d70018]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>


    </header>
  );
}
