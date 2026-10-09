import React from 'react';
import { Box, CheckCircle2, Truck, Activity, Flame, Sparkles, Clock } from 'lucide-react';

export default function TrackingTimeline({ history = [], currentStatus = '' }) {
  const getStepVisuals = (status) => {
    const s = (status || '').toUpperCase().replace(/\s+/g, '_');
    switch (s) {
      case 'REGISTERED':
        return { icon: Box, color: 'text-emerald-700 bg-emerald-100 ring-emerald-500', name: 'Registered' };
      case 'COLLECTED':
        return { icon: CheckCircle2, color: 'text-amber-700 bg-amber-100 ring-amber-500', name: 'Collected' };
      case 'IN_TRANSIT':
        return { icon: Truck, color: 'text-blue-700 bg-blue-100 ring-blue-500', name: 'In Transit' };
      case 'UNDER_INSPECTION':
      case 'INSPECTION':
        return { icon: Activity, color: 'text-orange-700 bg-orange-100 ring-orange-500', name: 'Under Inspection' };
      case 'REFURBISHED':
        return { icon: Sparkles, color: 'text-emerald-700 bg-emerald-100 ring-emerald-500', name: 'Refurbished' };
      case 'SENT_FOR_RECYCLING':
        return { icon: Flame, color: 'text-orange-700 bg-orange-100 ring-orange-500', name: 'Sent for Recycling' };
      case 'PROCESSED':
      case 'RECYCLED':
        return { icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-100 ring-emerald-500', name: 'Recycled' };
      default:
        return { icon: Clock, color: 'text-slate-600 bg-slate-100 ring-slate-400', name: status };
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        No tracking milestones recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {history.map((step, idx) => {
        const { icon: Icon, color, name } = getStepVisuals(step.status);
        const isLatest = idx === history.length - 1;
        const dateFormatted = step.createdAt
          ? new Date(step.createdAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Pending';

        return (
          <div key={idx} className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
            {/* Circle Node */}
            <div
              className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-2 bg-white ${color}`}
            >
              <Icon size={13} className="stroke-[2.5]" />
            </div>

            {/* Content */}
            <div className="flex-1 pl-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{name}</span>
                {isLatest && (
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {step.notes || step.location || 'Checkpoint recorded'}
              </p>
              {step.location && step.notes && (
                <p className="text-xs text-slate-400 mt-0.5">{step.location}</p>
              )}
            </div>

            {/* Timestamp */}
            <div className="text-[11px] sm:text-xs font-medium text-slate-400 sm:text-slate-500 sm:shrink-0 pl-2 sm:pl-0 sm:text-right">
              {dateFormatted}
            </div>
          </div>
        );
      })}
    </div>
  );
}
