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
          <h3 className="text-base font-medium text-foreground">О вашем сайте</h3>
          <p className="text-sm text-muted-foreground">На основе этих данных мы составим документ политики cookie</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Company Name - Required */}
        <div className="group">
          <label htmlFor="company-name" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            Название компании или сайта
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              Обязательно
            </span>
          </label>
          <input
            id="company-name"
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ООО «Компания» или Мой сайт"
            autoComplete="organization"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Указывается в баннере и документе как оператор, обрабатывающий данные
          </p>
        </div>

        {/* Website Domain */}
        <div className="group">
          <label htmlFor="company-website" className="mb-2 block text-sm font-medium text-foreground">
            Домен вашего сайта
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
            Контактный email
            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Рекомендуется
            </span>
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
          {/* Trust explanation block */}
          <div className="mt-2.5 flex items-start gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
            <svg className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Попадёт в документ — по нему посетители вашего сайта смогут обратиться с вопросами о cookie и персональных данных. <span className="font-medium text-foreground/70">Мы не используем его для рассылок.</span>
            </p>
          </div>
        </div>

        {/* Privacy Policy URL */}
        <div className="group">
          <label htmlFor="privacy-url" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
            Политика конфиденциальности
            {/* Info tooltip */}
            <InfoTooltip />
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
            Если есть — в баннере появится ссылка «Подробнее»
          </p>
        </div>
      </div>
    </div>
  )
}

function InfoTooltip() {
  return (
    <span className="group/tip relative inline-flex">
      <button
        type="button"
        className="flex size-[18px] cursor-help items-center justify-center rounded-full bg-muted/80 text-[10px] font-bold leading-none text-muted-foreground transition-colors duration-150 hover:bg-primary/15 hover:text-primary focus:bg-primary/15 focus:text-primary focus:outline-none"
        aria-label="Подробнее о политике конфиденциальности"
      >
        !
      </button>
      {/* Tooltip popup — dark bg for max readability */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2.5 w-[280px] -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-3 text-xs font-normal leading-relaxed text-zinc-200 opacity-0 shadow-2xl transition-all duration-200 group-hover/tip:pointer-events-auto group-hover/tip:opacity-100 group-focus-within/tip:pointer-events-auto group-focus-within/tip:opacity-100"
      >
        <span className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-white">
          <svg className="size-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          Зачем это нужно?
        </span>
        <p className="mb-1.5 text-zinc-300">
          По закону (152-ФЗ) на сайте рекомендуется размещать политику конфиденциальности.
        </p>
        <p className="text-zinc-300">
          Если укажете ссылку — добавим её в баннер. Если такой страницы пока нет — не переживайте, мы сгенерируем готовый документ на последнем шаге.
        </p>
        {/* Arrow */}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-zinc-900" />
      </span>
    </span>
  )
}
