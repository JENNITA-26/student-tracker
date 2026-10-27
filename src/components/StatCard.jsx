import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'indigo', sub }) {
  const palette = {
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', val: 'text-indigo-700' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', val: 'text-emerald-700' },
    amber:   { bg: 'bg-amber-50',   icon: 'bg-amber-100 text-amber-600',   val: 'text-amber-700'   },
    rose:    { bg: 'bg-rose-50',    icon: 'bg-rose-100 text-rose-600',     val: 'text-rose-700'    },
    sky:     { bg: 'bg-sky-50',     icon: 'bg-sky-100 text-sky-600',       val: 'text-sky-700'     },
    violet:  { bg: 'bg-violet-50',  icon: 'bg-violet-100 text-violet-600', val: 'text-violet-700'  },
  };

  const c = palette[color] || palette.indigo;

  return (
    <div className={`rounded-xl p-5 ${c.bg} flex items-start gap-4 hover:shadow-soft transition-shadow duration-200`}>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-0.5 ${c.val}`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
