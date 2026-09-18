import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badge,
}) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-100',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-100',
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-2xl ${currentStyle.bg} flex items-center justify-center flex-shrink-0 ${currentStyle.border} border`}
        >
          {Icon && <Icon className={`w-7 h-7 ${currentStyle.icon}`} />}
        </div>
      </div>
      {badge && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          {badge}
        </div>
      )}
    </div>
  );
}
