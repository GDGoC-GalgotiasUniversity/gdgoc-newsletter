'use client';

interface AdminStatsProps {
  totalNewsletters: number;
  publishedNewsletters: number;
  draftNewsletters: number;
}

export default function AdminStats({
  totalNewsletters,
  publishedNewsletters,
  draftNewsletters,
}: AdminStatsProps) {
  const stats = [
    {
      label: 'Total Newsletters',
      value: totalNewsletters,
      color: '#6b4c9a',
      bgColor: '#f0e6f5',
      icon: '📰',
    },
    {
      label: 'Published',
      value: publishedNewsletters,
      color: '#d4a574',
      bgColor: '#fef3e6',
      icon: '✅',
    },
    {
      label: 'Drafts',
      value: draftNewsletters,
      color: '#8b6ba8',
      bgColor: '#f5e6f0',
      icon: '📝',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="p-6 rounded-lg"
          style={{ backgroundColor: stat.bgColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: stat.color }}>
              {stat.label}
            </p>
            <span className="text-3xl">{stat.icon}</span>
          </div>
          <p className="text-4xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
