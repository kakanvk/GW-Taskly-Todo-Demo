import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { Todo } from '../types'
import { isOverdue, priorityLabel } from '../utils'
export function TodoCard({
  todo,
  busy,
  onEdit,
  onDelete,
  onToggle,
}: {
  todo: Todo
  busy: boolean
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const overdue = isOverdue(todo)
  return (
    <article className="group flex gap-3 rounded-xl border bg-white p-3.5 transition-shadow hover:shadow-sm sm:p-4">
      <Checkbox
        disabled={busy}
        aria-label={`${todo.completed ? 'Mở lại' : 'Hoàn thành'}: ${todo.title}`}
        checked={todo.completed}
        onCheckedChange={onToggle}
        className="mt-1 size-4 rounded"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('priority-pill', `priority-${todo.priority}`)}>
            <span className="size-1.5 rounded-full bg-current" />
            {priorityLabel[todo.priority]}
          </span>
          {todo.completed && (
            <span className="text-xs font-medium text-emerald-700">Đã hoàn thành</span>
          )}
          {overdue && <span className="text-xs font-medium text-red-600">Quá hạn</span>}
        </div>
        <h3
          className={cn(
            'mt-2 break-words text-sm leading-6 font-semibold',
            todo.completed && 'text-muted-foreground line-through',
          )}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground">
            {todo.description}
          </p>
        )}
        {todo.dueDate && (
          <div
            className={cn(
              'mt-3 flex items-center gap-1.5 text-xs text-muted-foreground',
              overdue && 'text-red-600',
            )}
          >
            <CalendarDays className="size-3.5" />
            {todo.dueDate.split('-').reverse().join('/')}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={busy}
          aria-label={`Sửa: ${todo.title}`}
          onClick={onEdit}
        >
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={busy}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          aria-label={`Xóa: ${todo.title}`}
          onClick={onDelete}
        >
          <Trash2 />
        </Button>
      </div>
    </article>
  )
}
