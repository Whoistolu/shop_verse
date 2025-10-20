import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { AuthResponse, User, ApiResponse } from '../types/index.ts';

const API_BASE_URL = 'http://localhost:3001/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );


    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear token
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async brandSignup(email: string, password: string, firstName: string, lastName: string, brandName: string, brandDescription: string): Promise<any> {
    const response = await this.api.post('/auth/brand_signup', {
      user: { email, password, first_name: firstName, last_name: lastName },
      brand: { name: brandName, description: brandDescription }
    });
    return response.data;
  }

  async customerSignup(email: string, password: string, firstName: string, lastName: string): Promise<any> {
    const response = await this.api.post('/auth/customer_signup', {
      user: { email, password, first_name: firstName, last_name: lastName }
    });
    return response.data;
  }

  async brandLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/brand_login', {
      user: { email, password }
    });
    const data = response.data;
    return {
      user: {
        ...data.user,
        role: data.user.role_id === 1 ? 'super_admin' : data.user.role_id === 2 ? 'brand_owner' : 'customer'
      },
      token: data.user.token
    };
  }

  async customerLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/customer_login', {
      user: { email, password }
    });
    const data = response.data;
    return {
      user: {
        ...data.user,
        role: data.user.role_id === 1 ? 'super_admin' : data.user.role_id === 2 ? 'brand_owner' : 'customer'
      },
      token: data.user.token
    };
  }

  async superAdminLogin(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/super_admin_login', {
      user: { email, password }
    });
    const data = response.data;
    return {
      user: {
        ...data.user,
        role: data.user.user_role_id === 1 ? 'super_admin' : data.user.user_role_id === 2 ? 'brand_owner' : 'customer'
      },
      token: data.user.token
    };
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/verify_otp', {
      email, otp
    });
    const data = response.data;
    return {
      user: data.user,
      token: data.token
    };
  }

  // Product methods
  async getProducts(params?: { page?: number; per_page?: number; category_id?: number; brand_id?: number; search?: string }) {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async getProduct(id: number) {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  // Categories
  async getCategories() {
    const response = await this.api.get('/categories');
    return response.data;
  }

  // Brands
  async getBrands() {
    const response = await this.api.get('/brands');
    return response.data;
  }

  // Cart methods (for customers)
  async getCart() {
    const response = await this.api.get('/carts');
    return response.data;
  }

  async addToCart(productId: number, quantity: number) {
    const response = await this.api.post('/carts/add_item', { product_id: productId, quantity });
    return response.data;
  }

  async updateCartItem(itemId: number, quantity: number) {
    const response = await this.api.patch('/carts/update_item', { id: itemId, quantity });
    return response.data;
  }

  async removeFromCart(itemId: number) {
    const response = await this.api.delete(`/carts/remove_item?id=${itemId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.api.delete('/carts/clear');
    return response.data;
  }

  // Order methods
  async getOrders() {
    const response = await this.api.get('/orders');
    return response.data;
  }

  async createOrder(deliveryAddress: string, deliveryPhoneNumber: string, deliveryRecipientName: string) {
    const response = await this.api.post('/orders', {
      order: { delivery_address: deliveryAddress, delivery_phone_number: deliveryPhoneNumber, delivery_recipient_name: deliveryRecipientName }
    });
    return response.data;
  }

  // Brand owner methods
  async getBrandProducts() {
    const response = await this.api.get('/products/brand_products');
    return response.data;
  }

  async createProduct(product: { name: string; description: string; price: number; stock: number; status: string; image_url?: string; category_id: number }) {
    const response = await this.api.post('/products', { product });
    return response.data;
  }

  async updateProduct(id: number, product: Partial<{ name: string; description: string; price: number; stock: number; status: string; image_url?: string; category_id: number }>) {
    const response = await this.api.patch(`/products/${id}`, { product });
    return response.data;
  }

  async deleteProduct(id: number) {
    const response = await this.api.delete(`/products/${id}`);
    return response.data;
  }

  async updateStock(id: number, stock: number) {
    const response = await this.api.patch(`/products/${id}/update_stock`, { product: { stock } });
    return response.data;
  }

  async updateProductStatus(id: number, status: string) {
    const response = await this.api.patch(`/products/${id}/update_status`, { product: { status } });
    return response.data;
  }

  // Super admin methods
  async getUsers() {
    const response = await this.api.get('/super_admin/users');
    return response.data;
  }

  async updateUserStatus(id: number, status: string) {
    const response = await this.api.patch(`/super_admin/users/${id}/update_status`, { status });
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;
