import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';

import Header from '../components/Header.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'brand_owner' | 'super_admin'>('customer');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, userType);
      if (userType === 'super_admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Login as:</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="customer"
                    checked={userType === 'customer'}
                    onChange={(e) => setUserType(e.target.value as 'customer' | 'brand_owner' | 'super_admin')}
                    className="mr-2"
                  />
                  Customer
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="brand_owner"
                    checked={userType === 'brand_owner'}
                    onChange={(e) => setUserType(e.target.value as 'customer' | 'brand_owner' | 'super_admin')}
                    className="mr-2"
                  />
                  Brand Owner
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="super_admin"
                    checked={userType === 'super_admin'}
                    onChange={(e) => setUserType(e.target.value as 'customer' | 'brand_owner' | 'super_admin')}
                    className="mr-2"
                  />
                  Super Admin
                </label>
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
