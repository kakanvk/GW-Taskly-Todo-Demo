import { describe, expect, it } from 'vitest'
import { todoSchema } from './schema'
const valid = { title: 'Công việc', description: '', priority: 'medium', dueDate: '' }
describe('Yup Todo schema', () => {
  it('trim chuỗi và từ chối tên chỉ có khoảng trắng', () => {
    expect(
      todoSchema.validateSync({ ...valid, title: '  Công việc  ', description: ' ghi chú ' }),
    ).toMatchObject({ title: 'Công việc', description: 'ghi chú' })
    expect(() => todoSchema.validateSync({ ...valid, title: '   ' })).toThrow(
      'Vui lòng nhập tên công việc.',
    )
  })
  it('kiểm tra giới hạn tên và mô tả', () => {
    expect(
      todoSchema.isValidSync({ ...valid, title: 'a'.repeat(120), description: 'a'.repeat(1000) }),
    ).toBe(true)
    expect(todoSchema.isValidSync({ ...valid, title: 'a'.repeat(121) })).toBe(false)
    expect(todoSchema.isValidSync({ ...valid, description: 'a'.repeat(1001) })).toBe(false)
  })
  it('từ chối ưu tiên không hợp lệ', () => {
    expect(todoSchema.isValidSync({ ...valid, priority: 'urgent' })).toBe(false)
  })
  it('kiểm tra ngày thực, cho phép ngày trống và ngày quá khứ', () => {
    for (const dueDate of ['', '2024-02-29', '2020-01-01'])
      expect(todoSchema.isValidSync({ ...valid, dueDate })).toBe(true)
    for (const dueDate of ['2025-02-29', '2026-02-31', '2026-13-01', '22/10/2026'])
      expect(todoSchema.isValidSync({ ...valid, dueDate })).toBe(false)
  })
})
