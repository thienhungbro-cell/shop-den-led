import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên hệ — LampStore",
};

export default function LienHePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Liên hệ với chúng tôi</h1>
      <p className="text-gray-500 mb-10">Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn.</p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact info */}
        <div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-light p-3 rounded-full">
                <MapPin className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Địa chỉ</p>
                <p className="text-gray-500 text-sm mt-1">
                  123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP.HCM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-light p-3 rounded-full">
                <Phone className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Điện thoại</p>
                <a href="tel:0912345678" className="text-primary text-sm mt-1 block hover:underline">
                  0912.345.678
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-light p-3 rounded-full">
                <Mail className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <a href="mailto:info@lampstore.vn" className="text-primary text-sm mt-1 block hover:underline">
                  info@lampstore.vn
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary-light p-3 rounded-full">
                <Clock className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Giờ làm việc</p>
                <p className="text-gray-500 text-sm mt-1">
                  Thứ 2 – Thứ 7: 8:00 – 18:00
                  <br />
                  Chủ nhật: 9:00 – 17:00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <form className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Gửi tin nhắn</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              placeholder="0912 345 678"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea
              rows={4}
              placeholder="Tôi muốn hỏi về..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  );
}
