import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import categories from "@/data/categories.json";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl font-extrabold text-primary">
                XUÂN LỢI
              </span>
              <span className="text-lg font-bold text-white">STORE</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-4">
              Chuyên cung cấp đèn xe cao cấp, phụ kiện ánh sáng chính hãng. Uy tín — Chất lượng — Giá tốt.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors text-sm">
                f
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                📷
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/san-pham" className="hover:text-primary transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chinh-sach-bao-hanh" className="hover:text-primary transition-colors">
                  Bảo hành
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-doi-tra" className="hover:text-primary transition-colors">
                  Đổi trả
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-van-chuyen" className="hover:text-primary transition-colors">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/huong-dan-mua-hang" className="hover:text-primary transition-colors">
                  Hướng dẫn mua
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gioi-thieu" className="hover:text-primary transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog & Tư vấn
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-primary transition-colors">
                  Đánh giá khách hàng
                </Link>
              </li>
              <li>
                <Link href="/tuyen-dung" className="hover:text-primary transition-colors">
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span>123 Hoàng Diệu 2, Quận 9,<br />TP.HCM, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:0359663118" className="hover:text-primary transition-colors">
                  0359.663.118
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:info@xuanloi-store.vn" className="hover:text-primary transition-colors text-xs">
                  info@xuanloi-store.vn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p>T2-T6: 8:00 - 18:00</p>
                  <p>T7: 9:00 - 17:00</p>
                  <p>CN: 10:00 - 17:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Xuân Lợi Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Chính sách riêng tư</span>
            <span>|</span>
            <span>Điều khoản dịch vụ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
