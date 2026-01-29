'use client';

import { useState, useEffect } from 'react';
import { Search, Users, MapPin, Filter } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kallaichess.com/v1';

interface Taluk {
  id: string;
  name: string;
  code: string;
  _count?: { users: number };
}

interface Player {
  id: string;
  kdcaId: string | null;
  firstName: string;
  lastName: string | null;
  displayName: string;
  status: string;
  role: string;
  taluk?: { name: string; code: string } | null;
  profile?: {
    fideId?: string;
    aicfId?: string;
    tncaId?: string;
    fideRatingStd?: number;
    aicfRating?: number;
    photoUrl?: string;
  } | null;
}

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');
  const [taluks, setTaluks] = useState<Taluk[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalPlayers: number; totalTaluks: number }>({ totalPlayers: 0, totalTaluks: 0 });

  // Fetch taluks
  useEffect(() => {
    fetch(`${API_URL}/public/taluks`)
      .then((r) => r.json())
      .then((data) => setTaluks(data?.data || data || []))
      .catch(() => {});

    fetch(`${API_URL}/public/stats`)
      .then((r) => r.json())
      .then((data) => {
        const d = data?.data || data || {};
        setStats({ totalPlayers: d.totalPlayers || 0, totalTaluks: d.totalTaluks || 0 });
      })
      .catch(() => {});
  }, []);

  // Fetch players
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (selectedTaluk) params.set('taluk', selectedTaluk);
    params.set('page', String(page));
    params.set('limit', '20');

    fetch(`${API_URL}/users/players/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const d = data?.data || data;
        setPlayers(d?.players || d?.items || []);
        setTotalPlayers(d?.total || 0);
        setTotalPages(d?.totalPages || Math.ceil((d?.total || 0) / 20));
        setLoading(false);
      })
      .catch(() => {
        setPlayers([]);
        setLoading(false);
      });
  }, [search, selectedTaluk, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">KKDCA Registered Players</h1>
            <p className="text-primary-100 text-lg mb-8">
              Search and find chess players across Kallakurichi District
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by Name, KKDCA ID, FIDE ID, AICF ID, TNSCA ID..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 shadow-lg text-base focus:ring-4 focus:ring-primary-300 focus:outline-none"
                />
              </div>
            </form>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.totalPlayers}</p>
              <p className="text-primary-200 text-sm">Total Players</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.totalTaluks}</p>
              <p className="text-primary-200 text-sm">Taluks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{totalPlayers}</p>
              <p className="text-primary-200 text-sm">Search Results</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{taluks.length}</p>
              <p className="text-primary-200 text-sm">Active Taluks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar - Taluk Filter */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border shadow-sm p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" />
                Filter by Taluk
              </h3>
              <button
                onClick={() => { setSelectedTaluk(''); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  !selectedTaluk ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Taluks
              </button>
              {taluks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTaluk(t.code); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors flex items-center justify-between ${
                    selectedTaluk === t.code ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Player List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {totalPlayers} player{totalPlayers !== 1 ? 's' : ''} found
                {selectedTaluk && ` in ${taluks.find((t) => t.code === selectedTaluk)?.name || selectedTaluk}`}
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-40" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No players found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                {players.map((player) => (
                  <div key={player.id} className="bg-white rounded-xl border hover:shadow-md transition-shadow p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                        {player.profile?.photoUrl ? (
                          <img src={player.profile.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <span className="text-primary-700 font-bold text-lg">
                            {player.firstName.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">
                            {player.firstName} {player.lastName || ''}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            player.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {player.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5 flex-wrap">
                          {player.kdcaId && <span className="font-medium text-primary-600">{player.kdcaId}</span>}
                          {player.taluk && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {player.taluk.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* IDs & Ratings */}
                      <div className="hidden md:flex items-center gap-4 text-sm">
                        {player.profile?.fideId && (
                          <div className="text-center">
                            <p className="text-xs text-gray-400">FIDE</p>
                            <p className="font-medium text-gray-700">{player.profile.fideId}</p>
                            {player.profile.fideRatingStd && (
                              <p className="text-xs text-primary-600">{player.profile.fideRatingStd}</p>
                            )}
                          </div>
                        )}
                        {player.profile?.aicfId && (
                          <div className="text-center">
                            <p className="text-xs text-gray-400">AICF</p>
                            <p className="font-medium text-gray-700">{player.profile.aicfId}</p>
                          </div>
                        )}
                        {player.profile?.tncaId && (
                          <div className="text-center">
                            <p className="text-xs text-gray-400">TNSCA</p>
                            <p className="font-medium text-gray-700">{player.profile.tncaId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
