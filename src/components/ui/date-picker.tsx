import { useState, type ComponentProps } from 'react'
import { CalendarDays } from 'lucide-react'
import { vi } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DatePicker({
  id,
  value,
  onChange,
  disabled,
  ...triggerProps
}: Pick<ComponentProps<typeof Button>, 'ref' | 'onBlur' | 'aria-invalid' | 'aria-describedby'> & {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(`${value}T00:00:00`) : undefined
  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...triggerProps}
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn('h-10 w-full justify-start font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarDays />
          {selected ? selected.toLocaleDateString('vi-VN') : 'Chọn ngày'}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          locale={vi}
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => {
            onChange(
              date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                : '',
            )
            setOpen(false)
          }}
          autoFocus
        />
        {value && (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
            >
              Bỏ ngày hạn
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
