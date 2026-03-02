export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
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
