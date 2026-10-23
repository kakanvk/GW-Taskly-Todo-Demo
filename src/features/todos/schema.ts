import * as yup from 'yup'
import type { TodoInput } from './types'
export const todoSchema: yup.ObjectSchema<TodoInput> = yup.object({
  title: yup
    .string()
    .trim()
    .required('Vui lòng nhập tên công việc.')
    .max(120, 'Tên công việc tối đa 120 ký tự.'),
  description: yup.string().trim().defined().max(1000, 'Mô tả tối đa 1.000 ký tự.'),
  priority: yup
    .mixed<TodoInput['priority']>()
    .oneOf(['low', 'medium', 'high'], 'Độ ưu tiên không hợp lệ.')
    .required('Vui lòng chọn độ ưu tiên.'),
  dueDate: yup
    .string()
    .defined()
    .test('valid-date', 'Ngày hạn không hợp lệ.', (value) => {
      if (!value) return true
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
      const date = new Date(`${value}T00:00:00`)
      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === Number(value.slice(0, 4)) &&
        date.getMonth() + 1 === Number(value.slice(5, 7)) &&
        date.getDate() === Number(value.slice(8, 10))
      )
    }),
})
