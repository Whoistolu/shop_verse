import { useEffect, useState } from 'react';
import Header from '../components/Header.js';
import apiService from '../services/api.js';
import type { Category } from '../types/index.js';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response.data || []);
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
      <div className="pt-20 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Welcome to Shop Verse
        </h1>
        <p className="text-lg text-center text-gray-600 mb-8">
          Discover amazing products from various brands.
        </p>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Shop by Category</h2>
        {loading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <div key={category.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-center">{category.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
