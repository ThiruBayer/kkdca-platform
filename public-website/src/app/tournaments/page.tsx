'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, MapPin, Users, Trophy, Search, ChevronRight } from 'lucide-react';

const fetchTournaments = async (params: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/tournaments?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch tournaments');
  return response.json();
};

const fetchStats = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/stats`);
  if (!response.ok) return null;
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
  IN_PROGRESS: 'bg-teal-100 text-teal-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
};

const categories = ['All', 'Open', 'Under-7', 'Under-9', 'Under-11', 'Under-13', 'Under-15', 'Under-17', 'Girls', 'Senior'];

const dashboardItems = [
  { label: 'All Tournaments', filter: '' },
  { label: 'Upcoming', filter: 'UPCOMING' },
  { label: 'Registration Open', filter: 'REGISTRATION_OPEN' },
  { label: 'In Progress', filter: 'IN_PROGRESS' },
  { label: 'Completed', filter: 'COMPLETED' },
];

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

  const { data: statsData } = useQuery({
    queryKey: ['public-stats'],
    queryFn: fetchStats,
  });

  const tournaments: Tournament[] = data?.data || [];
  const stats = statsData?.data || statsData || {};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[68px]">
      {/* Compact Player Dashboard Bar */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 overflow-x-auto gap-4">
            <div className="flex items-center gap-6 text-sm whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-300" />
                <span className="text-teal-200">Registered Players:</span>
                <span className="font-bold">{stats.totalPlayers || 0}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-teal-200">Tournaments:</span>
                <span className="font-bold">{stats.totalTournaments || tournaments.length}</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span className="text-teal-200">Taluks:</span>
                <span className="font-bold">{stats.totalTaluks || 6}</span>
              </div>
            </div>
            <Link
              href="/players"
              className="flex items-center gap-1 text-xs text-teal-200 hover:text-white transition-colors whitespace-nowrap"
            >
              View All Players <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Menu - Single line clickable filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {dashboardItems.map((item) => (
              <button
                key={item.filter}
                onClick={() => setStatus(item.filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  status === item.filter
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="py-4 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
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
          </div>
        </div>
      </section>

      {/* Tournament List */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {status ? dashboardItems.find(d => d.filter === status)?.label || 'Tournaments' : 'All Tournaments'}
            </h1>
            <span className="text-sm text-gray-500">{tournaments.length} found</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border animate-pulse h-40" />
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
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[tournament.status] || 'bg-gray-100 text-gray-700'}`}>
                            {tournament.status.replace('_', ' ')}
                          </span>
                          <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                            {tournament.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {tournament.name}
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-3 text-sm text-gray-600">
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
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <span className="text-xs text-gray-500">Entry Fee</span>
                          <p className="text-xl font-bold text-gray-900">₹{tournament.entryFee}</p>
                        </div>
                        <Link
                          href={`/tournaments/${tournament.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
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
