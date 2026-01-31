
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendColor?: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, trendColor, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {trend && (
            <span className={`text-xs font-semibold ${trendColor}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
