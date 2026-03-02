"use client";

import { Phone, MessageCircle } from "lucide-react";

const PHONE = "0912345678";
const ZALO = "0912345678";
const FB_PAGE = "https://m.me/lampwebsite";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3 items-end">
      {/* Zalo */}
      <a
        href={`https://zalo.me/${ZALO}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg transition-all hover:scale-105 text-sm font-medium"
      >
        <span className="text-xs font-bold">Zalo</span>
      </a>

      {/* Facebook Messenger */}
      <a
        href={FB_PAGE}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#0084ff] hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
        title="Chat Facebook"
      >
        <MessageCircle size={20} />
      </a>

      {/* Phone */}
      <a
        href={`tel:${PHONE}`}
        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg transition-all hover:scale-105 animate-bounce"
        title={`Gọi ${PHONE}`}
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
