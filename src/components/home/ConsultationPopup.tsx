"use client";

import { useEffect, useState } from "react";
import { X, Send, Sparkles, CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { useToastStore } from "@/lib/toastStore";

const INTERESTS = [
  "Bi cầu LED/Laser",
  "Đèn LED pha/gầm",
  "Mạch điện thông minh",
  "Phụ kiện nâng cấp",
];

export default function ConsultationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Bi cầu LED/Laser");
  const [note, setNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { addToast } = useToastStore();

  useEffect(() => {
    const handleOpenPopup = () => {
      setName("");
      setPhone("");
      setInterest("Bi cầu LED/Laser");
      setNote("");
      setIsSubmitted(false);
      setIsOpen(true);
    };

    window.addEventListener("open-consultation-popup", handleOpenPopup);
    return () => {
      window.removeEventListener("open-consultation-popup", handleOpenPopup);
    };
  }, []);

  // Dispatch active event to coordinate with other widgets (e.g. Chatbot)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("consultation-popup-active", { detail: isOpen }));
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      addToast("Vui lòng điền số điện thoại", "error");
      return;
    }

    // Basic phone validation (starts with 0, length 9-11 digits)
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      addToast("Số điện thoại không đúng định dạng", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, interest, note }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        addToast("Gửi thông tin tư vấn thành công!", "success");
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        addToast(data.message || "Gửi thông tin thất bại", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fade-in_0.2s_ease-out_forwards]"
      onClick={(e) => {
        // Close modal when clicking on the backdrop
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-2xl animate-[slide-in_0.3s_ease-out_forwards]">
        
        {/* Header decoration */}
        <div className="h-1 bg-gradient-to-r from-primary to-accent w-full" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
          aria-label="Đóng popup"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-5 sm:p-6 text-left">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header Info */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Sparkles size={14} className="text-accent animate-pulse" />
                  Nhận tư vấn miễn phí
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                  Nâng Cấp Ánh Sáng Chuyên Nghiệp
                </h3>
                <p className="text-xs text-gray-500">
                  Để lại thông tin, Xuân Lợi Store sẽ liên hệ tư vấn dòng đèn phù hợp nhất với xế yêu của bạn.
                </p>
              </div>

              {/* Grid Fields */}
              <div className="space-y-3">
                {/* Họ tên */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>

                {/* SĐT */}
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

                {/* Dịch vụ quan tâm (Badges Grid) */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                    Sản phẩm bạn quan tâm
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {INTERESTS.map((item) => {
                      const isSelected = interest === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setInterest(item)}
                          className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all truncate cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 border-primary text-primary font-medium"
                              : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                    Ghi chú thêm
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Xe Wave Alpha 2024, muốn lên bi cầu..."
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang gửi thông tin...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Gửi yêu cầu ngay
                  </>
                )}
              </button>
            </form>
          ) : (
            // Success Screen
            <div className="flex flex-col items-center text-center py-6 space-y-4 animate-[slide-in_0.3s_ease-out_forwards]">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
                <CheckCircle2 size={40} className="animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-gray-900">
                  Đã nhận thông tin thành công!
                </h3>
                <p className="text-sm text-gray-500 px-2 leading-relaxed">
                  Xuân Lợi Store đã ghi nhận yêu cầu tư vấn dòng sản phẩm <b>{interest}</b> của quý khách. Nhân viên sẽ liên hệ lại sớm nhất qua số <b>{phone}</b>.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-full mt-2">
                <PhoneCall size={14} />
                Hotline hỗ trợ: 0359.663.118
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
