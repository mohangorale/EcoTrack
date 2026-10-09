import React from 'react';

export default function StatCard({ title, value, icon: Icon, iconColor = '#166534', iconBg = '#DCFCE7' }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col items-center justify-center text-center hover:border-slate-300 transition-all">
      {Icon && (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={20} />
        </div>
      )}
      <div className="text-2xl font-bold text-[#0F172A] tracking-tight">{value}</div>
      <div className="text-xs font-medium text-slate-500 mt-0.5">{title}</div>
    </div>
  );
}
