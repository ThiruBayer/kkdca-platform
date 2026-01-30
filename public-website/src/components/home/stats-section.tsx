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
    { label: 'Registered Players', value: stats.totalPlayers, icon: Users, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', text: 'text-primary-600' },
    { label: 'Tournaments Hosted', value: stats.totalTournaments, icon: Trophy, color: 'from-secondary-500 to-secondary-600', bg: 'bg-secondary-50', text: 'text-secondary-600' },
    { label: 'Chess Academies', value: stats.totalAcademies, icon: Building2, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Taluk Associations', value: stats.totalTaluks, icon: MapPin, color: 'from-saffron-500 to-saffron-600', bg: 'bg-saffron-50', text: 'text-saffron-600' },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-saffron-500" />

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
              <div className={`inline-flex items-center justify-center w-16 h-16 ${item.bg} rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                <item.icon className={`w-8 h-8 ${item.text}`} />
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
