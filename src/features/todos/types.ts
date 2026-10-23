export type Priority = 'low' | 'medium' | 'high'
export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: string
  updatedAt: string
}
export type TodoInput = Pick<Todo, 'title' | 'description' | 'priority' | 'dueDate'>
export type StatusFilter = 'all' | 'active' | 'completed' | 'overdue'
export interface Filters {
  search: string
  status: StatusFilter
  priority: 'all' | Priority
  sort: 'newest' | 'oldest' | 'dueDate' | 'priority'
}
export type PendingAction =
  | { type: 'update'; todo: Todo; values: TodoInput }
  | { type: 'delete' | 'toggle'; todo: Todo }
