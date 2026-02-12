'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Copy, Check, ChevronRight, Code2, Globe, LayoutTemplate, Building2, HelpCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import type { BannerCustomization } from './liquid-glass-island'
import type { CookieConfig } from '../types'
import type { CookiePolicyData } from '@/lib/templates/cookie-policy'
import { generateEmbedCode, countCodeLines } from '../lib/generate-embed-code'

/* ── Props ── */

interface ResultStepProps {
  config: CookieConfig
  cookiePolicyData: Partial<CookiePolicyData>
  bannerCustomization: BannerCustomization
}

/* ── Hooks ── */

/** Отслеживает попадание элемента во viewport (однократно) */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect() // один раз за сессию
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

/** Анимация числа от 0 до target. Запускается только когда started=true */
function useCountUp(target: number, started: boolean, duration = 800) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!started) return

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo: быстро разгоняется, плавно тормозит
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(eased * target)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, started])

  return value
}

/* ── Component ── */

export function ResultStep({
  config,
  cookiePolicyData,
  bannerCustomization,
}: ResultStepProps) {
  const [copied, setCopied] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)

  // Generate embed code from all settings
  const embedCode = useMemo(
    () => generateEmbedCode({ config, customization: bannerCustomization }),
    [config, bannerCustomization],
  )

  const lineCount = useMemo(() => countCodeLines(embedCode), [embedCode])
  const { ref: mockupRef, inView: mockupInView } = useInView(0.3)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [embedCode])

  return (
    <div>
      {/* A. Step Header */}
      <div className="mb-6 max-w-lg">
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">
          Ваш баннер готов
        </h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground/70">
          Установите код на сайт — или управляйте баннером из личного кабинета
        </p>
      </div>

      {/* B. Success Indicator */}
      <div className="mb-8 flex items-center gap-2">
        <span className="success-enter flex size-5 items-center justify-center rounded-full bg-emerald-500/10">
          <span className="size-1.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[13px] text-muted-foreground">
          Баннер cookie и политика конфиденциальности сгенерированы
        </span>
      </div>

      {/* C + E. Two-column layout: Dashboard Card (left) | Code + Instructions (right) */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* LEFT — Dashboard Upsell Card */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="p-6">
            <h4 className="text-[18px] font-semibold tracking-tight text-foreground">
              Управляйте баннером из&nbsp;личного кабинета
            </h4>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground/70">
              Не нужно менять код на сайте — настраивайте всё в одном месте
            </p>

            {/* Benefits List */}
            <div className="mt-5 space-y-3">
              <BenefitItem
                title="Короткий код"
                subtitle={`2 строки вместо ~${lineCount}`}
                detail="CDN-скрипт, не тормозит сайт"
              />
              <BenefitItem
                title="Обновления мгновенно"
                detail="Измените дизайн в ЛК — обновится на сайте сразу"
              />
              <BenefitItem
                title="Аналитика бесплатно"
                detail="Показы, согласия, отказы — без Google Analytics"
              />
              <BenefitItem
                title="Все инструменты Floqly"
                detail="Генератор соглашений и другие — бесплатно"
              />
            </div>

            {/* Mini Dashboard Mockup — styled as a "window preview" */}
            <div ref={mockupRef} className="mt-6 select-none overflow-hidden rounded-xl border border-border bg-muted/20">
              {/* Window title bar */}
              <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-muted-foreground/15" />
                  <span className="size-2 rounded-full bg-muted-foreground/15" />
                  <span className="size-2 rounded-full bg-muted-foreground/15" />
                </span>
                <span className="ml-1 text-[10px] font-medium text-muted-foreground/40">
                  Личный кабинет {config.company.name || 'Floqly'}
                </span>
              </div>

              {/* Window content */}
              <TooltipProvider delayDuration={300}>
                <div className="p-4">
                  {/* CDN Code Preview */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help rounded-lg border border-border bg-background p-3 transition-colors duration-150 hover:border-foreground/20">
                        <div className="mb-1.5 text-[10px] font-medium text-muted-foreground/50">
                          Ваш код для сайта
                        </div>
                        <code className="block break-all font-mono text-[10px] leading-relaxed text-emerald-600 dark:text-emerald-400">
                          &lt;script src=&quot;cdn.floqly.ru/c/
                          {config.company.name
                            ? config.company.name.toLowerCase().replace(/[^a-zа-я0-9]/gi, '').slice(0, 6)
                            : 'abc123'}
                          .js&quot;&gt;&lt;/script&gt;
                        </code>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6} className="max-w-[220px] text-[11px] leading-relaxed">
                      Короткий скрипт вместо ~{lineCount} строк — подключается через CDN, обновляется без правок на сайте
                    </TooltipContent>
                  </Tooltip>

                  {/* Mini Analytics */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <MiniStat
                      numericValue={1247}
                      label="Показы"
                      animate={mockupInView}
                      tooltip="Сколько раз баннер был показан посетителям вашего сайта"
                    />
                    <MiniStat
                      numericValue={892}
                      label="Приняли"
                      animate={mockupInView}
                      tooltip="Сколько посетителей согласились на cookie. Низкий показатель? Возможно, баннер плохо заметен — попробуйте другую позицию"
                    />
                    <MiniStat
                      numericValue={2.3}
                      suffix="с"
                      decimals={1}
                      label="Ср. время"
                      highlight
                      animate={mockupInView}
                      tooltip="Среднее время от показа баннера до клика. Чем быстрее — тем меньше баннер мешает посетителям"
                    />
                  </div>
                </div>
              </TooltipProvider>
            </div>

            {/* CTA */}
            <a
              href="/auth/login?redirect=/dashboard/tools/cookie-generator"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-[14px] font-medium text-background transition-opacity duration-150 hover:opacity-85"
            >
              Создать аккаунт бесплатно
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
            <p className="mt-2 text-[12px] text-muted-foreground/50">
              Бесплатно. Без привязки карты.
            </p>
          </div>
        </div>

        {/* RIGHT — Code + Instructions (no border) */}
        <div>
          {/* Collapsible Code Block */}
          <div>
            <button
              onClick={() => setCodeOpen(!codeOpen)}
              className="group flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              <ChevronRight
                className={`size-3.5 transition-transform duration-200 ${codeOpen ? 'rotate-90' : ''}`}
                strokeWidth={2}
              />
              Или вставьте код вручную
              <span className="text-[11px] font-normal text-muted-foreground/40">
                ~{lineCount} строк
              </span>
            </button>

            {codeOpen && (
              <div className="expand-enter mt-4">
                {/* Comparison hint */}
                <div className="mb-3 flex items-center gap-4 text-[12px] text-muted-foreground/50">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500/60" />
                    С аккаунтом: 2 строки
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                    Без аккаунта: ~{lineCount} строк
                  </div>
                </div>

                {/* Code container */}
                <div className="overflow-hidden rounded-xl border border-border bg-[#1a1a2e] dark:bg-[#0f0f1a]">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                    <span className="text-[11px] font-medium text-white/40">HTML</span>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors duration-150 ${
                        copied
                          ? 'text-emerald-400'
                          : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="size-3" strokeWidth={2} />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" strokeWidth={1.5} />
                          Копировать
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code */}
                  <pre className="max-h-[400px] overflow-x-auto overflow-y-auto p-4 font-mono text-[12px] leading-relaxed text-white/70">
                    {embedCode}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Installation Instructions */}
          <div className="mt-8">
            <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60">
              Инструкция по установке
            </h4>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="html" className="border-border">
                <AccordionTrigger className="py-3.5 text-[14px] font-medium text-foreground hover:no-underline">
                  <div className="flex items-center gap-2.5">
                    <Code2 className="size-4 text-muted-foreground/50" strokeWidth={1.5} />
                    HTML (универсально)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Скопируйте код выше, нажав кнопку «Копировать»</li>
                    <li>
                      Откройте HTML-файл вашего сайта и вставьте код перед
                      закрывающим тегом <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">&lt;/body&gt;</code>
                    </li>
                    <li>Сохраните файл и обновите страницу — баннер появится автоматически</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="wordpress" className="border-border">
                <AccordionTrigger className="py-3.5 text-[14px] font-medium text-foreground hover:no-underline">
                  <div className="flex items-center gap-2.5">
                    <Globe className="size-4 text-muted-foreground/50" strokeWidth={1.5} />
                    WordPress
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                  <p className="mb-2 font-medium text-foreground/80">Через плагин (рекомендуется):</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Установите плагин «Insert Headers and Footers» (WPCode)</li>
                    <li>Перейдите в Code Snippets → Header & Footer</li>
                    <li>Вставьте код в секцию «Footer»</li>
                    <li>Сохраните изменения</li>
                  </ol>
                  <p className="mb-2 mt-4 font-medium text-foreground/80">Через тему:</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Перейдите в Внешний вид → Редактор тем → footer.php</li>
                    <li>
                      Вставьте код перед <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">&lt;/body&gt;</code>
                    </li>
                    <li>Сохраните изменения</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tilda" className="border-border">
                <AccordionTrigger className="py-3.5 text-[14px] font-medium text-foreground hover:no-underline">
                  <div className="flex items-center gap-2.5">
                    <LayoutTemplate className="size-4 text-muted-foreground/50" strokeWidth={1.5} />
                    Tilda
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Откройте настройки сайта в Tilda</li>
                    <li>Перейдите в «Ещё» → «HTML-код для вставки»</li>
                    <li>
                      Вставьте код в секцию «Перед <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">&lt;/body&gt;</code>»
                    </li>
                    <li>Сохраните и опубликуйте сайт</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bitrix" className="border-border">
                <AccordionTrigger className="py-3.5 text-[14px] font-medium text-foreground hover:no-underline">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="size-4 text-muted-foreground/50" strokeWidth={1.5} />
                    Bitrix
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Откройте Настройки → Настройки продукта → Сайты → Шаблоны сайтов</li>
                    <li>Выберите активный шаблон и нажмите «Редактировать»</li>
                    <li>
                      Вставьте код в самый конец шаблона, перед <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">&lt;/body&gt;</code>
                    </li>
                    <li>Сохраните шаблон</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other" className="border-border">
                <AccordionTrigger className="py-3.5 text-[14px] font-medium text-foreground hover:no-underline">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="size-4 text-muted-foreground/50" strokeWidth={1.5} />
                    Другие CMS
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>Найдите настройки темы или шаблона вашего сайта</li>
                    <li>Найдите секцию «Пользовательский код» или «Footer»</li>
                    <li>
                      Вставьте код перед закрывающим тегом <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">&lt;/body&gt;</code>
                    </li>
                    <li>Если такой секции нет — обратитесь к документации вашей CMS</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function BenefitItem({
  title,
  subtitle,
  detail,
}: {
  title: string
  subtitle?: string
  detail: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <svg
        className="mt-0.5 size-4 shrink-0 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <span className="text-[13px] font-medium text-foreground">
          {title}
          {subtitle && (
            <span className="ml-1 font-normal text-muted-foreground/60">
              — {subtitle}
            </span>
          )}
        </span>
        <span className="block text-[12px] text-muted-foreground/60">
          {detail}
        </span>
      </div>
    </div>
  )
}

function MiniStat({
  numericValue,
  suffix = '',
  decimals = 0,
  label,
  highlight,
  animate,
  tooltip,
}: {
  numericValue: number
  suffix?: string
  decimals?: number
  label: string
  highlight?: boolean
  animate: boolean
  tooltip: string
}) {
  const animated = useCountUp(numericValue, animate, 800)
  const display = decimals > 0
    ? animated.toFixed(decimals)
    : animated.toLocaleString('ru-RU', { maximumFractionDigits: 0 })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-help rounded-lg border border-border bg-background p-2 text-center transition-colors duration-150 hover:border-foreground/20">
          <div
            className={`text-[14px] font-semibold tabular-nums ${
              highlight
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-foreground'
            }`}
          >
            {display}{suffix}
          </div>
          <div className="text-[9px] text-muted-foreground/50">{label}</div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-[220px] text-[11px] leading-relaxed">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}
