"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react";
import AddressDropdown from "@/components/layout/AddressDropdown";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCartStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState("");

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=2")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Error fetching provinces:", err));
  }, []);

  const handleProvinceChange = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setSelectedDistrict("");
    const prov = provinces.find((p) => p.name === provinceName);
    setDistricts(prov ? prov.districts : []);
  };

  const orderItems = useMemo(
    () =>
      items.map(({ product, quantity }) => ({
        name: product.name,
        quantity,
        price: product.salePrice ?? product.price,
      })),
    [items]
  );

  useEffect(() => {
    if (!success) return;

    if (countdown <= 0) {
      router.push("/");
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [success, countdown, router]);

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-6">Bạn chưa có sản phẩm nào để thanh toán.</p>
        <Link
          href="/san-pham"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();
    
    let address = "";
    if (provinces.length > 0) {
      if (!name || !phone || !selectedProvince || !selectedDistrict || !detailAddress.trim()) {
        setError("Vui lòng nhập đầy đủ họ tên, số điện thoại, chọn địa chỉ và nhập số nhà/đường.");
        return;
      }
      address = `${detailAddress.trim()}, ${selectedDistrict}, ${selectedProvince}`;
    } else {
      address = form.address.trim();
      if (!name || !phone || !address) {
        setError("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.");
        return;
      }
    }

    const phoneRegex = /^0(3|5|7|8|9)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError("Số điện thoại không đúng định dạng. Ví dụ: 0912345678");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name,
            phone,
            address,
            note: form.note,
          },
          items: orderItems,
          total: totalPrice(),
        }),
      });

      if (!res.ok) {
        throw new Error("Gửi đơn hàng thất bại");
      }

      clearCart();
      setSuccess(true);
      setCountdown(5);
    } catch {
      alert("Đã xảy ra lỗi khi gửi đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Đặt hàng thành công</h2>
        <p className="text-gray-500 flex flex-col items-center justify-center gap-2 text-center">
          <span>Đơn hàng đã được đặt thành công.</span>
          <span className="flex items-center justify-center gap-1">
            Chúng tôi sẽ liên hệ bạn sớm nhất qua
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
              alt="Zalo"
              className="w-6 h-6"
            />
          </span>
          <span>Vui lòng kiểm tra tin nhắn.</span>
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow-sm">
          <span>Đang chuyển về trang chủ trong</span>
          <span className="font-semibold">{countdown}s</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/gio-hang" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
        <ArrowLeft size={16} />
        Quay lại giỏ hàng
      </Link>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Thông tin đặt hàng</h1>
          <p className="text-sm text-gray-500">Đơn hàng sẽ được gửi ngay tới bot Telegram của bạn.</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (error) setError("");
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (error) setError("");
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              placeholder="0912 345 678"
            />
          </div>

          {provinces.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <AddressDropdown
                    options={provinces.map((p) => p.name)}
                    value={selectedProvince}
                    onChange={(val) => {
                      handleProvinceChange(val);
                      if (error) setError("");
                    }}
                    placeholder="-- Chọn Tỉnh / Thành phố --"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận / Huyện <span className="text-red-500">*</span>
                  </label>
                  <AddressDropdown
                    disabled={!selectedProvince}
                    options={districts.map((d) => d.name)}
                    value={selectedDistrict}
                    onChange={(val) => {
                      setSelectedDistrict(val);
                      if (error) setError("");
                    }}
                    placeholder="-- Chọn Quận / Huyện --"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số nhà, tên đường, phường/xã <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={detailAddress}
                  onChange={(e) => {
                    setDetailAddress(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="Ví dụ: 123 Đường số 4, Phường Tân Quy"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ nhận hàng <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={form.address}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  if (error) setError("");
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="123 Nguyễn Văn Linh, Quận 7, TP.HCM"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              rows={4}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Giao hàng trước 10h, gọi trước khi giao..."
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {submitting ? "Đang gửi..." : "Gửi đơn hàng"}
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
          <div className="space-y-3 mb-6">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{product.name} × {quantity}</span>
                <span className="font-medium">{formatPrice((product.salePrice ?? product.price) * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold text-gray-900">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatPrice(totalPrice())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
