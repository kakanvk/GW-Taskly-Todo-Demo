import { describe, expect, it } from 'vitest'
import { isOverdue, selectTodos, validateTodo } from './utils'
import type { Filters, Todo } from './types'
const filters: Filters = { search: '', status: 'all', priority: 'all', sort: 'newest' }
const todo: Todo = {
  id: '1',
  title: 'Đọc tài liệu React',
  description: 'Kiểm tra API',
  priority: 'high',
  dueDate: '2026-01-10',
  completed: false,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}
describe('nghiệp vụ Todo', () => {
  it('tìm kiếm không dấu, hoa thường và khoảng trắng', () => {
    expect(selectTodos([todo], { ...filters, search: '  DOC TAI LIEU  ' })).toHaveLength(1)
    expect(selectTodos([todo], { ...filters, search: 'kiem tra' })).toHaveLength(1)
  })
  it('kết hợp search, trạng thái và ưu tiên', () => {
    expect(
      selectTodos([todo], { ...filters, search: 'react', status: 'active', priority: 'low' }),
    ).toHaveLength(0)
    expect(selectTodos([todo], { ...filters, status: 'active', priority: 'high' })).toHaveLength(1)
  })
  it('chỉ quá hạn sau ngày hạn và khi chưa hoàn thành', () => {
    expect(isOverdue(todo, '2026-01-10')).toBe(false)
    expect(isOverdue(todo, '2026-01-11')).toBe(true)
    expect(isOverdue({ ...todo, completed: true }, '2026-01-11')).toBe(false)
    expect(isOverdue({ ...todo, dueDate: '' }, '2026-01-11')).toBe(false)
  })
  it('xếp ngày trống cuối và không sửa mảng nguồn', () => {
    const input = [{ ...todo, id: '2', dueDate: '' }, todo]
    expect(selectTodos(input, { ...filters, sort: 'dueDate' })[0].id).toBe('1')
    expect(input[0].id).toBe('2')
  })
  it('từ chối tiêu đề trống hoặc quá dài', () => {
    expect(validateTodo({ ...todo, title: '   ' })).not.toBe('')
    expect(validateTodo({ ...todo, title: 'a'.repeat(121) })).not.toBe('')
    expect(validateTodo(todo)).toBe('')
  })
})
