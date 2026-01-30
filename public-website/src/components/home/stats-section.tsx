'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
    { label: 'Registered Players', value: stats.totalPlayers, icon: Users, iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { label: 'Tournaments Hosted', value: stats.totalTournaments, icon: Trophy, iconBg: 'bg-gradient-to-br from-yellow-500 to-orange-500', shadow: 'shadow-orange-500/30' },
    { label: 'Chess Academies', value: stats.totalAcademies, icon: Building2, iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { label: 'Taluk Associations', value: stats.totalTaluks, icon: MapPin, iconBg: 'bg-gradient-to-br from-pink-500 to-purple-600', shadow: 'shadow-pink-500/30' },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Rainbow top bar */}
      <div className="absolute top-0 left-0 w-full h-1 rainbow-bar" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${item.iconBg} rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg ${item.shadow}`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
                {item.value.toLocaleString()}+
              </div>
              <div className="text-gray-500 font-medium">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
