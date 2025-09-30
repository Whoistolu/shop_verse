import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal.js';

export default function Header() {
  const { user, logout, login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBrand, setIsBrand] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, isBrand);
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
      <header className="fixed top-0 left-0 right-0 bg-orange-500 text-white p-4 z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
              className="px-3 py-2 rounded text-black"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
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
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
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
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isBrand}
                onChange={(e) => setIsBrand(e.target.checked)}
                className="mr-2"
              />
              Sign in as Brand Owner
            </label>
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
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
