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
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary ring-1 ring-primary/10">
          1
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">Информация о компании</h3>
          <p className="text-sm text-muted-foreground">Базовые данные для текста баннера</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Company Name - Required */}
        <div className="group">
          <label htmlFor="company-name" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            Название компании/сайта
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              Обязательно
            </span>
          </label>
          <input
            id="company-name"
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ООО «Компания» или Мой сайт…"
            autoComplete="organization"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Будет использоваться в тексте баннера и документе политики
          </p>
        </div>

        {/* Website Domain */}
        <div className="group">
          <label htmlFor="company-website" className="mb-2 block text-sm font-medium text-foreground">
            Домен сайта
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/60">
              https://
            </span>
            <input
              id="company-website"
              type="text"
              value={data.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="example.ru"
              autoComplete="url"
              className="w-full rounded-xl border border-input bg-background py-3 pl-[4.5rem] pr-4 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Email */}
        <div className="group">
          <label htmlFor="company-email" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            Email для связи
            <span className="text-xs font-normal text-muted-foreground">опционально</span>
          </label>
          <input
            id="company-email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="privacy@example.ru"
            autoComplete="email"
            spellCheck={false}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Privacy Policy URL */}
        <div className="group">
          <label htmlFor="privacy-url" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            Ссылка на политику конфиденциальности
            <span className="text-xs font-normal text-muted-foreground">опционально</span>
          </label>
          <input
            id="privacy-url"
            type="url"
            value={data.privacyPolicyUrl}
            onChange={(e) => handleChange('privacyPolicyUrl', e.target.value)}
            placeholder="https://example.ru/privacy"
            autoComplete="url"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Если есть — появится ссылка в баннере
          </p>
        </div>
      </div>
    </div>
  )
}
