export interface User {
  id: number;
  email: string;
  role: 'customer' | 'brand_owner' | 'super_admin';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  brand_id: number;
  category_id: number;
  image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address_id?: number;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface DeliveryAddress {
  id: number;
  user_id: number;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: string[];
}

export interface OTPVerification {
  otp: string;
  email: string;
}
