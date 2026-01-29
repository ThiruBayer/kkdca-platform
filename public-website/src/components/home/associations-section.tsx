'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Users, Phone, ArrowRight } from 'lucide-react';

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

export function AssociationsSection() {
  const { data } = useQuery({
    queryKey: ['taluks'],
    queryFn: fetchTaluks,
  });

  const taluks: Taluk[] = data || [];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Taluk Chess Associations</h2>
            <p className="text-primary-100 max-w-2xl mx-auto">
              KDCA operates through 6 taluk associations, each promoting chess
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
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors border border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-lg text-primary-900">
                  {taluk.code}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{taluk.name}</h3>
                  <p className="text-primary-200 text-sm">{taluk.nameTamil}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/associations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-primary-900 font-semibold rounded-lg hover:bg-accent-400 transition-colors"
          >
            View Association Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
