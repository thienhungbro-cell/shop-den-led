"use client";

import { Phone, MessageCircle, ClipboardList } from "lucide-react";

const PHONE = "0359663118";
const ZALO = "0359663118";
 

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-18 right-4 sm:bottom-24 sm:right-6 z-50 flex flex-col gap-3 sm:gap-4 items-end">
      {/* Zalo - Real Image Icon */}
      <a
        href={`https://zalo.me/${ZALO}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 animate-[bounce_3s_infinite]"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
          alt="Zalo" 
          className="w-full h-full rounded-[1.2rem] shadow-[0_20px_40px_rgba(0,104,255,0.35)]"
        />
        <span className="absolute -left-16 bg-white text-gray-800 px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none border border-gray-100">
          Zalo Chat
        </span>
      </a>

      {/* Phone - iOS Style */}
      <a
        href={`tel:${PHONE}`}
        className=" mt-4 group relative flex items-center justify-center w-14 h-14 bg-linear-to-br from-[#4ade80] to-[#22c55e] text-white rounded-[1.2rem] shadow-[0_8px_16px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 animate-[bounce_3s_infinite]"
      >
        <Phone size={28} fill="white" />
        <span className="absolute -left-20 bg-white text-gray-800 px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none border border-gray-100">
          Gọi ngay
        </span>
      </a>

      {/* Consultation Request - Orange Accent Pill */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("open-consultation-popup"))}
        className="mt-4 group relative flex items-center justify-center w-14 h-14 bg-linear-to-br from-orange-400 to-[#ea6c0e] text-white rounded-[1.2rem] shadow-[0_8px_16px_rgba(234,108,14,0.3)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 animate-[bounce_3s_infinite] cursor-pointer"
        aria-label="Yêu cầu tư vấn ngay"
      >
        <ClipboardList size={28} />
        <span className="absolute -left-24 bg-white text-gray-800 px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none border border-gray-100 whitespace-nowrap">
          Tư vấn ngay
        </span>
      </button>
    </div>
  );
}
