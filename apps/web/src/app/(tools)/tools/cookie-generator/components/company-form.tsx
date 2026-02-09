'use client'

import type { CompanyInfo } from '../types'
import type { ParserResult } from '@/lib/parser/types'

interface CompanyFormProps {
  data: CompanyInfo
  onChange: (data: CompanyInfo) => void
  isParserLoading?: boolean
  parserData?: ParserResult | null
}

export function CompanyForm({ data, onChange, isParserLoading, parserData }: CompanyFormProps) {
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mb-12 max-w-lg">
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">О вашем сайте</h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground/70">
          На основе этих данных мы составим документ политики cookie
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-lg space-y-8">
        {/* Company Name */}
        <div>
          <label htmlFor="company-name" className="mb-3 block text-[13px] font-medium text-foreground">
            Название компании или сайта
          </label>
          <input
            id="company-name"
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ООО «Компания» или example.ru…"
            autoComplete="organization"
            className="w-full border-b border-border bg-transparent px-0 py-3 text-[15px] text-foreground transition-colors duration-200 placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
          />
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
            Указывается в баннере и документе как оператор, обрабатывающий данные
          </p>
        </div>

        {/* Website Domain + Email — related fields */}
        <div className="space-y-6">
          {/* Website Domain */}
          <div>
            <label htmlFor="company-website" className="mb-3 block text-[13px] font-medium text-foreground">
              Домен вашего сайта
            </label>
            <div className="flex items-center border-b border-border transition-colors duration-200 focus-within:border-foreground/40">
              <span className="select-none pr-1 font-mono text-[13px] text-muted-foreground/35">
                https://
              </span>
              <input
                id="company-website"
                type="text"
                inputMode="url"
                value={data.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="example.ru…"
                autoComplete="url"
                className="w-full bg-transparent py-3 text-[15px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </div>

            {/* Parser Status Indicator */}
            {isParserLoading && (
              <div className="mt-2.5 flex items-center gap-2 text-[13px] text-muted-foreground">
                <svg
                  className="size-3 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Анализирую скрипты на вашем сайте…</span>
              </div>
            )}

            {/* Parser Success Indicator */}
            {!isParserLoading && parserData && parserData.detected.length > 0 && (
              <div className="mt-2.5 flex items-center gap-2 text-[13px] text-success">
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Найдено сервисов: {parserData.detected.length}
                  {parserData.chatWidgets.length > 0 && ` · ${parserData.chatWidgets.length} виджет(ов)`}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="company-email" className="mb-3 block text-[13px] font-medium text-foreground">
              Контактный email
            </label>
            <input
              id="company-email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="privacy@example.ru…"
              autoComplete="email"
              spellCheck={false}
              className="w-full border-b border-border bg-transparent px-0 py-3 text-[15px] text-foreground transition-colors duration-200 placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
            />
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
              Попадёт в документ — по нему посетители смогут обратиться с вопросами о cookie. Мы не используем его для рассылок.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
