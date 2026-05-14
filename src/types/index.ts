export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}
