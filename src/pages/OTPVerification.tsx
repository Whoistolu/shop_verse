import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import Header from '../components/Header.js';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('pendingEmail') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otp);
      localStorage.removeItem('pendingEmail');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
          <p className="text-gray-600 mb-4 text-center">Enter the OTP sent to {email}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
                maxLength={6}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
