import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import {
  CheckCheck,
  CheckCircle2,
  Circle,
  Clock3,
  Layers,
  ListTodo,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTodos } from '@/features/todos/hooks/use-todos'
import { todoApi } from '@/features/todos/api'
import { isOverdue, selectTodos } from '@/features/todos/utils'
import type { Filters, PendingAction, StatusFilter, Todo, TodoInput } from '@/features/todos/types'
import { TodoForm } from '@/features/todos/components/todo-form'
import { TodoCard } from '@/features/todos/components/todo-card'
import { ConfirmDialog } from '@/features/todos/components/confirm-dialog'
const initialFilters: Filters = { search: '', status: 'all', priority: 'all', sort: 'newest' }
const tabs: { value: StatusFilter; label: string; icon: typeof Layers }[] = [
  { value: 'all', label: 'Tất cả', icon: Layers },
  { value: 'active', label: 'Đang làm', icon: Circle },
  { value: 'completed', label: 'Hoàn thành', icon: CheckCircle2 },
  { value: 'overdue', label: 'Quá hạn', icon: Clock3 },
]
export function App() {
  const { todos, loading, error, busy, load, mutate } = useTodos()
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [form, setForm] = useState<{ todo: Todo | null } | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const visible = selectTodos(todos, filters)
  const completed = todos.filter((t) => t.completed).length
  const overdue = todos.filter((t) => isOverdue(t)).length
  const counts = { all: todos.length, active: todos.length - completed, completed, overdue }
  const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0
  async function save(values: TodoInput) {
    if (form?.todo) {
      setPending({ type: 'update', todo: form.todo, values })
      return
    }
    if (await mutate(() => todoApi.create(values), 'Đã tạo công việc mới.')) setForm(null)
  }
  async function confirm() {
    if (!pending) return
    const action = pending
    const ok =
      action.type === 'delete'
        ? await mutate(() => todoApi.remove(action.todo.id), 'Đã xóa công việc.', action.todo.id)
        : action.type === 'update'
          ? await mutate(() => todoApi.update(action.todo.id, action.values), 'Đã lưu thay đổi.')
          : await mutate(
              () => todoApi.update(action.todo.id, { completed: !action.todo.completed }),
              action.todo.completed ? 'Đã mở lại công việc.' : 'Đã hoàn thành công việc.',
            )
    if (ok) {
      setPending(null)
      if (action.type === 'update') setForm(null)
    }
  }
  return (
    <>
      <main className="app-shell">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
              <CheckCheck className="size-5" />
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight">
                taskly<span className="text-primary">.</span>
              </p>
              <p className="text-[11px] text-muted-foreground">Công việc cá nhân</p>
            </div>
          </div>
          <Button
            onClick={() => setForm({ todo: null })}
            disabled={loading || !!error || busy}
            className="h-9 gap-1.5 rounded-lg px-3 text-xs"
          >
            <Plus className="size-4" />
            Thêm công việc
          </Button>
        </header>

        <section aria-label="Tổng quan" className="mb-5 rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-base font-semibold">Công việc của bạn</h1>
            <span className="text-xs text-muted-foreground">
              {loading || error ? '—' : completed + '/' + todos.length} hoàn thành
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress className="h-1.5 flex-1" aria-label="Tiến độ hoàn thành" value={progress} />
            <span className="text-xs font-semibold tabular-nums text-primary">{progress}%</span>
          </div>
        </section>

        <Tabs
          value={filters.status}
          onValueChange={(status) => setFilters({ ...filters, status: status as StatusFilter })}
          className="mb-4"
        >
          <TabsList
            aria-label="Lọc trạng thái"
            className="grid h-auto w-full grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1"
          >
            {tabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="min-w-0 gap-1 rounded-lg px-1 py-2 text-[11px] sm:gap-1.5 sm:text-xs"
              >
                <Icon className="hidden size-3.5 sm:block" />
                <span>{label}</span>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {loading || error ? '—' : counts[value]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <section aria-label="Danh sách công việc">
          <div className="mb-4 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label="Tìm kiếm công việc"
                placeholder="Tìm công việc…"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="h-10 bg-white pl-9 pr-10 text-sm"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Xóa từ khóa"
                  className="absolute right-1 top-1 size-8"
                  onClick={() => setFilters({ ...filters, search: '' })}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Select
                value={filters.priority}
                onValueChange={(priority: Filters['priority']) =>
                  setFilters({ ...filters, priority })
                }
              >
                <SelectTrigger aria-label="Lọc độ ưu tiên" className="w-full bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">Mọi ưu tiên</SelectItem>
                  <SelectItem value="high">Ưu tiên cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Ưu tiên thấp</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.sort}
                onValueChange={(sort: Filters['sort']) => setFilters({ ...filters, sort })}
              >
                <SelectTrigger aria-label="Sắp xếp" className="w-full bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="dueDate">Hạn gần nhất</SelectItem>
                  <SelectItem value="priority">Ưu tiên cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {loading ? (
            <div role="status" className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl border" />
              ))}
              <span className="sr-only">Đang tải công việc…</span>
            </div>
          ) : error ? (
            <div role="alert" className="empty-state">
              <p className="font-semibold">Chưa thể tải công việc</p>
              <p className="my-3 text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => void load()}>
                Thử lại
              </Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="empty-state">
              <ListTodo className="mx-auto mb-4 size-10 text-violet-300" />
              <h3 className="font-semibold">
                {todos.length ? 'Không tìm thấy công việc phù hợp' : 'Chưa có công việc'}
              </h3>
              <p className="my-3 text-sm text-muted-foreground">
                {todos.length
                  ? 'Thử đổi từ khóa hoặc đặt lại bộ lọc.'
                  : 'Tạo công việc để bắt đầu.'}
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  todos.length ? setFilters(initialFilters) : setForm({ todo: null })
                }
              >
                {todos.length ? 'Đặt lại bộ lọc' : 'Thêm công việc đầu tiên'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  busy={busy}
                  onEdit={() => setForm({ todo })}
                  onDelete={() => setPending({ type: 'delete', todo })}
                  onToggle={() => setPending({ type: 'toggle', todo })}
                />
              ))}
            </div>
          )}
          <p aria-live="polite" className="mt-4 text-xs text-muted-foreground">
            {!loading && !error && `Hiển thị ${visible.length} trên ${todos.length} công việc`}
          </p>
        </section>

        <footer className="mt-6 border-t pt-4 text-center text-[11px] text-muted-foreground">
          Taskly · Quản lý công việc cá nhân
        </footer>
      </main>
      {form && (
        <TodoForm
          key={form.todo?.id ?? 'new'}
          todo={form.todo}
          busy={busy}
          confirming={!!pending}
          onClose={() => setForm(null)}
          onSave={save}
        />
      )}
      <ConfirmDialog
        action={pending}
        busy={busy}
        onCancel={() => setPending(null)}
        onConfirm={() => void confirm()}
      />
      <Toaster richColors closeButton position="top-right" />
    </>
  )
}
