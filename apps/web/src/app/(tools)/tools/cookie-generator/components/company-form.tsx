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
    <div className="space-y-7">
      {/* Section Header */}
      <div>
        <h3 className="text-[15px] font-medium text-foreground">О вашем сайте</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          На основе этих данных мы составим документ политики cookie
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Company Name */}
        <fieldset>
          <label htmlFor="company-name" className="mb-1.5 block text-[13px] font-medium text-foreground">
            Название компании или сайта
          </label>
          <input
            id="company-name"
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ООО «Компания» или Мой сайт"
            autoComplete="organization"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors duration-150 placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
          <p className="mt-1.5 text-[12px] text-muted-foreground/70">
            Указывается в баннере и документе как оператор, обрабатывающий данные
          </p>
        </fieldset>

        {/* Website Domain */}
        <fieldset>
          <label htmlFor="company-website" className="mb-1.5 block text-[13px] font-medium text-foreground">
            Домен вашего сайта
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] text-muted-foreground/40">
              https://
            </span>
            <input
              id="company-website"
              type="text"
              value={data.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="example.ru"
              autoComplete="url"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-[4.25rem] pr-3.5 text-sm text-foreground transition-colors duration-150 placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
            />
          </div>
        </fieldset>

        {/* Email */}
        <fieldset>
          <label htmlFor="company-email" className="mb-1.5 block text-[13px] font-medium text-foreground">
            Контактный email
          </label>
          <input
            id="company-email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="privacy@example.ru"
            autoComplete="email"
            spellCheck={false}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors duration-150 placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
          <div className="mt-2 flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground/70">
            <svg className="mt-0.5 size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p>
              Попадёт в документ — по нему посетители смогут обратиться с вопросами о cookie. <span className="text-foreground/50">Мы не используем его для рассылок.</span>
            </p>
          </div>
        </fieldset>

        {/* Privacy Policy URL */}
        <fieldset>
          <label htmlFor="privacy-url" className="mb-1.5 flex items-center gap-2 text-[13px] font-medium text-foreground">
            Политика конфиденциальности
            <InfoTooltip />
          </label>
          <input
            id="privacy-url"
            type="url"
            value={data.privacyPolicyUrl}
            onChange={(e) => handleChange('privacyPolicyUrl', e.target.value)}
            placeholder="https://example.ru/privacy"
            autoComplete="url"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors duration-150 placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
          <p className="mt-1.5 text-[12px] text-muted-foreground/70">
            Если есть — в баннере появится ссылка «Подробнее»
          </p>
        </fieldset>
      </div>
    </div>
  )
}

function InfoTooltip() {
  return (
    <span className="group/tip relative inline-flex">
      <button
        type="button"
        className="flex size-4 cursor-help items-center justify-center rounded-full border border-border text-[9px] font-bold leading-none text-muted-foreground/60 transition-colors duration-150 hover:border-foreground/20 hover:text-foreground/60 focus:border-foreground/20 focus:text-foreground/60 focus:outline-none"
        aria-label="Подробнее о политике конфиденциальности"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-[260px] -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-[12px] font-normal leading-relaxed text-zinc-300 opacity-0 shadow-xl transition-all duration-150 group-hover/tip:pointer-events-auto group-hover/tip:opacity-100 group-focus-within/tip:pointer-events-auto group-focus-within/tip:opacity-100"
      >
        <p className="mb-1 font-medium text-zinc-100">Зачем это нужно?</p>
        <p>
          По закону (152-ФЗ) рекомендуется размещать политику конфиденциальности.
          Если укажете ссылку — добавим в баннер. Если нет — сгенерируем документ на следующем шаге.
        </p>
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-zinc-900" />
      </span>
    </span>
  )
}
