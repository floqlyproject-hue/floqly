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
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary ring-1 ring-primary/10">
          4
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">Текст баннера</h3>
          <p className="text-sm text-muted-foreground">Выберите шаблон или напишите свой</p>
        </div>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Шаблон текста</label>
        <div className="space-y-2" role="radiogroup" aria-label="Шаблон текста">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              role="radio"
              aria-checked={selectedTemplate === template.id}
              onClick={() => onTemplateChange(template.id as BannerTemplateId)}
              className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedTemplate === template.id
                  ? 'border-primary/40 bg-primary/[0.04]'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
              }`}
            >
              {/* Radio indicator */}
              <div
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/40 group-hover:border-muted-foreground'
                }`}
              >
                {selectedTemplate === template.id && (
                  <svg className="size-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
            className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selectedTemplate === 'custom'
                ? 'border-primary/40 bg-primary/[0.04]'
                : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
            }`}
          >
            <div
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                selectedTemplate === 'custom'
                  ? 'border-primary bg-primary'
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
        <label htmlFor="banner-text-preview" className="text-sm font-medium text-foreground">
          {selectedTemplate === 'custom' ? 'Ваш текст' : 'Предпросмотр текста'}
        </label>
        {selectedTemplate === 'custom' ? (
          <textarea
            id="banner-text-preview"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            rows={4}
            placeholder="Введите текст баннера…"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <div
            id="banner-text-preview"
            className="min-h-[80px] rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground"
          >
            {previewText || (
              <span className="italic">Заполните информацию о компании, чтобы увидеть текст</span>
            )}
          </div>
        )}
        {selectedTemplate !== 'custom' && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Текст автоматически генерируется на основе ваших данных
          </p>
        )}
      </div>

      {/* Button Text Customization */}
      <div className="space-y-4 border-t border-border/40 pt-6">
        <label className="text-sm font-medium text-foreground">Текст кнопок</label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="btn-accept" className="text-xs font-medium text-muted-foreground">
              Принять
            </label>
            <input
              id="btn-accept"
              type="text"
              value={buttonText.accept}
              onChange={(e) => onButtonTextChange({ ...buttonText, accept: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="btn-decline" className="text-xs font-medium text-muted-foreground">
              Отклонить
            </label>
            <input
              id="btn-decline"
              type="text"
              value={buttonText.decline}
              onChange={(e) => onButtonTextChange({ ...buttonText, decline: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="btn-settings" className="text-xs font-medium text-muted-foreground">
              Настройки
            </label>
            <input
              id="btn-settings"
              type="text"
              value={buttonText.settings}
              onChange={(e) => onButtonTextChange({ ...buttonText, settings: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-all duration-200 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
