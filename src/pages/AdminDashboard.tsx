import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import Header from '../components/Header.js';
import apiService from '../services/api.js';
import type { User } from '../types/index.js';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await apiService.getUsers();
      // Filter for pending brand owners
      const pending = response.data.filter((u: User) =>
        u.role === 'brand_owner' && u.status === 'pending'
      );
      setPendingUsers(pending);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: number, status: 'approved' | 'rejected') => {
    setActionLoading(userId.toString());
    try {
      await apiService.updateUserStatus(userId, status);
      // Remove the user from the pending list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="pt-20 flex justify-center items-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Pending Brand Owner Approvals
              </h2>

              {pendingUsers.length === 0 ? (
                <p className="text-gray-500">No pending approvals</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((pendingUser) => (
                    <div key={pendingUser.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {pendingUser.email}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Role: {pendingUser.role}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {pendingUser.status}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(pendingUser.id, 'approved')}
                            disabled={actionLoading === pendingUser.id.toString()}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                          >
                            {actionLoading === pendingUser.id.toString() ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(pendingUser.id, 'rejected')}
                            disabled={actionLoading === pendingUser.id.toString()}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                          >
                            {actionLoading === pendingUser.id.toString() ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
