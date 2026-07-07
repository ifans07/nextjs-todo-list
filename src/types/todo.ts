export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export type SortType = 'createdAt-desc' | 'createdAt-asc' | 'priority-desc' | 'dueDate-asc' | 'alphabetical';
