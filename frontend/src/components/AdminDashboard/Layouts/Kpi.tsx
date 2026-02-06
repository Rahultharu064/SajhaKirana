
import { TrendingUp, TrendingDown } from 'lucide-react';

type Props = {
  title: string;
  value: string;
  trend?: string;
  icon?: React.ReactNode;
  color?: string;
};

export default function KPI({ title, value, trend, icon, color = 'emerald' }: Props) {
  const isPositive = trend?.startsWith("+");
  // const trendColor = isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
  
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-600',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-600',
  }[color] || 'from-emerald-500 to-teal-600';

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700/50 overflow-hidden">
      {/* Gradient Background Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
          )}
          {trend && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isPositive 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
      </div>

      {/* Decorative Element */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${colorClasses} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
    </div>
  );
}
