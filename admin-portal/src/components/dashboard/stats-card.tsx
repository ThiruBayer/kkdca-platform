import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = 'default',
}: StatsCardProps) {
  const colorClasses = {
    default: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            colorClasses[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trendUp ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}
