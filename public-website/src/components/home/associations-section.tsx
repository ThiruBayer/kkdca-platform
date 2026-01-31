'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fetchTaluks = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/taluks`);
  if (!response.ok) throw new Error('Failed to fetch taluks');
  return response.json();
};

interface Taluk {
  id: string;
  code: string;
  name: string;
  nameTamil: string;
}

const talukColors = [
  'from-blue-500 to-indigo-600',
  'from-secondary-500 to-secondary-600',
  'from-emerald-500 to-teal-600',
  'from-primary-500 to-primary-600',
  'from-primary-600 to-primary-700',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-600',
];

export function AssociationsSection() {
  const { data } = useQuery({
    queryKey: ['taluks'],
    queryFn: fetchTaluks,
  });

  const taluks: Taluk[] = data || [];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Colorful decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-secondary-300 font-semibold mb-4 bg-secondary-500/20 px-4 py-1.5 rounded-full text-sm border border-secondary-500/30">
              Our Network
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Taluk Chess Associations</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              KKDCA operates through 7 taluk associations, each promoting chess
              at the local level and identifying talented players.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {taluks.map((taluk, index) => (
            <motion.div
              key={taluk.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/10 group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${talukColors[index % talukColors.length]} rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg`}>
                  {taluk.code}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-secondary-300 transition-colors">{taluk.name}</h3>
                  <p className="text-gray-400 text-sm">{taluk.nameTamil}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/associations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary-400 via-secondary-500 to-secondary-600 text-gray-900 font-semibold rounded-xl hover:from-secondary-300 hover:via-secondary-400 hover:to-secondary-500 transition-all shadow-lg"
          >
            View Association Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
