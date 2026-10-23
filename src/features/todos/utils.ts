import type { Filters, Todo, TodoInput } from './types'
import { ValidationError } from 'yup'
import { todoSchema } from './schema'
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function isOverdue(todo: Todo, today = localDate()) {
  return !todo.completed && !!todo.dueDate && todo.dueDate < today
}
export const priorityLabel = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' }
export function validateTodo(values: TodoInput) {
  try {
    todoSchema.validateSync(values)
    return ''
  } catch (error) {
    if (error instanceof ValidationError) return error.message
    throw error
  }
}
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
export function selectTodos(todos: Todo[], filters: Filters, today = localDate()) {
  const query = normalize(filters.search.trim())
  const ranks = { high: 0, medium: 1, low: 2 }
  return todos
    .filter(
      (todo) =>
        (!query || normalize(`${todo.title} ${todo.description}`).includes(query)) &&
        (filters.priority === 'all' || todo.priority === filters.priority) &&
        (filters.status === 'all' ||
          (filters.status === 'active' && !todo.completed) ||
          (filters.status === 'completed' && todo.completed) ||
          (filters.status === 'overdue' && isOverdue(todo, today))),
    )
    .sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':
          return a.createdAt.localeCompare(b.createdAt)
        case 'dueDate':
          return (a.dueDate || '9999').localeCompare(b.dueDate || '9999')
        case 'priority':
          return ranks[a.priority] - ranks[b.priority]
        default:
          return b.createdAt.localeCompare(a.createdAt)
      }
    })
}
