export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface ProductFilters {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
