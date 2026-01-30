'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, ArrowRight, GraduationCap } from 'lucide-react';

const fetchAcademies = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/academies?limit=4`);
  if (!response.ok) throw new Error('Failed to fetch academies');
  return response.json();
};

interface Academy {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  rating: number;
  totalStudents: number;
  logo?: string;
}

export function AcademiesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-academies'],
    queryFn: fetchAcademies,
  });

  const academies: Academy[] = data?.data || [];

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Chess Academies
            </h2>
            <p className="text-gray-600">
              Learn from certified coaches at registered academies in Kallakurichi
            </p>
          </div>
          <Link
            href="/academies"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View all academies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border animate-pulse h-64" />
            ))}
          </div>
        ) : academies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Academies Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              We are onboarding chess academies. Check back soon!
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              Register your academy
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {academies.map((academy, index) => (
              <motion.div
                key={academy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border hover:shadow-lg transition-all group overflow-hidden"
              >
                <div className="h-24 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  {academy.logo ? (
                    <img
                      src={academy.logo}
                      alt={academy.name}
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    <GraduationCap className="w-12 h-12 text-white/80" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {academy.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= academy.rating
                            ? 'text-secondary-500 fill-secondary-500'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      ({academy.rating})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{academy.city}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{academy.totalStudents}+ students</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Link
          href="/academies"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          View all academies
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
