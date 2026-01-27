'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search players, tournaments..."
            className="pl-10 bg-gray-50 border-0"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-medium text-sm">
              {user?.firstName?.[0]}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
