import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import categories from "@/data/categories.json";

export default function Footer() {
  return (
    <footer className="bg-[#15171C] text-gray-400 mt-16 border-t border-white/5">
      {/* Trust badges */}
      <div className="border-b border-white/5 bg-[#1a1d23]/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Giao hàng toàn quốc</h4>
              <p className="text-xs text-gray-500 mt-0.5">Vận chuyển nhanh chóng, an toàn</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Bảo hành chính hãng</h4>
              <p className="text-xs text-gray-500 mt-0.5">Cam kết sản phẩm chất lượng cao</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Đổi trả dễ dàng</h4>
              <p className="text-xs text-gray-500 mt-0.5">Hỗ trợ đổi trả nhanh trong 7 ngày</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-extrabold text-primary tracking-tight">
                XUÂN LỢI <span className="text-white">STORE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Chuyên cung cấp đèn LED xe máy, bi cầu LED, bi gầm, mạch điện thông minh, và phụ kiện nâng cấp ánh sáng xe chuyên nghiệp hàng đầu tại Việt Nam.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Danh mục</h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.slug}`}
                    className="hover:text-primary transition-all duration-150 inline-block hover:translate-x-1"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies / Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Dịch vụ</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/san-pham" className="hover:text-primary transition-all duration-150 inline-block hover:translate-x-1">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-primary transition-all duration-150 inline-block hover:translate-x-1">
                  Liên hệ & hỗ trợ
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">Chính sách bảo hành</span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">Chính sách đổi trả</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">Hoàng Diệu 2, Linh Chiểu, Thủ Đức, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:0359663118" className="hover:text-white transition-colors">
                  0359.663.118
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-primary shrink-0" />
                <a href="mailto:info@xuanloi-store.vn" className="hover:text-white transition-colors">
                  info@xuanloi-store.vn
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-gray-500">
                <Clock size={18} className="text-gray-600 shrink-0" />
                <span>Mở cửa: 8:00 – 18:00 hàng ngày</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-6 bg-[#111317]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Xuân Lợi Store. Bản quyền thuộc về Xuân Lợi Store.
          </div>
          <div className="flex gap-4">
            <span>Thiết kế & phát triển với ❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
