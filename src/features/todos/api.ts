import { request } from '@/lib/http'
import type { Todo, TodoInput } from './types'
export const todoApi = {
  list: () => request<Todo[]>('/todos'),
  create: (values: TodoInput) => {
    const now = new Date().toISOString()
    return request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({
        ...values,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: now,
        updatedAt: now,
      }),
    })
  },
  update: (id: string, values: Partial<TodoInput & Pick<Todo, 'completed'>>) =>
    request<Todo>(`/todos/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...values, updatedAt: new Date().toISOString() }),
    }),
  remove: (id: string) => request<object>(`/todos/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}
