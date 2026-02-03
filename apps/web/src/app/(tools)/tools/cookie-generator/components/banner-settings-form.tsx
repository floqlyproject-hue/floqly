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
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="5" y="15" width="14" height="4" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    value: 'top',
    label: 'Сверху',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="5" y="5" width="14" height="4" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    value: 'floating',
    label: 'Плавающая',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="6" y="14" width="12" height="6" rx="1.5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    value: 'corner',
    label: 'В углу',
    icon: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="12" y="13" width="8" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
]

const COLOR_SCHEMES: { value: ColorScheme; label: string; preview: string }[] = [
  { value: 'light', label: 'Светлая', preview: 'bg-white border-zinc-200' },
  { value: 'dark', label: 'Тёмная', preview: 'bg-zinc-900 border-zinc-700' },
  { value: 'brand', label: 'Брендовая', preview: 'bg-primary border-primary' },
]

export function BannerSettingsForm({ data, onChange }: BannerSettingsFormProps) {
  const handleChange = <K extends keyof BannerSettings>(
    field: K,
    value: BannerSettings[K]
  ) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          3
        </div>
        Внешний вид
      </div>

      <div className="space-y-5 rounded-lg border border-border bg-card/50 p-4">
        {/* Position */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Позиция баннера
          </label>
          <div className="grid grid-cols-4 gap-2">
            {POSITIONS.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('position', value)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-xs transition-colors ${
                  data.position === value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Цветовая схема
          </label>
          <div className="flex gap-2">
            {COLOR_SCHEMES.map(({ value, label, preview }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('colorScheme', value)}
                className={`group flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors ${
                  data.colorScheme === value
                    ? 'border-primary'
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div
                  className={`size-8 rounded-md border ${preview}`}
                />
                <span className={`text-xs ${
                  data.colorScheme === value ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Кнопки
          </label>

          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <div>
              <div className="text-sm text-foreground">Кнопка «Отклонить»</div>
              <div className="text-xs text-muted-foreground">
                Позволяет отказаться от cookie
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('showDeclineButton', !data.showDeclineButton)}
              className={`relative h-5 w-9 rounded-full transition-colors ${
                data.showDeclineButton ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`absolute top-0.5 block size-4 rounded-full bg-white shadow-sm transition-transform ${
                  data.showDeclineButton ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <div>
              <div className="text-sm text-foreground">Кнопка «Настройки»</div>
              <div className="text-xs text-muted-foreground">
                Детальный выбор типов cookie
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('showSettingsButton', !data.showSettingsButton)}
              className={`relative h-5 w-9 rounded-full transition-colors ${
                data.showSettingsButton ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`absolute top-0.5 block size-4 rounded-full bg-white shadow-sm transition-transform ${
                  data.showSettingsButton ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Effects */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Эффекты
          </label>

          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
            <div>
              <div className="text-sm text-foreground">Размытие фона</div>
              <div className="text-xs text-muted-foreground">
                Backdrop blur под баннером
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange('backdropBlur', !data.backdropBlur)}
              className={`relative h-5 w-9 rounded-full transition-colors ${
                data.backdropBlur ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`absolute top-0.5 block size-4 rounded-full bg-white shadow-sm transition-transform ${
                  data.backdropBlur ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-foreground">
              Анимация появления
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['none', 'slide', 'fade'] as const).map((anim) => (
                <button
                  key={anim}
                  type="button"
                  onClick={() => handleChange('animation', anim)}
                  className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
                    data.animation === anim
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {anim === 'none' && 'Без анимации'}
                  {anim === 'slide' && 'Выезд'}
                  {anim === 'fade' && 'Появление'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hide days */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Срок скрытия после принятия (дней)
          </label>
          <input
            type="number"
            value={data.hideAfterDays}
            onChange={(e) => handleChange('hideAfterDays', parseInt(e.target.value) || 365)}
            min={1}
            max={365}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Через сколько дней баннер появится снова
          </p>
        </div>
      </div>
    </div>
  )
}
