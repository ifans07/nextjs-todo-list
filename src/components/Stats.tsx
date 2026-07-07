'use client';

import React from 'react';
import { CheckCircle2, Circle, AlertTriangle, BarChart3 } from 'lucide-react';
import { Todo } from '@/types/todo';

interface StatsProps {
  todos: Todo[];
}

export default function Stats({ todos }: StatsProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriorityPending = todos.filter((t) => !t.completed && t.priority === 'high').length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-calm-blue-100 text-calm-blue-700 rounded-xl">
            <BarChart3 size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{total}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Tasks</div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{completed}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Completed</div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-calm-blue-50 text-calm-blue-600 rounded-xl">
            <Circle size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{pending}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pending</div>
          </div>
        </div>

        {/* High Priority Critical Tasks */}
        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-3">
          <div className={`p-2 rounded-xl ${highPriorityPending > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{highPriorityPending}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Critical</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>COMPLETION RATE</span>
          <span className="text-gold-600 font-bold">{completionRate}% DONE</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
