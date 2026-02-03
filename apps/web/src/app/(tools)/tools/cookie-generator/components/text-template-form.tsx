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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          4
        </div>
        Текст баннера
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card/50 p-4">
        {/* Template Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Шаблон текста
          </label>
          <div className="grid gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onTemplateChange(template.id as BannerTemplateId)}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div
                  className={`mt-0.5 size-4 shrink-0 rounded-full border-2 ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {selectedTemplate === template.id && (
                    <svg className="size-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {template.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {template.description}
                  </div>
                </div>
              </button>
            ))}

            {/* Custom option */}
            <button
              type="button"
              onClick={() => onTemplateChange('custom')}
              className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                selectedTemplate === 'custom'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
            >
              <div
                className={`mt-0.5 size-4 shrink-0 rounded-full border-2 ${
                  selectedTemplate === 'custom'
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                }`}
              >
                {selectedTemplate === 'custom' && (
                  <svg className="size-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  Свой текст
                </div>
                <div className="text-xs text-muted-foreground">
                  Напишите собственный текст
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Preview / Custom Input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {selectedTemplate === 'custom' ? 'Ваш текст' : 'Предпросмотр текста'}
          </label>
          {selectedTemplate === 'custom' ? (
            <textarea
              value={customText}
              onChange={(e) => onCustomTextChange(e.target.value)}
              rows={4}
              placeholder="Введите текст баннера..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              {previewText || 'Заполните информацию о компании, чтобы увидеть текст'}
            </div>
          )}

          {selectedTemplate !== 'custom' && (
            <p className="mt-1 text-xs text-muted-foreground">
              Текст автоматически генерируется на основе ваших данных
            </p>
          )}
        </div>

        {/* Button Text Customization */}
        <div className="border-t border-border pt-4">
          <label className="mb-3 block text-sm font-medium text-foreground">
            Текст кнопок
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Принять
              </label>
              <input
                type="text"
                value={buttonText.accept}
                onChange={(e) =>
                  onButtonTextChange({ ...buttonText, accept: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Отклонить
              </label>
              <input
                type="text"
                value={buttonText.decline}
                onChange={(e) =>
                  onButtonTextChange({ ...buttonText, decline: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Настройки
              </label>
              <input
                type="text"
                value={buttonText.settings}
                onChange={(e) =>
                  onButtonTextChange({ ...buttonText, settings: e.target.value })
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
