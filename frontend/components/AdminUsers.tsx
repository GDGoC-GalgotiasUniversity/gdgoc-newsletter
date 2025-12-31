'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface AdminUsersProps {
  token: string;
}

export default function AdminUsers({ token }: AdminUsersProps) {
  const auth = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Add User State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = token === 'key-verified'
        ? `${apiUrl}/api/auth/users/public`
        : `${apiUrl}/api/auth/users`;

      const headers: any = { 'Content-Type': 'application/json' };
      if (token !== 'key-verified') headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(endpoint, { headers });
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete user');

      // Remove from state
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to update role');

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

      // If we changed the currently logged-in user's role, persist it in auth context + localStorage
      try {
        const currentUser = auth.user;
        if (currentUser && currentUser.id === userId) {
          const updatedUser = { ...currentUser, role: newRole } as User;
          const currentToken = localStorage.getItem('token') || '';
          auth.login(currentToken, updatedUser);
        }
      } catch (e) {
        // noop
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to create user');

      // Refresh list and close modal
      await fetchUsers();
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      alert('User created successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="card overflow-hidden" style={{ backgroundColor: '#fff', border: '2px solid #000' }}>

      {/* Header with Add Button */}
      <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: '#d4a574', borderWidth: '2px' }}>
        <div>
          <h2 className="text-xl font-medium" style={{ color: '#6b4c9a' }}>Registered Users</h2>
          <p className="text-sm mt-1" style={{ color: '#8b6ba8' }}>
            Total: {users.length} user{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        {token !== 'key-verified' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[var(--brand-purple)] text-white text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all border border-black"
            style={{ backgroundColor: '#6b4c9a' }}
          >
            + Add User
          </button>
        )}
      </div>

      {error && (
        <div className="p-6" style={{ backgroundColor: '#fde2e4', borderBottom: '1px solid #f1919b', color: '#c5192d' }}>
          {error}
        </div>
      )}

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#f5e6d3', borderBottom: '2px solid #d4a574' }}>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Role</th>
                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Joined</th>
                {token !== 'key-verified' && <th className="px-4 py-2 text-right text-sm font-medium" style={{ color: '#6b4c9a' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#fafaf8' : '#fff',
                    borderBottom: '1px solid #e5d5c8'
                  }}
                  className="hover:opacity-80 transition"
                >
                  <td className="px-4 py-2">
                    <span className="font-medium" style={{ color: '#6b4c9a' }}>{user.name}</span>
                  </td>
                  <td className="px-4 py-2" style={{ color: '#8b6ba8' }}>{user.email}</td>
                  <td className="px-4 py-2">
                    {token === 'key-verified' ? (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#d4a574] text-white">
                        {user.role}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs font-semibold rounded-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-[#6b4c9a]"
                        style={{
                          backgroundColor: user.role === 'admin' ? '#d4a574' : '#e8d4c4',
                          color: user.role === 'admin' ? '#fff' : '#6b4c9a',
                        }}
                      >
                        <option value="user" style={{ backgroundColor: '#fff', color: '#000' }}>User</option>
                        <option value="admin" style={{ backgroundColor: '#fff', color: '#000' }}>Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm" style={{ color: '#8b6ba8' }}>
                    {new Date(user.joinedAt).toISOString().split('T')[0]}
                  </td>
                  {token !== 'key-verified' && (
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 font-bold text-xs uppercase"
                        title="Remove User"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center">
          <p style={{ color: '#8b6ba8' }}>
            {error ? error : 'No users registered yet'}
          </p>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(44,44,44,0.6)] backdrop-blur-sm">
          <div className="bg-white border-2 border-black w-full max-w-md p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#6b4c9a' }}>Add New Personnel</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full border-2 border-gray-300 p-2 focus:border-[var(--brand-purple)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full border-2 border-gray-300 p-2 focus:border-[var(--brand-purple)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full border-2 border-gray-300 p-2 focus:border-[var(--brand-purple)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border-2 border-gray-300 p-2 focus:border-[var(--brand-purple)] outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 bg-[var(--brand-purple)] text-white border-2 border-transparent hover:border-black font-bold"
                  style={{ backgroundColor: '#6b4c9a' }}
                >
                  {isAdding ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
