"use client";

import { useToastStore } from "@/lib/toastStore";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-in max-w-sm rounded-[1.5rem] border px-5 py-4 shadow-[0_30px_60px_rgba(15,23,42,0.18)] transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:shadow-[0_35px_80px_rgba(15,23,42,0.24)] backdrop-blur-sm ${
            toast.type === "success"
              ? "bg-emerald-600/95 text-white border-emerald-500"
              : "bg-rose-600/95 text-white border-rose-500"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white text-base shadow-sm">
              {toast.type === "success" ? "✓" : "!"}
            </div>
            <p className="text-sm leading-relaxed text-white/95">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
