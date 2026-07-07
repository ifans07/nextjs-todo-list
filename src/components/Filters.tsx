'use client';

import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Trash2, CalendarRange } from 'lucide-react';
import { FilterType, SortType } from '@/types/todo';

interface FiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClearCompleted: () => void;
  completedCount: number;
}

export default function Filters({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onClearCompleted,
  completedCount
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
      {/* Filters Tabs & Clear button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['all', 'active', 'completed'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-300 ${
                filter === type
                  ? 'bg-white text-calm-blue-800 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer"
            title="Clear all completed tasks"
          >
            <Trash2 size={13} />
            <span>Clear Completed ({completedCount})</span>
          </button>
        )}
      </div>

      {/* Sorting & Category Filtering Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Category selector */}
        <div className="flex-1 flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-gold-500 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex-1 flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-gold-500 transition-colors"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="priority-desc">Priority: High to Low</option>
            <option value="dueDate-asc">Due Date: Soonest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
    </div>
  );
}
