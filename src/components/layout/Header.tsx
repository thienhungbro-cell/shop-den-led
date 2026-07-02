"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, X, Zap } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import categories from "@/data/categories.json";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-40 bg-[#15171C] shadow-md">
      {/* Top bar */}
      <div className="bg-primary text-white text-[10px] sm:text-xs py-1.5 overflow-hidden leading-tight">
        <div className="animate-marquee whitespace-nowrap inline-block">
          🔥 Xuân Lợi Store kính chào quý khách &nbsp;—&nbsp; Giao hàng toàn quốc &nbsp;—&nbsp; Hotline:{" "}
          <a href="tel:0359663118" className="font-bold underline">
            0359663118
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          🔥 Xuân Lợi Store kính chào quý khách &nbsp;—&nbsp; Giao hàng toàn quốc &nbsp;—&nbsp; Hotline:{" "}
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
              className="text-white bg-slate-200/15 border border-slate-300/30 rounded-xl p-2 hover:bg-slate-200/25 transition"
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
                className="w-full bg-[#20232A] border border-[#2D313C] rounded-full pl-4 pr-10 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <Link
                href={query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
              >
                <Search size={18} />
              </Link>
            </div>
            <Link
              href="/gio-hang"
              className="relative text-white bg-slate-200/15 border border-slate-300/30 rounded-xl p-2 flex items-center gap-1 hover:bg-slate-200/25 transition whitespace-nowrap"
            >
              <ShoppingCart size={24} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        <div className={`flex-1 grid grid-cols-3 items-center gap-4 ${searchOpen ? "hidden md:grid" : "grid"}`}>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-white bg-slate-200/15 border border-slate-300/30 rounded-xl p-2 hover:bg-slate-200/25 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <Link href="/" className="flex items-center justify-center gap-2">
            <span className="font-bold text-lg sm:text-xl text-primary tracking-tight whitespace-nowrap">
              XUÂN LỢI <span className="text-white">STORE</span>
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
                  className="w-full bg-[#20232A] border border-[#2D313C] rounded-full pl-4 pr-10 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                />
                <Link
                  href={query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
                >
                  <Search size={18} />
                </Link>
              </div>
            </div>

            <button
              className="md:hidden text-white bg-slate-200/15 border border-slate-300/30 rounded-xl p-2 hover:bg-slate-200/25 transition"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={22} />
            </button>

            <Link
              href="/gio-hang"
              className="relative text-white bg-slate-200/15 border border-slate-300/30 rounded-xl p-2 flex items-center gap-1 hover:bg-slate-200/25 transition whitespace-nowrap"
            >
              <ShoppingCart size={24} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Categories are available inside the mobile/hamberger menu only per request */}

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-light hover:text-primary text-sm"
                >
                  <div className="relative w-5 h-5">
                    <Image src={cat.icon} alt="" fill className="object-contain" unoptimized />
                  </div>
                  {cat.name}
                </Link>
              </li>
            ))}
            <li className="border-t pt-2 mt-2">
              <Link
                href="/lien-he"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-600"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
