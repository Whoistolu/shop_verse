import { useEffect, useState } from 'react';
import Header from '../components/Header.js';
import apiService from '../services/api.js';
import type { Product } from '../types/index.js';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts();
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-20 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">🛍️</span>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">${product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock_quantity}</span>
                  </div>
                  <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
