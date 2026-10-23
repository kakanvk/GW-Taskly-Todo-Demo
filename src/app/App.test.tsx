import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { todoApi } from '@/features/todos/api'
vi.mock('@/features/todos/api', () => ({
  todoApi: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}))
const todo = {
  id: '1',
  title: 'Viết bài lab',
  description: 'Từng bước',
  priority: 'high' as const,
  dueDate: '',
  completed: false,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(todoApi.list).mockResolvedValue([{ ...todo }])
})
describe('xác nhận thao tác', () => {
  it('hiện lỗi Yup dưới trường tên, focus và sửa lỗi trước khi tạo', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.create).mockResolvedValue({ ...todo, id: 'new', title: 'Hợp lệ' })
    render(<App />)
    await screen.findByRole('heading', { name: 'Viết bài lab' })
    await user.click(screen.getByRole('button', { name: 'Thêm công việc' }))
    await user.type(screen.getByLabelText(/Tên công việc/), '   ')
    await user.click(screen.getByRole('button', { name: 'Tạo công việc' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Vui lòng nhập tên công việc.')
    expect(screen.getByLabelText(/Tên công việc/)).toHaveFocus()
    expect(todoApi.create).not.toHaveBeenCalled()
    await user.clear(screen.getByLabelText(/Tên công việc/))
    await user.type(screen.getByLabelText(/Tên công việc/), '  Hợp lệ  ')
    await user.click(screen.getByRole('button', { name: 'Tạo công việc' }))
    await waitFor(() =>
      expect(todoApi.create).toHaveBeenCalledWith({
        title: 'Hợp lệ',
        description: '',
        priority: 'medium',
        dueDate: '',
      }),
    )
  })
  it('lọc ưu tiên bằng Select của shadcn/ui', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { name: 'Viết bài lab' })
    await user.click(screen.getByRole('combobox', { name: 'Lọc độ ưu tiên' }))
    await user.click(screen.getByRole('option', { name: 'Ưu tiên thấp' }))
    expect(screen.queryByRole('heading', { name: 'Viết bài lab' })).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Không tìm thấy công việc phù hợp' }),
    ).toBeInTheDocument()
  })

  it('chọn ưu tiên trong modal và mở lịch shadcn/ui', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.create).mockResolvedValue({ ...todo, id: '2', title: 'Việc ưu tiên' })
    render(<App />)
    await screen.findByRole('heading', { name: 'Viết bài lab' })
    await user.click(screen.getByRole('button', { name: 'Thêm công việc' }))
    await user.type(screen.getByLabelText(/Tên công việc/), 'Việc ưu tiên')
    await user.click(screen.getByRole('combobox', { name: 'Độ ưu tiên' }))
    await user.click(screen.getByRole('option', { name: 'Cao' }))
    await user.click(screen.getByRole('button', { name: 'Hạn hoàn thành' }))
    expect(screen.getByRole('grid')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.getByRole('heading', { name: 'Thêm công việc mới' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tạo công việc' }))
    await waitFor(() =>
      expect(todoApi.create).toHaveBeenCalledWith({
        title: 'Việc ưu tiên',
        description: '',
        priority: 'high',
        dueDate: '',
      }),
    )
  })
  it('hủy xóa không gọi API; xác nhận xóa mới gọi API', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.remove).mockResolvedValue({})
    render(<App />)
    await user.click(await screen.findByRole('button', { name: 'Xóa: Viết bài lab' }))
    expect(todoApi.remove).not.toHaveBeenCalled()
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Hủy' }))
    expect(screen.getByRole('heading', { name: 'Viết bài lab' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Xóa: Viết bài lab' }))
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Xác nhận' }),
    )
    await waitFor(() => expect(todoApi.remove).toHaveBeenCalledWith('1'))
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Viết bài lab' })).not.toBeInTheDocument(),
    )
  })
  it('hoàn thành và mở lại đều cần xác nhận', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.update)
      .mockResolvedValueOnce({ ...todo, completed: true })
      .mockResolvedValueOnce(todo)
    render(<App />)
    await user.click(await screen.findByRole('checkbox', { name: 'Hoàn thành: Viết bài lab' }))
    expect(todoApi.update).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Xác nhận' }))
    await user.click(await screen.findByRole('checkbox', { name: 'Mở lại: Viết bài lab' }))
    expect(todoApi.update).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Xác nhận' }))
    await waitFor(() => expect(todoApi.update).toHaveBeenLastCalledWith('1', { completed: false }))
  })
  it('hủy xác nhận sửa giữ bản nháp; API lỗi giữ modal để thử lại', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.update).mockRejectedValue(new Error('API lỗi'))
    render(<App />)
    await user.click(await screen.findByRole('button', { name: 'Sửa: Viết bài lab' }))
    await user.clear(screen.getByLabelText(/Tên công việc/))
    await user.type(screen.getByLabelText(/Tên công việc/), 'Tên mới')
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    expect(todoApi.update).not.toHaveBeenCalled()
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Hủy' }))
    expect(screen.getByLabelText(/Tên công việc/)).toHaveValue('Tên mới')
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    await user.click(screen.getByRole('button', { name: 'Xác nhận' }))
    await waitFor(() => expect(todoApi.update).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lưu thay đổi?' })).toBeInTheDocument()
  })
  it('thêm công việc qua form', async () => {
    const user = userEvent.setup()
    vi.mocked(todoApi.create).mockResolvedValue({ ...todo, id: '2', title: 'Việc mới' })
    render(<App />)
    await screen.findByRole('heading', { name: 'Viết bài lab' })
    await user.click(screen.getByRole('button', { name: 'Thêm công việc' }))
    await user.type(screen.getByLabelText(/Tên công việc/), 'Việc mới')
    await user.click(screen.getByRole('button', { name: 'Tạo công việc' }))
    await screen.findByRole('heading', { name: 'Việc mới' })
    expect(todoApi.create).toHaveBeenCalledWith({
      title: 'Việc mới',
      description: '',
      priority: 'medium',
      dueDate: '',
    })
  })
})
