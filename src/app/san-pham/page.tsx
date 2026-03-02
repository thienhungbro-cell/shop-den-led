import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Tất cả sản phẩm — LampStore",
};

export default function SanPhamPage() {
  return (
    <Suspense>
      <ProductsClient />
    </Suspense>
  );
}
