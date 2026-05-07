"use client";

import { Phone, MessageCircle } from "lucide-react";

const PHONE = "0359663118";
const ZALO = "0359663118";
const FB_PAGE = "https://m.me/lampwebsite";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 sm:gap-4 items-end">
      {/* Zalo - Real Image Icon */}
      <a
        href={`https://zalo.me/${ZALO}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
          alt="Zalo" 
          className="w-full h-full rounded-[1.2rem] shadow-[0_8px_16px_rgba(0,104,255,0.3)]"
        />
        <span className="absolute -left-16 bg-white text-gray-800 px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none border border-gray-100">
          Zalo Chat
        </span>
      </a>

      {/* Facebook Messenger - iOS Style */}
      <a
        href={FB_PAGE}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-linear-to-br from-[#00c6ff] to-[#0072ff] text-white rounded-[1.2rem] shadow-[0_8px_16px_rgba(0,114,255,0.3)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95"
      >
        <MessageCircle size={28} fill="white" />
        <span className="absolute -left-20 bg-white text-gray-800 px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none border border-gray-100">
          Messenger
        </span>
      </a>

      {/* Phone - iOS Style */}
      <a
        href={`tel:${PHONE}`}
        className="group relative flex items-center justify-center w-14 h-14 bg-linear-to-br from-[#4ade80] to-[#22c55e] text-white rounded-[1.2rem] shadow-[0_8px_16px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 active:scale-95 animate-[bounce_3s_infinite]"
      >
        <Phone size={28} fill="white" />
        <span className="absolute -left-20 bg-white text-gray-800 px-2 py-1 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none border border-gray-100">
          Gọi ngay
        </span>
      </a>
    </div>
  );
}
