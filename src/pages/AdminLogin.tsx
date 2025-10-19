import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import Header from '../components/Header.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, 'super_admin');
      window.location.href = '/admin';
    } catch (error) {
      console.error('Admin login failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-center justify-center px-4 py-12 pt-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-center">Super Admin Login</h2>
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
            <button type="submit" className="w-full py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600">
              Login as Super Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
