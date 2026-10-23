import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Todo, TodoInput } from '../types'
import { todoSchema } from '../schema'

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-1.5 text-xs leading-5 text-destructive">
      {message}
    </p>
  ) : null
}
export function TodoForm({
  todo,
  busy,
  confirming,
  onClose,
  onSave,
}: {
  todo: Todo | null
  busy: boolean
  confirming: boolean
  onClose: () => void
  onSave: (values: TodoInput) => void | Promise<void>
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TodoInput>({
    resolver: yupResolver(todoSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      title: todo?.title ?? '',
      description: todo?.description ?? '',
      priority: todo?.priority ?? 'medium',
      dueDate: todo?.dueDate ?? '',
    },
  })
  const title = useWatch({ control, name: 'title' })
  const locked = busy || confirming || isSubmitting
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !locked) onClose()
      }}
    >
      <DialogContent
        showCloseButton={!locked}
        className="max-h-[90dvh] overflow-y-auto rounded-xl p-5 sm:max-w-[440px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          if (locked) e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle className="pr-6 text-base leading-6 font-semibold">
            {todo ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </DialogTitle>
          <DialogDescription className="text-sm leading-5">
            {todo ? 'Cập nhật thông tin công việc.' : 'Nhập thông tin công việc mới.'}
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(onSave)} className="space-y-4">
          <fieldset disabled={locked} className="space-y-4">
            <div>
              <Label htmlFor="title" className="field-label">
                Tên công việc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                autoFocus
                placeholder="Nhập tên công việc"
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : 'title-count'}
                {...register('title')}
              />
              <div className="flex items-start justify-between gap-2">
                <FieldError id="title-error" message={errors.title?.message} />
                <p
                  id="title-count"
                  className="mt-1.5 ml-auto shrink-0 text-xs leading-5 text-muted-foreground"
                >
                  {title.length}/120
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="field-label">
                Mô tả
              </Label>
              <Textarea
                id="description"
                rows={3}
                className="min-h-24 resize-y"
                placeholder="Thêm ghi chú (không bắt buộc)"
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
                {...register('description')}
              />
              <FieldError id="description-error" message={errors.description?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="priority" className="field-label">
                  Độ ưu tiên
                </Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={locked}
                      value={field.value}
                      onValueChange={field.onChange}
                      name={field.name}
                    >
                      <SelectTrigger
                        id="priority"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className="w-full"
                        aria-invalid={!!errors.priority}
                        aria-describedby={errors.priority ? 'priority-error' : undefined}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="low">Thấp</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError id="priority-error" message={errors.priority?.message} />
              </div>
              <div>
                <Label htmlFor="dueDate" className="field-label">
                  Hạn hoàn thành
                </Label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="dueDate"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      disabled={locked}
                      value={field.value}
                      onChange={field.onChange}
                      aria-invalid={!!errors.dueDate}
                      aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
                    />
                  )}
                />
                <FieldError id="dueDate-error" message={errors.dueDate?.message} />
              </div>
            </div>
          </fieldset>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={locked}
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button className="h-10" disabled={locked} type="submit">
              {busy && <Loader2 className="animate-spin" />}
              {todo ? 'Lưu thay đổi' : 'Tạo công việc'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
