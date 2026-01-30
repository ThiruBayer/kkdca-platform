'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const fetchUpcomingTournaments = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/tournaments/upcoming?limit=3`);
  if (!response.ok) throw new Error('Failed to fetch tournaments');
  return response.json();
};

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  city: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  registrationDeadline: string;
  category: string;
  status: string;
}

export function TournamentsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['upcoming-tournaments'],
    queryFn: fetchUpcomingTournaments,
  });

  const tournaments: Tournament[] = data?.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string) => {
    const days = Math.ceil(
      (new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (days <= 0) return 'Closed';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Upcoming Tournaments
            </h2>
            <p className="text-gray-600">
              Register now for exciting chess competitions in Kallakurichi
            </p>
          </div>
          <Link
            href="/tournaments"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            View all tournaments
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border animate-pulse h-80" />
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Upcoming Tournaments
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new tournament announcements!
            </p>
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
            >
              View past tournaments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border hover:shadow-lg transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                      {tournament.category}
                    </span>
                    <span className="text-sm text-saffron-600 font-medium">
                      {getDaysUntil(tournament.registrationDeadline)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {tournament.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{tournament.venue}, {tournament.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {tournament.currentParticipants}/{tournament.maxParticipants} registered
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-sm text-gray-500">Entry Fee</span>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{tournament.entryFee}
                      </p>
                    </div>
                    <Link
                      href={`/tournaments/${tournament.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Register
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Link
          href="/tournaments"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          View all tournaments
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
