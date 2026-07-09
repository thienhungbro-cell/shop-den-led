import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import ChatbotWidget from "@/components/layout/ChatbotWidget";
import ConsultationPopup from "@/components/home/ConsultationPopup";
import ToastContainer from "@/components/layout/ToastContainer";
import CartReminderPopup from "@/components/layout/CartReminderPopup";
import QuickOrderPopup from "@/components/product/QuickOrderPopup";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "XuanLoiStore — Đèn xe cao cấp, phụ kiện ánh sáng",
  description:
    "Chuyên cung cấp đèn LED, đèn Laser, đèn pha, đèn gầm chính hãng Osram, Philips, Aozoom. Giao hàng toàn quốc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased bg-gray-50`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
        <ChatbotWidget />
        <ConsultationPopup />
        <CartReminderPopup />
        <QuickOrderPopup />
        <ToastContainer />
      </body>
    </html>
  );
}
