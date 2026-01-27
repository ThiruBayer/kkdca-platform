'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, MapPin, Users, Trophy, Search, Filter } from 'lucide-react';

const fetchTournaments = async (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/tournaments?${searchParams}`);
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
  description?: string;
}

const statusColors: Record<string, string> = {
  UPCOMING: 'bg-blue-100 text-blue-700',
  REGISTRATION_OPEN: 'bg-green-100 text-green-700',
  REGISTRATION_CLOSED: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
};

const categories = ['All', 'Open', 'Under-7', 'Under-9', 'Under-11', 'Under-13', 'Under-15', 'Under-17', 'Girls', 'Senior'];

export default function TournamentsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tournaments', { search, category, status }],
    queryFn: () => fetchTournaments({
      ...(search && { search }),
      ...(category !== 'All' && { category }),
      ...(status && { status }),
    }),
  });

  const tournaments: Tournament[] = data?.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Tournaments</h1>
            <p className="text-xl text-primary-100">
              Discover and participate in chess tournaments organized by KDCA
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="REGISTRATION_OPEN">Registration Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tournament List */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border animate-pulse h-48" />
              ))}
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Tournaments Found
              </h3>
              <p className="text-gray-600">
                {search || category !== 'All' || status
                  ? 'Try adjusting your filters'
                  : 'Check back soon for new tournaments!'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[tournament.status] || 'bg-gray-100 text-gray-700'}`}>
                            {tournament.status.replace('_', ' ')}
                          </span>
                          <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                            {tournament.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {tournament.name}
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{tournament.venue}, {tournament.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{tournament.currentParticipants}/{tournament.maxParticipants} participants</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Entry Fee</span>
                          <p className="text-2xl font-bold text-gray-900">₹{tournament.entryFee}</p>
                        </div>
                        <Link
                          href={`/tournaments/${tournament.id}`}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
