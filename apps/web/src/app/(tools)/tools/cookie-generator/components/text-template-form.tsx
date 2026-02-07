'use client'

import { BANNER_TEMPLATES, type BannerTemplateId, generateFromTemplate } from '../templates'
import type { CookieConfig } from '../types'

type TemplateSelection = BannerTemplateId | 'custom'

interface TextTemplateFormProps {
  selectedTemplate: TemplateSelection
  onTemplateChange: (id: TemplateSelection) => void
  customText: string
  onCustomTextChange: (text: string) => void
  config: CookieConfig
  buttonText: CookieConfig['buttonText']
  onButtonTextChange: (buttonText: CookieConfig['buttonText']) => void
}

const TEMPLATE_ICONS: Record<string, string> = {
  standard: '📝',
  friendly: '👋',
  minimal: '✨',
  legal: '⚖️',
  custom: '🎨',
}

export function TextTemplateForm({
  selectedTemplate,
  onTemplateChange,
  customText,
  onCustomTextChange,
  config,
  buttonText,
  onButtonTextChange,
}: TextTemplateFormProps) {
  const templates = Object.values(BANNER_TEMPLATES)
  const previewText = selectedTemplate === 'custom'
    ? customText
    : generateFromTemplate(selectedTemplate, config)

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">Текст баннера</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">Выберите шаблон или напишите свой</p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <label className="text-[13px] font-medium text-foreground">Шаблон текста</label>
        <div className="space-y-2" role="radiogroup" aria-label="Шаблон текста">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              role="radio"
              aria-checked={selectedTemplate === template.id}
              onClick={() => onTemplateChange(template.id as BannerTemplateId)}
              className={`group flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedTemplate === template.id
                  ? 'border-foreground/30 bg-foreground/[0.03]'
                  : 'border-border bg-card hover:border-border'
              }`}
            >
              {/* Radio indicator */}
              <div
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-foreground bg-foreground'
                    : 'border-muted-foreground/40 group-hover:border-muted-foreground'
                }`}
              >
                {selectedTemplate === template.id && (
                  <svg className="size-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{TEMPLATE_ICONS[template.id] || '📝'}</span>
                  <span className="text-sm font-medium text-foreground">{template.name}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{template.description}</p>
              </div>
            </button>
          ))}

          {/* Custom option */}
          <button
            type="button"
            role="radio"
            aria-checked={selectedTemplate === 'custom'}
            onClick={() => onTemplateChange('custom')}
            className={`group flex w-full items-start gap-4 rounded-lg border p-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedTemplate === 'custom'
                ? 'border-foreground/30 bg-foreground/[0.03]'
                : 'border-border bg-card hover:border-border'
            }`}
          >
            <div
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                selectedTemplate === 'custom'
                  ? 'border-foreground bg-foreground'
                  : 'border-muted-foreground/40 group-hover:border-muted-foreground'
              }`}
            >
              {selectedTemplate === 'custom' && (
                <svg className="size-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{TEMPLATE_ICONS.custom}</span>
                <span className="text-sm font-medium text-foreground">Свой текст</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">Напишите собственный текст баннера</p>
            </div>
          </button>
        </div>
      </div>

      {/* Preview / Custom Input */}
      <div className="space-y-2">
        <label htmlFor="banner-text-preview" className="mb-2 block text-[13px] font-medium text-foreground">
          {selectedTemplate === 'custom' ? 'Ваш текст' : 'Предпросмотр текста'}
        </label>
        {selectedTemplate === 'custom' ? (
          <textarea
            id="banner-text-preview"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            rows={4}
            placeholder="Введите текст баннера…"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-[15px] leading-relaxed text-foreground transition-colors duration-150 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        ) : (
          <div
            id="banner-text-preview"
            className="min-h-[80px] rounded-lg border border-dashed border-border bg-background p-4 text-[13px] leading-relaxed text-muted-foreground"
          >
            {previewText || (
              <span className="italic">Заполните информацию о компании, чтобы увидеть текст</span>
            )}
          </div>
        )}
        {selectedTemplate !== 'custom' && (
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            Текст автоматически генерируется на основе ваших данных
          </p>
        )}
      </div>

      {/* Button Text Customization */}
      <div className="space-y-4 border-t border-border pt-6">
        <label className="text-[13px] font-medium text-foreground">Текст кнопок</label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="btn-accept" className="mb-2 block text-[12px] font-medium text-muted-foreground">
              Принять
            </label>
            <input
              id="btn-accept"
              type="text"
              value={buttonText.accept}
              onChange={(e) => onButtonTextChange({ ...buttonText, accept: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-[15px] text-foreground transition-colors duration-150 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="btn-decline" className="mb-2 block text-[12px] font-medium text-muted-foreground">
              Отклонить
            </label>
            <input
              id="btn-decline"
              type="text"
              value={buttonText.decline}
              onChange={(e) => onButtonTextChange({ ...buttonText, decline: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-[15px] text-foreground transition-colors duration-150 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="btn-settings" className="mb-2 block text-[12px] font-medium text-muted-foreground">
              Настройки
            </label>
            <input
              id="btn-settings"
              type="text"
              value={buttonText.settings}
              onChange={(e) => onButtonTextChange({ ...buttonText, settings: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-[15px] text-foreground transition-colors duration-150 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
