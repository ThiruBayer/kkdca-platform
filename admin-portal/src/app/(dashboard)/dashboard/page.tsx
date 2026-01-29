'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Users, Trophy, Building2, CreditCard, User, Calendar, Award } from 'lucide-react';
import Link from 'next/link';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

function AdminDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = dashboard?.data?.stats || {
    totalUsers: 0,
    activeMembers: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Players" value={stats.totalUsers} icon={Users} trend="+12%" trendUp={true} />
        <StatsCard title="Active Members" value={stats.activeMembers} icon={Users} trend="+8%" trendUp={true} />
        <StatsCard title="Pending Approvals" value={stats.pendingApprovals} icon={Building2} color="warning" />
        <StatsCard title="This Month Revenue" value={`₹${stats.totalRevenue?.toLocaleString() || 0}`} icon={CreditCard} trend="+25%" trendUp={true} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={dashboard?.data?.recentActivities || []} />
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/players" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Manage Players</span>
            </Link>
            <Link href="/tournaments" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Trophy className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Tournaments</span>
            </Link>
            <Link href="/organizations" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Building2 className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Organizations</span>
            </Link>
            <Link href="/content" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <CreditCard className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Content</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function PlayerDashboard() {
  const { user } = useAuthStore();

  const { data: profile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => api.get('/users/me').then((res) => res.data?.data || res.data),
  });

  const { data: tournaments } = useQuery({
    queryKey: ['public-tournaments'],
    queryFn: () => api.get('/tournaments?status=UPCOMING&limit=5').then((res) => res.data?.data || res.data || []),
  });

  return (
    <>
      {/* Player Info Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
            {profile?.kdcaId && (
              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-primary-100 text-primary-700">
                KDCA ID: {profile.kdcaId}
              </span>
            )}
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
              user?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {user?.status || 'PENDING'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6 text-center">
          <Trophy className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{profile?.playerProfile?.tournamentsPlayed || 0}</p>
          <p className="text-sm text-gray-500">Tournaments Played</p>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{profile?.playerProfile?.fideRating || '-'}</p>
          <p className="text-sm text-gray-500">FIDE Rating</p>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {profile?.membershipExpiresAt ? new Date(profile.membershipExpiresAt).toLocaleDateString('en-IN') : 'N/A'}
          </p>
          <p className="text-sm text-gray-500">Membership Expiry</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/my-profile" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <User className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium">Edit My Profile</span>
            </Link>
            <Link href="/tournaments" className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
              <Trophy className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium">Browse Tournaments</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming Tournaments</h3>
          {Array.isArray(tournaments) && tournaments.length > 0 ? (
            <div className="space-y-3">
              {tournaments.slice(0, 3).map((t: any) => (
                <Link key={t.id} href={`/tournaments`} className="block p-3 border rounded-lg hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.startDate ? new Date(t.startDate).toLocaleDateString('en-IN') : ''}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No upcoming tournaments</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role && ADMIN_ROLES.includes(user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          {isAdmin ? "Welcome back! Here's what's happening." : `Welcome, ${user?.firstName}!`}
        </p>
      </div>
      {isAdmin ? <AdminDashboard /> : <PlayerDashboard />}
    </div>
  );
}
