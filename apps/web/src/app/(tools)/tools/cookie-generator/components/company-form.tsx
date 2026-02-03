'use client'

import type { CompanyInfo } from '../types'

interface CompanyFormProps {
  data: CompanyInfo
  onChange: (data: CompanyInfo) => void
}

export function CompanyForm({ data, onChange }: CompanyFormProps) {
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          1
        </div>
        Информация о компании
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card/50 p-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Название компании/сайта
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ООО «Компания» или Мой сайт"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Будет использоваться в тексте баннера
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Домен сайта
          </label>
          <input
            type="text"
            value={data.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="example.ru"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Email для связи
            <span className="ml-1 text-xs text-muted-foreground">(опционально)</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="privacy@example.ru"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Ссылка на политику конфиденциальности
            <span className="ml-1 text-xs text-muted-foreground">(опционально)</span>
          </label>
          <input
            type="url"
            value={data.privacyPolicyUrl}
            onChange={(e) => handleChange('privacyPolicyUrl', e.target.value)}
            placeholder="https://example.ru/privacy"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  )
}
