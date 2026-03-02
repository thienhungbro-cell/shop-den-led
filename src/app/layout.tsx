import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

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
    <html lang="vi">
      <body className={`${geist.variable} antialiased bg-gray-50`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
