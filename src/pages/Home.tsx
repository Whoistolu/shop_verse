import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import apiService from '../services/api.js';
import type { Category, Product } from '../types/index.js';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getProducts()
        ]);
        setCategories(categoriesResponse.data || []);
        setProducts(productsResponse.products || productsResponse.data?.products || productsResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="py-16 text-white bg-gradient-to-r from-orange-400 to-orange-600">
          <div className="container px-4 mx-auto text-center">
            <h1 className="mb-4 text-5xl font-bold">Welcome to Shop Verse</h1>
            <p className="mb-8 text-xl">Discover amazing products from various brands</p>
            <button onClick={() => navigate('/products')} className="px-8 py-3 font-semibold text-orange-600 transition-colors bg-white rounded-full hover:bg-gray-100">
              Start Shopping
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="container px-4 py-12 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Shop by Category</h2>
          {loading ? (
            <div className="py-8 text-center">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
              {categories.map(category => (
                <div key={category.id} className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
                    <span className="text-2xl text-orange-600">📦</span>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Products Section */}
        <div className="container px-4 py-12 mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Featured Products</h2>
          {loading ? (
            <div className="py-8 text-center">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 20).map(product => (
                <div key={product.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
                  <div className="flex items-center justify-center h-48 bg-gray-200">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-4xl text-gray-400">🛍️</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="mb-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
