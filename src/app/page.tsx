import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FlashSale from "@/components/home/FlashSale";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FlashSale />
      <FeaturedProducts />
    </>
  );
}
