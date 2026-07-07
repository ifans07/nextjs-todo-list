'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, CheckSquare, ListTodo, ClipboardList } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Todo, Priority, FilterType, SortType } from '@/types/todo';
import TodoInput from '@/components/TodoInput';
import TodoItem from '@/components/TodoItem';
import Stats from '@/components/Stats';
import Filters from '@/components/Filters';

export default function Home() {
  const [todos, setTodos, isLoaded] = useLocalStorage<Todo[]>('serene-tasks', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('createdAt-desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handle Add Todo
  const handleAddTodo = (text: string, priority: Priority, category: string, dueDate?: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text,
      completed: false,
      priority,
      category,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // Handle Toggle Complete
  const handleToggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handle Update Text
  const handleUpdateText = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  // Handle Update Priority
  const handleUpdatePriority = (id: string, priority: Priority) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Handle Clear Completed
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // Get all unique categories for filter select dropdown
  const categories = useMemo(() => {
    const cats = todos.map((t) => t.category);
    return Array.from(new Set(cats)).filter((c) => c !== '');
  }, [todos]);

  // Filter & Sort logic
  const filteredSortedTodos = useMemo(() => {
    let result = [...todos];

    // 1. Status Filter
    if (filter === 'active') {
      result = result.filter((todo) => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter((todo) => todo.completed);
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((todo) => todo.category === selectedCategory);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority-desc': {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        case 'dueDate-asc': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        default:
          return 0;
      }
    });

    return result;
  }, [todos, filter, sortBy, selectedCategory]);

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-blue-950 via-calm-blue-900 to-calm-blue-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Glow Effects (SaaS Background Accent) */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-calm-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl space-y-8 z-10">
        
        {/* App Branding & Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-gold-400 mb-2">
            <CheckSquare size={36} className="filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            Serene<span className="text-gold-400">Task</span>
            <Sparkles size={20} className="text-gold-400 fill-gold-400 animate-pulse" />
          </h1>
          <p className="text-sm sm:text-base text-calm-blue-200 max-w-md mx-auto">
            A premium, calm spaces workspace to map, schedule, and achieve your daily operations.
          </p>
        </header>

        {/* Loading Indicator */}
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-12 h-12 border-4 border-gold-400/20 border-t-gold-500 rounded-full animate-spin" />
            <p className="text-calm-blue-200 text-sm font-semibold tracking-wider">Syncing with LocalStorage...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Stats Panel (white transparent card, part of the 30% white elements) */}
            <section className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-black/10 border border-slate-100">
              <Stats todos={todos} />
            </section>

            {/* Todo Manager Dashboard (Main white component card, 30% of theme) */}
            <main className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/15 border border-slate-100 space-y-6">
              
              {/* Task Insertion Form */}
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Add New Task</h2>
                <TodoInput onAddTodo={handleAddTodo} />
              </div>

              {/* Filtering and Utility Row */}
              <Filters
                filter={filter}
                onFilterChange={setFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onClearCompleted={handleClearCompleted}
                completedCount={completedCount}
              />

              {/* Todos List Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Task List</span>
                  <span>{filteredSortedTodos.length} items shown</span>
                </div>

                {filteredSortedTodos.length > 0 ? (
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {filteredSortedTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onUpdateText={handleUpdateText}
                        onUpdatePriority={handleUpdatePriority}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty state block */
                  <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl">
                      {todos.length === 0 ? <ClipboardList size={32} /> : <ListTodo size={32} />}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-slate-700 text-sm">
                        {todos.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        {todos.length === 0
                          ? 'Get started by creating your very first task above!'
                          : 'Try modifying your filter settings or category sorting to see other tasks.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-calm-blue-300 pt-4 pb-2">
          <p>© {new Date().getFullYear()} SereneTask. Crafted in calm blue & gold.</p>
        </footer>
      </div>
    </div>
  );
}
