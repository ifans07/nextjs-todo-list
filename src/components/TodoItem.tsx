'use client';

import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Todo, Priority } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({
  todo,
  onToggleComplete,
  onUpdateText,
  onUpdatePriority,
  onDelete
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onUpdateText(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  // Determine priority classes
  const priorityColors = {
    low: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'bg-emerald-500'
    },
    medium: {
      bg: 'bg-gold-50 text-gold-700 border-gold-200',
      badge: 'bg-gold-500'
    },
    high: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'bg-rose-500'
    }
  };

  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl transition-all duration-300 gap-3 bg-white ${
        todo.completed
          ? 'bg-slate-50/70 border-slate-100 opacity-60'
          : 'border-slate-100 hover:border-gold-300 hover:shadow-md hover:shadow-calm-blue-100/30'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Custom Checkbox */}
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`flex items-center justify-center w-6 h-6 rounded-lg border-2 mt-0.5 transition-all duration-300 cursor-pointer shrink-0 ${
            todo.completed
              ? 'bg-gold-500 border-gold-500 text-white'
              : 'border-slate-300 hover:border-gold-500 hover:bg-gold-50/50'
          }`}
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed && <Check size={16} strokeWidth={3} />}
        </button>

        {/* Task Text & Metas */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-gold-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                title="Save"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => {
                  setEditText(todo.text);
                  setIsEditing(false);
                }}
                className="p-1.5 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-colors"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <span
                className={`block text-sm font-medium text-slate-800 break-words ${
                  todo.completed ? 'line-through text-slate-400' : ''
                }`}
              >
                {todo.text}
              </span>

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-2 items-center text-xs text-slate-400">
                {/* Category Tag */}
                <span className="flex items-center gap-1 bg-calm-blue-50 text-calm-blue-700 px-2 py-0.5 rounded-full font-medium">
                  <Tag size={10} />
                  {todo.category}
                </span>

                {/* Due Date Indicator */}
                {todo.dueDate && (
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                      isOverdue
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Calendar size={10} />
                    {new Date(todo.dueDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                    {isOverdue && (
                      <span className="flex items-center gap-0.5 text-rose-600 font-bold ml-0.5">
                        <AlertCircle size={10} />
                        Overdue
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons & Priority Select */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:pl-0 pl-9 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        {/* Priority Badge Dropdown */}
        <div className="relative">
          <select
            value={todo.priority}
            onChange={(e) => onUpdatePriority(todo.id, e.target.value as Priority)}
            disabled={todo.completed}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              priorityColors[todo.priority].bg
            }`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {!todo.completed && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-slate-400 hover:text-gold-500 hover:bg-slate-50 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit3 size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
