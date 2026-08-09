export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  installments: number;
  imageUrl: string;
  discount?: number;
  category?: string;
  description?: string;
  outOfStock?: boolean;
}
