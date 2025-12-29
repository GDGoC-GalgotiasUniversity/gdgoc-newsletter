'use client';

import { useState, useEffect } from 'react';

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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Use public endpoint for key-verified access
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const endpoint = token === 'key-verified'
        ? `${apiUrl}/api/auth/users/public`
        : `${apiUrl}/api/auth/users`;

      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Add auth header only if we have a real token
      if (token !== 'key-verified') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="card overflow-hidden" style={{ backgroundColor: '#fff', border: '2px solid #000' }}>
      <div className="p-6 border-b" style={{ borderColor: '#d4a574', borderWidth: '2px' }}>
        <h2 className="text-xl font-medium" style={{ color: '#6b4c9a' }}>Registered Users</h2>
        <p className="text-sm mt-1" style={{ color: '#8b6ba8' }}>
          Total: {users.length} user{users.length !== 1 ? 's' : ''}
        </p>
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
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Joined</th>
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
                  <td className="px-6 py-4">
                    <span className="font-medium" style={{ color: '#6b4c9a' }}>{user.name}</span>
                  </td>
                  <td className="px-6 py-4" style={{ color: '#8b6ba8' }}>{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: user.role === 'admin'
                          ? '#d4a574'
                          : '#e8d4c4',
                        color: user.role === 'admin'
                          ? '#fff'
                          : '#6b4c9a'
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#8b6ba8' }}>
                    {new Date(user.joinedAt).toISOString().split('T')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <p style={{ color: '#8b6ba8' }}>
            {error ? error : 'No users registered yet'}
          </p>
        </div>
      )}
    </div>
  );
}
