'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Building2,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  UserCog,
} from 'lucide-react';
import { useState } from 'react';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: null },
  { name: 'My Profile', href: '/my-profile', icon: Users, roles: ['PLAYER', 'ARBITER'] },
  { name: 'Players', href: '/players', icon: Users, roles: ADMIN_ROLES },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy, roles: null },
  { name: 'Organizations', href: '/organizations', icon: Building2, roles: [...ADMIN_ROLES, 'ACADEMY', 'TALUK_ASSOCIATION'] },
  { name: 'ID Updates', href: '/id-updates', icon: UserCog, roles: ADMIN_ROLES },
  { name: 'Content', href: '/content', icon: FileText, roles: ADMIN_ROLES },
  { name: 'Payments', href: '/payments', icon: CreditCard, roles: ADMIN_ROLES },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ADMIN_ROLES },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 z-40 bg-black/50 hidden" />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="font-semibold text-gray-900">
                {user?.role && ADMIN_ROLES.includes(user.role) ? 'KKDCA Admin' : 'KKDCA Player'}
              </span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold">K</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-100 rounded hidden lg:block"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 text-gray-500 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.filter((item) => item.roles === null || (user?.role && item.roles.includes(user.role))).map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={() => logout()}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
