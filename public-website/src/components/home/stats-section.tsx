'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Trophy, Building2, MapPin } from 'lucide-react';

const fetchStats = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

export function StatsSection() {
  const { data } = useQuery({
    queryKey: ['public-stats'],
    queryFn: fetchStats,
  });

  const stats = data?.data || {
    totalPlayers: 0,
    totalTournaments: 0,
    totalAcademies: 0,
    totalTaluks: 6,
  };

  const items = [
    { label: 'Registered Players', value: stats.totalPlayers, icon: Users },
    { label: 'Tournaments Hosted', value: stats.totalTournaments, icon: Trophy },
    { label: 'Chess Academies', value: stats.totalAcademies, icon: Building2 },
    { label: 'Taluk Associations', value: stats.totalTaluks, icon: MapPin },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4">
                <item.icon className="w-7 h-7 text-primary-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                {item.value.toLocaleString()}+
              </div>
              <div className="text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
