'use client'

import { Building2, Globe, Mail, Loader2, CheckCircle2 } from 'lucide-react'
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
      <div className="mb-10 max-w-lg">
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">О вашем сайте</h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground/70">
          На основе этих данных мы составим документ политики cookie
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-lg space-y-7">
        {/* Company Name */}
        <div>
          <label htmlFor="company-name" className="mb-3 flex items-center gap-2 text-[13px] font-medium text-foreground">
            <Building2 className="size-3.5 text-muted-foreground/50" strokeWidth={1.5} />
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
        <div className="space-y-7">
          {/* Website Domain */}
          <div>
            <label htmlFor="company-website" className="mb-3 flex items-center gap-2 text-[13px] font-medium text-foreground">
              <Globe className="size-3.5 text-muted-foreground/50" strokeWidth={1.5} />
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

            {/* Parser Status — card style */}
            {isParserLoading && (
              <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 px-3.5 py-2.5">
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" strokeWidth={2} />
                <span className="text-[13px] text-muted-foreground">Анализирую скрипты на вашем сайте…</span>
              </div>
            )}

            {!isParserLoading && parserData && parserData.detected.length > 0 && (
              <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-emerald-200/50 bg-emerald-50/50 px-3.5 py-2.5 dark:border-emerald-800/30 dark:bg-emerald-950/20">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                <span className="text-[13px] text-emerald-700 dark:text-emerald-300">
                  Найдено сервисов: {parserData.detected.length}
                  {parserData.chatWidgets.length > 0 && ` · ${parserData.chatWidgets.length} виджет(ов)`}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="company-email" className="mb-3 flex items-center gap-2 text-[13px] font-medium text-foreground">
              <Mail className="size-3.5 text-muted-foreground/50" strokeWidth={1.5} />
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
