import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal.js';

export default function Header() {
  const { user, logout, login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'brand_owner' | 'super_admin'>('customer');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, userType);
      setIsLoginModalOpen(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // I added a TODO: Implement search
    console.log('Search:', search);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 p-4 text-white bg-orange-500">
        <nav className="container flex items-center justify-between mx-auto">
          <div>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Sell on Shop Verse
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="px-3 py-2 text-black rounded"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-black bg-gray-200 rounded hover:bg-gray-300"
            >
              Search
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span>Welcome, {user.email}</span>
                {user.role === 'super_admin' && (
                  <Link to="/admin" className="hover:underline">Admin</Link>
                )}
                <button onClick={handleLogout} className="hover:underline">Logout</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hover:underline"
                >
                  Sign In
                </button>
                <Link to="/cart" className="text-2xl">🛒</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleLogin}>
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
            <label className="block mb-2 text-gray-700">Sign in as:</label>
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
            </div>
          </div>
          <button type="submit" className="w-full py-2 text-white transition-colors bg-orange-500 rounded hover:bg-orange-600">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline" onClick={() => setIsLoginModalOpen(false)}>Sign up</Link>
        </p>
      </Modal>
    </>
  );
}
