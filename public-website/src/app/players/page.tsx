'use client';

import { useState, useEffect } from 'react';
import { Search, Users, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 pt-[68px]">
      {/* Compact Dashboard Bar */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg font-bold">KKDCA Players</h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <span className="font-bold text-amber-300">{stats.totalPlayers}</span>
                <span className="text-teal-200">Registered</span>
              </div>
              {taluks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTaluk(selectedTaluk === t.code ? '' : t.code); setPage(1); }}
                  className={`hidden md:flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedTaluk === t.code
                      ? 'bg-amber-400 text-gray-900'
                      : 'bg-white/10 text-teal-100 hover:bg-white/20'
                  }`}
                >
                  {t.name}
                  {t._count?.users != null && (
                    <span className={`ml-0.5 font-bold ${selectedTaluk === t.code ? 'text-gray-800' : 'text-amber-300'}`}>
                      {t._count.users}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name, KKDCA ID, FIDE ID, AICF ID, TNSCA ID..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>
            </form>
            {/* Mobile taluk filter */}
            <select
              value={selectedTaluk}
              onChange={(e) => { setSelectedTaluk(e.target.value); setPage(1); }}
              className="md:hidden border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Taluks</option>
              {taluks.map((t) => (
                <option key={t.id} value={t.code}>{t.name}</option>
              ))}
            </select>
            <div className="text-sm text-gray-500">
              {totalPlayers} player{totalPlayers !== 1 ? 's' : ''} found
              {selectedTaluk && ` in ${taluks.find((t) => t.code === selectedTaluk)?.name || selectedTaluk}`}
            </div>
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
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
          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="bg-white rounded-xl border hover:shadow-md transition-shadow p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    {player.profile?.photoUrl ? (
                      <img src={player.profile.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <span className="text-teal-700 font-bold text-sm">
                        {player.firstName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {player.firstName} {player.lastName || ''}
                      </h3>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        player.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {player.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
                      {player.kdcaId && <span className="font-medium text-teal-600">{player.kdcaId}</span>}
                      {player.taluk && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {player.taluk.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    {player.profile?.fideId && (
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">FIDE</p>
                        <p className="font-medium text-gray-700 text-xs">{player.profile.fideId}</p>
                        {player.profile.fideRatingStd && (
                          <p className="text-[10px] text-teal-600">{player.profile.fideRatingStd}</p>
                        )}
                      </div>
                    )}
                    {player.profile?.aicfId && (
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">AICF</p>
                        <p className="font-medium text-gray-700 text-xs">{player.profile.aicfId}</p>
                      </div>
                    )}
                    {player.profile?.tncaId && (
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400">TNSCA</p>
                        <p className="font-medium text-gray-700 text-xs">{player.profile.tncaId}</p>
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
  );
}
