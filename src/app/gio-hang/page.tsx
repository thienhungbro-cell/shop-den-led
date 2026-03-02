import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Giỏ hàng — LampStore",
};

export default function GioHangPage() {
  return <CartClient />;
}
