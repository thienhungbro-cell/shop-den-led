"use client";

import { useEffect, useState } from "react";
import { X, ShoppingBag, Plus, Minus, Send, CheckCircle2, Loader2 } from "lucide-react";
import AddressDropdown from "@/components/layout/AddressDropdown";
import Image from "next/image";
import { useToastStore } from "@/lib/toastStore";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function QuickOrderPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const { addToast } = useToastStore();

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

  useEffect(() => {
    const handleOpenPopup = (e: Event) => {
      const customEvent = e as CustomEvent<{ product: Product }>;
      if (customEvent.detail?.product) {
        setProduct(customEvent.detail.product);
        setQuantity(1);
        setName("");
        setPhone("");
        setAddress("");
        setSelectedProvince("");
        setSelectedDistrict("");
        setDetailAddress("");
        setNote("");
        setIsSubmitted(false);
        setIsOpen(true);
      }
    };

    window.addEventListener("open-quick-order-popup", handleOpenPopup);
    return () => {
      window.removeEventListener("open-quick-order-popup", handleOpenPopup);
    };
  }, []);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      addToast("Vui lòng điền họ và tên", "error");
      return;
    }

    if (!trimmedPhone) {
      addToast("Vui lòng điền số điện thoại", "error");
      return;
    }

    // Basic phone validation (starts with 0, length 9-11 digits)
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (!phoneRegex.test(trimmedPhone.replace(/\s+/g, ""))) {
      addToast("Số điện thoại không đúng định dạng", "error");
      return;
    }

    let finalAddress = "";
    if (provinces.length > 0) {
      if (!selectedProvince || !selectedDistrict || !detailAddress.trim()) {
        addToast("Vui lòng chọn địa chỉ và điền số nhà/đường", "error");
        return;
      }
      finalAddress = `${detailAddress.trim()}, ${selectedDistrict}, ${selectedProvince}`;
    } else {
      finalAddress = address.trim();
      if (!finalAddress) {
        addToast("Vui lòng nhập địa chỉ giao hàng", "error");
        return;
      }
    }

    setIsSubmitting(true);

    const price = product.salePrice ?? product.price;
    const total = price * quantity;

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: trimmedName, phone: trimmedPhone, address: finalAddress, note },
          items: [
            {
              name: product.name,
              quantity,
              price,
            },
          ],
          total,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        addToast("Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm nhất.", "success");
      } else {
        addToast(data.message || "Đặt hàng thất bại. Vui lòng thử lại.", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  const currentPrice = product.salePrice ?? product.price;
  const totalAmount = currentPrice * quantity;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fade-in_0.2s_ease-out_forwards]"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-2xl animate-[slide-in_0.3s_ease-out_forwards]">
        
        {/* Header decoration */}
        <div className="h-1.5 bg-gradient-to-r from-primary to-accent w-full" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Đóng popup"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-5 sm:p-6 text-left max-h-[85vh] overflow-y-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header Info */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                  <ShoppingBag size={14} className="text-accent animate-pulse" />
                  Đặt hàng nhanh siêu tốc
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  Mua Ngay Đơn Giản & Tiện Lợi
                </h3>
                <p className="text-xs text-gray-500">
                  Chỉ cần để lại thông tin, Xuân Lợi Store sẽ liên hệ xác nhận và giao hàng nhanh toàn quốc.
                </p>
              </div>

              {/* Product Info Segment */}
              <div className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary font-extrabold text-sm sm:text-base">
                      {formatPrice(currentPrice)}
                    </span>
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        className="p-1 px-2 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800 select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        className="p-1 px-2 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                {/* Họ tên */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                    Họ và tên <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                    Số điện thoại <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0359xxxxxx"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Địa chỉ */}
                {provinces.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                          Tỉnh / Thành phố <span className="text-primary">*</span>
                        </label>
                        <AddressDropdown
                          options={provinces.map((p) => p.name)}
                          value={selectedProvince}
                          onChange={(val) => handleProvinceChange(val)}
                          placeholder="-- Chọn Tỉnh / Thành --"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                          Quận / Huyện <span className="text-primary">*</span>
                        </label>
                        <AddressDropdown
                          disabled={!selectedProvince}
                          options={districts.map((d) => d.name)}
                          value={selectedDistrict}
                          onChange={(val) => setSelectedDistrict(val)}
                          placeholder="-- Chọn Quận / Huyện --"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                        Số nhà, tên đường, phường/xã <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="Ví dụ: 123 Đường số 4, Phường Tân Quy"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                      Địa chỉ nhận hàng <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, ngõ/đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Ghi chú */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                    Ghi chú đơn hàng (nếu có)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Giao ngoài giờ hành chính, gọi trước khi giao..."
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Order total */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-2">
                <span className="text-sm font-semibold text-gray-700">Tổng tiền thanh toán:</span>
                <span className="text-lg font-black text-primary">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang gửi thông tin đặt hàng...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Đặt Hàng Ngay
                  </>
                )}
              </button>
            </form>
          ) : (
            // Success Screen
            <div className="flex flex-col items-center text-center py-8 space-y-4 animate-[slide-in_0.3s_ease-out_forwards]">
              <div className="p-4 bg-green-500/10 text-green-500 rounded-full">
                <CheckCircle2 size={48} className="animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Đặt Hàng Thành Công!
                </h3>
                <p className="text-sm text-gray-500 px-4 leading-relaxed">
                  Cảm ơn <b>{name}</b>. Đơn hàng sản phẩm <b>{product.name}</b> (số lượng: {quantity}) với tổng số tiền <b>{formatPrice(totalAmount)}</b> đã được hệ thống ghi nhận.
                </p>
                <p className="text-xs text-gray-400 px-6 mt-1">
                  Đội ngũ chăm sóc khách hàng của Xuân Lợi Store sẽ liên hệ lại qua số điện thoại <b>{phone}</b> trong vòng 5-15 phút để xác nhận địa chỉ và hoàn tất thủ tục gửi hàng.
                </p>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Tiếp tục xem cửa hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
