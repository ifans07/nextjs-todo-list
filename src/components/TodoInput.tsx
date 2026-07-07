'use client';

import React, { useState } from 'react';
import { Plus, AlertCircle, Calendar, Tag } from 'lucide-react';
import { Priority } from '@/types/todo';

interface TodoInputProps {
  onAddTodo: (text: string, priority: Priority, category: string, dueDate?: string) => void;
}

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'];

export default function TodoInput({ onAddTodo }: TodoInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Personal');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Task content cannot be empty');
      return;
    }
    
    const finalCategory = showCustomCategory && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    onAddTodo(text.trim(), priority, finalCategory, dueDate || undefined);
    
    // Reset form
    setText('');
    setError('');
    setDueDate('');
    if (showCustomCategory) {
      setCustomCategory('');
      setShowCustomCategory(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Task input */}
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          placeholder="What needs to be done today?"
          className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold-500 focus:bg-white transition-all duration-300 pr-12 shadow-sm text-base"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 p-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors duration-300 shadow-md shadow-gold-500/25 active:scale-95 group"
          title="Add Task"
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-500 text-sm px-2 animate-pulse">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Meta configuration grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Priority Selectors */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Priority</label>
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium capitalize transition-all duration-300 ${
                  priority === p
                    ? p === 'high'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : p === 'medium'
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Tag size={12} className="text-slate-400" />
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowCustomCategory(!showCustomCategory)}
              className="text-xs text-gold-600 hover:text-gold-700 font-medium transition-colors"
            >
              {showCustomCategory ? 'Select List' : '+ Custom'}
            </button>
          </div>
          
          {showCustomCategory ? (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Workouts, Travel"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-colors"
            />
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-gold-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Due Date Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} className="text-slate-400" />
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>
    </form>
  );
}
