import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import categories from "@/data/categories.json";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl font-extrabold text-primary">XUÂN LỢI</span>
              <span className="text-lg font-bold text-white">STORE</span>
            </Link>
            <p className="text-sm text-gray-400 mt-2">
              Đèn xe cao cấp & phụ kiện ánh sáng. Uy tín, chất lượng, giá tốt.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="tel:0359663118" className="hover:text-primary">0359.663.118</a>
              </li>
              <li>
                <a href="mailto:info@xuanloi-store.vn" className="hover:text-primary">info@xuanloi-store.vn</a>
              </li>
              <li className="text-gray-400 text-sm">Hoàng Diệu 2, Quận 9, TP.HCM</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Xuân Lợi Store. All rights reserved.
      </div>
    </footer>
  );
}
