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
      const endpoint = token === 'key-verified' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/public`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`;

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
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-[var(--gray-200)]">
        <h2 className="text-xl font-medium">Registered Users</h2>
        <p className="text-sm text-[var(--gray-500)] mt-1">
          Total: {users.length} user{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border-b border-red-200 text-red-700">
          {error}
        </div>
      )}

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--gray-700)]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--gray-700)]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--gray-700)]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--gray-700)]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-200)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--gray-50)] transition">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[var(--gray-900)]">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[var(--gray-700)]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: user.role === 'admin'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(107, 114, 128, 0.1)',
                        color: user.role === 'admin'
                          ? '#3b82f6'
                          : '#6b7280',
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--gray-500)] text-sm">
                    {new Date(user.joinedAt).toISOString().split('T')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-[var(--gray-500)]">
            {error ? error : 'No users registered yet'}
          </p>
        </div>
      )}
    </div>
  );
}
