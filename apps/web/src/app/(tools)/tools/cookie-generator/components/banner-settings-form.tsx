'use client'

import type { BannerSettings, BannerPosition, ColorScheme } from '../types'

interface BannerSettingsFormProps {
  data: BannerSettings
  onChange: (data: BannerSettings) => void
}

const POSITIONS: { value: BannerPosition; label: string; icon: React.ReactNode }[] = [
  {
    value: 'bottom',
    label: 'Снизу',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <rect x="5" y="15" width="14" height="4" rx="1.5" fill="currentColor" opacity="0.2" stroke="none" />
      </svg>
    ),
  },
  {
    value: 'top',
    label: 'Сверху',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <rect x="5" y="5" width="14" height="4" rx="1.5" fill="currentColor" opacity="0.2" stroke="none" />
      </svg>
    ),
  },
  {
    value: 'floating',
    label: 'Плавающая',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <rect x="6" y="13" width="12" height="6" rx="2" fill="currentColor" opacity="0.2" stroke="none" />
      </svg>
    ),
  },
  {
    value: 'corner',
    label: 'В углу',
    icon: (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <rect x="12" y="12" width="8" height="8" rx="2" fill="currentColor" opacity="0.2" stroke="none" />
      </svg>
    ),
  },
]

const COLOR_SCHEMES: { value: ColorScheme; label: string; colors: string[] }[] = [
  { value: 'light', label: 'Светлая', colors: ['#ffffff', '#f4f4f5', '#e4e4e7'] },
  { value: 'dark', label: 'Тёмная', colors: ['#18181b', '#27272a', '#3f3f46'] },
  { value: 'brand', label: 'Брендовая', colors: ['hsl(var(--primary))', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary) / 0.6)'] },
]

const ANIMATIONS = [
  { value: 'none', label: 'Без анимации', icon: '—' },
  { value: 'slide', label: 'Выезд', icon: '↑' },
  { value: 'fade', label: 'Появление', icon: '◐' },
] as const

export function BannerSettingsForm({ data, onChange }: BannerSettingsFormProps) {
  const handleChange = <K extends keyof BannerSettings>(
    field: K,
    value: BannerSettings[K]
  ) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-[15px] font-medium text-foreground">Внешний вид</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">Настройте дизайн баннера</p>
      </div>

      {/* Position Selection */}
      <div className="space-y-3">
        <label className="text-[13px] font-medium text-foreground">Позиция баннера</label>
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Позиция баннера">
          {POSITIONS.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={data.position === value}
              onClick={() => handleChange('position', value)}
              className={`group flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                data.position === value
                  ? 'border-foreground/30 bg-foreground/[0.03] text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-border hover:text-foreground'
              }`}
            >
              {icon}
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-3">
        <label className="text-[13px] font-medium text-foreground">Цветовая схема</label>
        <div className="flex gap-3" role="radiogroup" aria-label="Цветовая схема">
          {COLOR_SCHEMES.map(({ value, label, colors }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={data.colorScheme === value}
              onClick={() => handleChange('colorScheme', value)}
              className={`group flex flex-col items-center gap-2.5 rounded-lg border p-3 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                data.colorScheme === value
                  ? 'border-foreground/30 bg-foreground/[0.03]'
                  : 'border-border bg-card hover:border-border'
              }`}
            >
              <div className="flex -space-x-1.5">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="size-6 rounded-full border border-border"
                    style={{ backgroundColor: color, zIndex: 3 - i }}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${data.colorScheme === value ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="space-y-3">
        <label className="text-[13px] font-medium text-foreground">Кнопки</label>
        <div className="space-y-2">
          <ToggleOption
            checked={data.showDeclineButton}
            onChange={() => handleChange('showDeclineButton', !data.showDeclineButton)}
            title="Кнопка «Отклонить»"
            description="Позволяет отказаться от cookie"
          />
          <ToggleOption
            checked={data.showSettingsButton}
            onChange={() => handleChange('showSettingsButton', !data.showSettingsButton)}
            title="Кнопка «Настройки»"
            description="Детальный выбор типов cookie"
          />
        </div>
      </div>

      {/* Effects Section */}
      <div className="space-y-3">
        <label className="text-[13px] font-medium text-foreground">Эффекты</label>
        <div className="space-y-2">
          <ToggleOption
            checked={data.backdropBlur}
            onChange={() => handleChange('backdropBlur', !data.backdropBlur)}
            title="Размытие фона"
            description="Backdrop blur под баннером"
          />
        </div>

        {/* Animation Selection */}
        <div className="pt-2">
          <label className="mb-2.5 block text-[13px] text-foreground">Анимация появления</label>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Анимация появления">
            {ANIMATIONS.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={data.animation === value}
                onClick={() => handleChange('animation', value)}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  data.animation === value
                    ? 'border-foreground/30 bg-foreground/[0.03] text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <span className="text-sm opacity-60">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hide Days */}
      <div className="space-y-2">
        <label htmlFor="hide-days" className="text-[13px] font-medium text-foreground">
          Срок скрытия после принятия
        </label>
        <div className="relative">
          <input
            id="hide-days"
            type="number"
            value={data.hideAfterDays}
            onChange={(e) => handleChange('hideAfterDays', parseInt(e.target.value) || 365)}
            min={1}
            max={365}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-16 text-[13px] tabular-nums text-foreground transition-colors duration-150 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
            дней
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Через сколько дней баннер появится снова после принятия
        </p>
      </div>
    </div>
  )
}

interface ToggleOptionProps {
  checked: boolean
  onChange: () => void
  title: string
  description: string
}

function ToggleOption({ checked, onChange, title, description }: ToggleOptionProps) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors duration-150 ${
        checked
          ? 'border-foreground/30 bg-foreground/[0.03]'
          : 'border-border bg-card hover:border-border'
      }`}
      onClick={onChange}
    >
      <div className="space-y-0.5">
        <div className="text-[13px] font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={(e) => {
          e.stopPropagation()
          onChange()
        }}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          checked ? 'bg-foreground' : 'bg-input'
        }`}
      >
        <span
          className={`absolute top-0.5 block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
