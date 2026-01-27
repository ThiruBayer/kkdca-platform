'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Users, Trophy, Building2, CreditCard } from 'lucide-react';

export default function DashboardPage() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Players"
          value={stats.totalUsers}
          icon={Users}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Active Members"
          value={stats.activeMembers}
          icon={Users}
          trend="+8%"
          trendUp={true}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Building2}
          color="warning"
        />
        <StatsCard
          title="This Month Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={CreditCard}
          trend="+25%"
          trendUp={true}
          color="success"
        />
      </div>

      {/* Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={dashboard?.data?.recentActivities || []} />
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/players"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Manage Players</span>
            </a>
            <a
              href="/tournaments"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Trophy className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Tournaments</span>
            </a>
            <a
              href="/organizations"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Organizations</span>
            </a>
            <a
              href="/content"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium">Content</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
