"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X, Zap } from "lucide-react";
import { useCartStore } from "@/lib/store";
import categories from "@/data/categories.json";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-1 text-center">
        🔥 Flash sale mỗi ngày — Giao hàng toàn quốc — Hotline:{" "}
        <a href="tel:0912345678" className="font-bold underline">
          0912.345.678
        </a>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Zap size={28} className="text-primary fill-primary" />
          <span className="font-bold text-xl text-primary tracking-tight">
            XUÂN LỢI <span className="text-gray-800">STORE</span>
          </span>
        </Link>

        {/* Search bar — desktop */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm đèn xe, phụ kiện..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <Link
              href={query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham"}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              <Search size={18} />
            </Link>
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Search icon mobile */}
          <button
            className="md:hidden text-gray-600 hover:text-primary"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={22} />
          </button>

          {/* Cart */}
          <Link
            href="/gio-hang"
            className="relative text-gray-700 hover:text-primary flex items-center gap-1"
          >
            <ShoppingCart size={24} />
            {totalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems()}
              </span>
            )}
          </Link>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-gray-600 hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white">
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
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      )}

      {/* Category nav — desktop */}
      <nav className="hidden md:block bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/danh-muc/${cat.slug}`}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-light transition-colors"
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                href="/san-pham"
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary"
              >
                Tất cả sản phẩm →
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/danh-muc/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-light hover:text-primary text-sm"
                >
                  <span>{cat.icon}</span>
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
