export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  brandSlug: string;
  vehicleSlug?: string;
  brand: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  badge?: string | null;
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
  featured: boolean;
  isFlashSale: boolean;
}

export interface VehicleModel {
  slug: string;
  name: string;
}

export interface Brand {
  slug: string;
  name: string;
  vehicles: VehicleModel[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  brands: Brand[];
}

export interface Banner {
  id: number;
  image: string;
  alt: string;
  link: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
