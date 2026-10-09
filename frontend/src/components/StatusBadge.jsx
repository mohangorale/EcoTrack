import React from 'react';

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  switch (normalized) {
    case 'REGISTERED':
      style = 'badge-registered';
      label = 'Registered';
      break;
    case 'COLLECTED':
      style = 'badge-collected';
      label = 'Collected';
      break;
    case 'IN_TRANSIT':
      style = 'badge-in-transit';
      label = 'In Transit';
      break;
    case 'UNDER_INSPECTION':
    case 'INSPECTION':
      style = 'badge-inspection';
      label = 'Inspection';
      break;
    case 'IN_PROCESSING':
      style = 'bg-sky-50 text-sky-700 border-sky-200';
      label = 'In Processing';
      break;
    case 'SENT_FOR_RECYCLING':
      style = 'bg-amber-50 text-amber-700 border-amber-200';
      label = 'Sent for Recycling';
      break;
    case 'REFURBISHED':
      style = 'badge-refurbished';
      label = 'Refurbished';
      break;
    case 'PROCESSED':
    case 'RECYCLED':
      style = 'badge-recycled';
      label = 'Recycled';
      break;
    case 'ACTIVE':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      label = 'Active';
      break;
    case 'SUSPENDED':
    case 'DISABLED':
      style = 'bg-rose-50 text-rose-700 border-rose-200';
      label = 'Disabled';
      break;
    default:
      label = status.replace(/_/g, ' ');
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}
    >
      {label}
    </span>
  );
}
