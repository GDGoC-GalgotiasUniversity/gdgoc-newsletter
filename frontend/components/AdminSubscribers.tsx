'use client';

import { useState, useEffect } from 'react';

interface Subscriber {
    _id: string;
    email: string;
    subscribedAt: string;
    isActive: boolean;
}

export default function AdminSubscribers() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/subscribers`, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch subscribers');

            const data = await response.json();
            setSubscribers(data.data || []);
        } catch (err: any) {
            console.error('Error fetching subscribers:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading subscribers...</div>;

    return (
        <div className="card overflow-hidden" style={{ backgroundColor: '#fff', border: '2px solid #000' }}>

            {/* Header */}
            <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: '#d4a574', borderWidth: '2px' }}>
                <div>
                    <h2 className="text-xl font-medium" style={{ color: '#6b4c9a' }}>Newsletter Subscribers</h2>
                    <p className="text-sm mt-1" style={{ color: '#8b6ba8' }}>
                        Total: {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-6" style={{ backgroundColor: '#fde2e4', borderBottom: '1px solid #f1919b', color: '#c5192d' }}>
                    {error}
                </div>
            )}

            {subscribers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: '#f5e6d3', borderBottom: '2px solid #d4a574' }}>
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>#</th>
                                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Email</th>
                                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Subscribed Date</th>
                                <th className="px-4 py-2 text-left text-sm font-medium" style={{ color: '#6b4c9a' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((subscriber, index) => (
                                <tr
                                    key={subscriber._id}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? '#fafaf8' : '#fff',
                                        borderBottom: '1px solid #e5d5c8'
                                    }}
                                    className="hover:opacity-80 transition"
                                >
                                    <td className="px-4 py-2" style={{ color: '#8b6ba8' }}>
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="font-medium" style={{ color: '#6b4c9a' }}>{subscriber.email}</span>
                                    </td>
                                    <td className="px-4 py-2 text-sm" style={{ color: '#8b6ba8' }}>
                                        {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {subscriber.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-6 text-center">
                    <p style={{ color: '#8b6ba8' }}>
                        {error ? error : 'No subscribers yet'}
                    </p>
                </div>
            )}
        </div>
    );
}
