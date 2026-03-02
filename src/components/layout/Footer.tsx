import Link from "next/link";
import { Zap, Phone, Mail, MapPin } from "lucide-react";
import categories from "@/data/categories.json";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Zap size={24} className="text-primary fill-primary" />
            <span className="font-bold text-xl text-white">
              XUÂN LỢI <span className="text-primary">STORE</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            Chuyên cung cấp đèn xe cao cấp, phụ kiện ánh sáng chính hãng. Uy
            tín — Chất lượng — Giá tốt.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/danh-muc/${cat.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-white font-semibold mb-4">Chính sách</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/chinh-sach-bao-hanh" className="hover:text-primary">
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-doi-tra" className="hover:text-primary">
                Đổi trả hàng
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-van-chuyen" className="hover:text-primary">
                Vận chuyển
              </Link>
            </li>
            <li>
              <Link href="/huong-dan-mua-hang" className="hover:text-primary">
                Hướng dẫn mua hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <span> Hoàng Diệu 2, Quận 9, TP.HCM</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-primary shrink-0" />
              <a href="tel:0912345678" className="hover:text-primary">
                0912.345.678
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-primary shrink-0" />
              <a href="mailto:info@xuanloi-store.vn" className="hover:text-primary">
                info@xuanloi-store.vn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LampStore. All rights reserved.
      </div>
    </footer>
  );
}
