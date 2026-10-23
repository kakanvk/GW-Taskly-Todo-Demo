import { Loader2, ShieldCheck, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import type { PendingAction } from '../types'
export function ConfirmDialog({
  action,
  busy,
  onCancel,
  onConfirm,
}: {
  action: PendingAction | null
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const title =
    action?.type === 'delete'
      ? 'Xóa công việc này?'
      : action?.type === 'update'
        ? 'Lưu thay đổi?'
        : action?.todo.completed
          ? 'Mở lại công việc?'
          : 'Đánh dấu hoàn thành?'
  return (
    <AlertDialog
      open={!!action}
      onOpenChange={(open) => {
        if (!open && !busy) onCancel()
      }}
    >
      <AlertDialogContent
        className="max-h-[85dvh] max-w-[min(360px,calc(100%-2rem))] gap-4 overflow-y-auto rounded-xl p-5 sm:max-w-[360px]"
        onEscapeKeyDown={(e) => {
          if (busy) e.preventDefault()
        }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${action?.type === 'delete' ? 'bg-red-50 text-red-600' : 'bg-violet-50 text-violet-600'}`}
          >
            {action?.type === 'delete' ? (
              <Trash2 className="size-4" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
          </span>
          <AlertDialogTitle className="text-base font-semibold">{title}</AlertDialogTitle>
        </div>
        <AlertDialogDescription className="break-words text-sm leading-5 text-muted-foreground">
          {action?.type === 'update'
            ? `Cập nhật “${action.values.title}”.`
            : `“${action?.todo.title ?? ''}”`}
          {action?.type === 'delete' && ' sẽ bị xóa vĩnh viễn.'}
          {action?.type === 'toggle' &&
            (action.todo.completed
              ? ' sẽ chuyển về đang thực hiện.'
              : ' sẽ được đánh dấu hoàn thành.')}
        </AlertDialogDescription>
        <AlertDialogFooter className="flex-row justify-end gap-2">
          <AlertDialogCancel size="sm" disabled={busy} onClick={onCancel}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            size="sm"
            variant={action?.type === 'delete' ? 'destructive' : 'default'}
            disabled={busy}
            onClick={(event) => {
              event.preventDefault()
              onConfirm()
            }}
          >
            {busy && <Loader2 className="animate-spin" />}
            {busy ? 'Đang xử lý…' : 'Xác nhận'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
