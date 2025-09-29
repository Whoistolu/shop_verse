import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import apiService from '../services/api.js';
import type { Category } from '../types/index.js';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Shop Verse</h1>
            <p className="text-xl mb-8">Discover amazing products from various brands</p>
            <button onClick={() => navigate('/products')} className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Start Shopping
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Shop by Category</h2>
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map(category => (
                <div key={category.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                  <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-orange-600">📦</span>
                  </div>
                  <h3 className="text-lg font-semibold text-center text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
