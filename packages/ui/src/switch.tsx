'use client'

import { cn } from './utils'

interface SwitchProps {
  /** Включён ли переключатель */
  checked?: boolean
  /** Значение по умолчанию */
  defaultChecked?: boolean
  /** Callback при изменении */
  onCheckedChange?: (checked: boolean) => void
  /** Отключён ли */
  disabled?: boolean
  /** Дополнительные классы */
  className?: string
  /** ID для связи с label */
  id?: string
  /** Имя для форм */
  name?: string
}

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  id,
  name,
}: SwitchProps) {
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked)
  }

  return (
    <label
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        onChange={handleChange}
        disabled={disabled}
        className="peer sr-only"
        role="switch"
        aria-checked={isChecked}
      />
      <span
        className={cn(
          'pointer-events-none block h-5 w-10 rounded-full bg-input transition-colors peer-checked:bg-primary'
        )}
      />
      <span
        className={cn(
          'pointer-events-none absolute left-0.5 block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform peer-checked:translate-x-4'
        )}
      />
    </label>
  )
}
