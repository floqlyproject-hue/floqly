'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  CompanyForm,
  CookieConfigForm,
  BannerSettingsForm,
  TextTemplateForm,
  BannerPreview,
  DocumentPreview,
  CookieImpactCard,
} from './components'
import { DEFAULT_CONFIG, type CookieConfig, type DocumentSettings } from './types'
import { type BannerTemplateId } from './templates'
import { AuthModal } from '@/app/auth/components'
import { createClient } from '@/lib/supabase/client'
import { useSiteScreenshot } from '@/lib/hooks/use-site-screenshot'

export type ActiveTab = 'company' | 'cookies' | 'document' | 'design' | 'result'

const TABS: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  {
    id: 'company',
    label: 'Компания',
    shortLabel: 'Компания',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
  },
  {
    id: 'cookies',
    label: 'Настройка cookie',
    shortLabel: 'Cookie',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'document',
    label: 'Документ',
    shortLabel: 'Документ',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'design',
    label: 'Оформление',
    shortLabel: 'Оформление',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    id: 'result',
    label: 'Результат',
    shortLabel: 'Результат',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function CookieGeneratorClient() {
  const [config, setConfig] = useState<CookieConfig>(DEFAULT_CONFIG)
  const [activeTab, setActiveTab] = useState<ActiveTab>('company')
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplateId | 'custom'>('standard')
  const [customText, setCustomText] = useState('')
  const [documentMode, setDocumentMode] = useState<'generate' | 'custom'>('generate')
  const [customDocument, setCustomDocument] = useState('')
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { screenshotUrl, isLoading: isScreenshotLoading } = useSiteScreenshot(config.company.website)

  // Check auth status
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGetCode = useCallback(() => {
    if (isAuthenticated) {
      setShowCodeModal(true)
    } else {
      setShowAuthModal(true)
    }
  }, [isAuthenticated])

  const handleCompanyChange = useCallback((company: CookieConfig['company']) => {
    setConfig((prev) => ({ ...prev, company }))
  }, [])

  const handleCookieTypesChange = useCallback((cookieTypes: CookieConfig['cookieTypes']) => {
    setConfig((prev) => ({ ...prev, cookieTypes }))
  }, [])

  const handleDocumentSettingsChange = useCallback((documentSettings: DocumentSettings) => {
    setConfig((prev) => ({ ...prev, documentSettings }))
  }, [])

  const handleBannerChange = useCallback((banner: CookieConfig['banner']) => {
    setConfig((prev) => ({ ...prev, banner }))
  }, [])

  const handleButtonTextChange = useCallback((buttonText: CookieConfig['buttonText']) => {
    setConfig((prev) => ({ ...prev, buttonText }))
  }, [])

  const isConfigValid = config.company.name.trim() !== ''

  const currentTabIndex = useMemo(
    () => TABS.findIndex((t) => t.id === activeTab),
    [activeTab]
  )

  const progress = useMemo(
    () => ((currentTabIndex + 1) / TABS.length) * 100,
    [currentTabIndex]
  )

  const goToNextTab = useCallback(() => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id)
    }
  }, [currentTabIndex])

  const goToPrevTab = useCallback(() => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id)
    }
  }, [currentTabIndex])

  const isFullWidthStep = activeTab === 'design' || activeTab === 'company'

  return (
    <div className={`grid gap-8 transition-all duration-300 ${
      isFullWidthStep
        ? 'lg:grid-cols-1'
        : 'lg:grid-cols-[1fr,420px] xl:grid-cols-[1fr,480px]'
    }`}>
      {/* Left Column - Editor */}
      <div className="space-y-6">
        {/* Progress Indicator - Premium Style */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Шаг {currentTabIndex + 1}
              </span>
              <span className="text-sm text-muted-foreground">
                из {TABS.length}
              </span>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium tabular-nums text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          {/* Refined progress bar */}
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tabs - Premium Navigation */}
        <nav className="relative" aria-label="Шаги настройки">
          <div className="flex gap-1 overflow-x-auto rounded-2xl border border-border/50 bg-muted/30 p-1.5 backdrop-blur-sm">
            {TABS.map((tab, index) => {
              const isActive = activeTab === tab.id
              const isCompleted = index < currentTabIndex

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${tab.label}${isCompleted ? ' (завершено)' : ''}`}
                  className={`group relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                  }`}
                >
                  <span className={`transition-colors duration-200 ${isCompleted ? 'text-primary' : isActive ? 'text-foreground' : ''}`}>
                    {isCompleted ? (
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      tab.icon
                    )}
                  </span>
                  <span className="hidden whitespace-nowrap sm:inline">{tab.shortLabel}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Tab Content - Premium Card */}
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          {/* Subtle inner gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />

          <div className="relative p-6">
            {activeTab === 'company' && (
              <CompanyForm data={config.company} onChange={handleCompanyChange} />
            )}
            {activeTab === 'cookies' && (
              <CookieConfigForm
                documentSettings={config.documentSettings}
                cookieTypes={config.cookieTypes}
                onDocumentSettingsChange={handleDocumentSettingsChange}
                onCookieTypesChange={handleCookieTypesChange}
              />
            )}
            {activeTab === 'document' && (
              <DocumentPreview
                config={config}
                mode={documentMode}
                onModeChange={setDocumentMode}
                customDocument={customDocument}
                onCustomDocumentChange={setCustomDocument}
              />
            )}
            {activeTab === 'design' && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Design + Text controls */}
                <div className="space-y-8 lg:max-h-[600px] lg:overflow-y-auto lg:pr-4">
                  <BannerSettingsForm data={config.banner} onChange={handleBannerChange} />
                  <div className="border-t border-border/40 pt-6">
                    <TextTemplateForm
                      selectedTemplate={selectedTemplate}
                      onTemplateChange={setSelectedTemplate}
                      customText={customText}
                      onCustomTextChange={setCustomText}
                      config={config}
                      buttonText={config.buttonText}
                      onButtonTextChange={handleButtonTextChange}
                    />
                  </div>
                </div>
                {/* Live preview inline */}
                <div className="lg:sticky lg:top-0">
                  <BannerPreview
                    config={config}
                    selectedTemplate={selectedTemplate}
                    customText={customText}
                    screenshotUrl={screenshotUrl}
                    isScreenshotLoading={isScreenshotLoading}
                  />
                  {/* Design tips below preview */}
                  <div className="mt-4 rounded-xl bg-muted/30 p-4">
                    <h4 className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <svg className="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                      Советы по оформлению
                    </h4>
                    <ul className="mt-2.5 space-y-1.5">
                      <TipItem>Плавающая позиция меньше мешает контенту</TipItem>
                      <TipItem>Кнопка «Отклонить» повышает доверие</TipItem>
                      <TipItem>Используйте понятный язык без юридических терминов</TipItem>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'result' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 text-sm font-semibold text-success ring-1 ring-success/10">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">Всё готово!</h3>
                    <p className="text-sm text-muted-foreground">Проверьте настройки и получите код</p>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="overflow-hidden rounded-2xl border border-success/20 bg-gradient-to-br from-success/[0.06] to-success/[0.02] p-5">
                  <h4 className="text-sm font-medium text-foreground">Ваш баннер cookie готов к установке</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    Вы настроили все параметры. Нажмите «Получить код», чтобы скопировать код для вставки на сайт.
                  </p>

                  {/* Checklist */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 rounded-lg bg-success/[0.06] px-3 py-2">
                      <svg className="size-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-foreground/80">Данные компании заполнены</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-success/[0.06] px-3 py-2">
                      <svg className="size-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-foreground/80">Документ сформирован</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-success/[0.06] px-3 py-2">
                      <svg className="size-4 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-foreground/80">Баннер настроен</span>
                    </div>
                  </div>
                </div>

                {/* Mini Banner Preview */}
                <div className="overflow-hidden rounded-2xl border border-border/60">
                  <div className="border-b border-border/40 bg-muted/30 px-4 py-2.5">
                    <span className="text-xs font-medium text-muted-foreground">Предпросмотр баннера</span>
                  </div>
                  <div className="p-4">
                    <BannerPreview
                      config={config}
                      selectedTemplate={selectedTemplate}
                      customText={customText}
                      screenshotUrl={screenshotUrl}
                      isScreenshotLoading={isScreenshotLoading}
                    />
                  </div>
                </div>

                {/* Get Code CTA */}
                <button
                  onClick={handleGetCode}
                  disabled={!isConfigValid}
                  aria-label="Получить код для вставки"
                  className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <svg className="relative size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                  <span className="relative">Получить код</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation - Refined */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={goToPrevTab}
            disabled={currentTabIndex === 0}
            aria-label="Предыдущий шаг"
            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>Назад</span>
          </button>

          <div className="flex items-center gap-3">
            {currentTabIndex < TABS.length - 1 && (
              <button
                onClick={goToNextTab}
                aria-label="Следующий шаг"
                className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <span className="relative">Далее</span>
                <svg className="relative size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Step 1: Compact "What you'll get" section — left-aligned, right side stays free for smart widget */}
        {activeTab === 'company' && (
          <div className="max-w-md pt-4">
            <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
              За 5 минут вы получите
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Политику cookie</p>
                  <p className="text-xs text-muted-foreground">Готовый документ по 152-ФЗ</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Баннер согласия</p>
                  <p className="text-xs text-muted-foreground">С настраиваемым дизайном</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Код для вставки</p>
                  <p className="text-xs text-muted-foreground">Одна строка — и готово</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Sidebar (hidden on full-width steps: company & design) */}
      {!isFullWidthStep && (
        <aside className="lg:sticky lg:top-24 lg:h-fit" aria-label="Предпросмотр и подсказки">
          <div key={activeTab} className="animate-fade-in space-y-4">
            {/* Step 2: Cookie Config Summary Card */}
            {activeTab === 'cookies' && (
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm">
                <CookieImpactCard cookieTypes={config.cookieTypes} documentSettings={config.documentSettings} />
              </div>
            )}

            {/* Step 5 (result): Banner Preview in sidebar */}
            {activeTab === 'result' && (
              <div className="overflow-hidden rounded-2xl border border-success/20 bg-gradient-to-br from-success/[0.08] to-success/[0.03] p-5">
                <h4 className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-lg bg-success/15">
                    <svg className="size-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Готово к установке
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Скопируйте код и вставьте перед закрывающим тегом &lt;/body&gt; на вашем сайте.
                </p>
              </div>
            )}

            {/* Context Tips */}
            <div className="rounded-2xl border border-border/40 bg-gradient-to-b from-card/60 to-card/40 p-5 backdrop-blur-sm">
              <h4 className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                {activeTab === 'cookies' && 'Настройка документа'}
                {activeTab === 'document' && 'Про документ'}
                {activeTab === 'result' && 'Что дальше?'}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {activeTab === 'cookies' && (
                  <>
                    <TipItem>Выберите тон — от юридического до дружелюбного</TipItem>
                    <TipItem>Google Analytics добавляет раздел о трансграничной передаче</TipItem>
                    <TipItem>Cookie типы синхронизируются с аналитикой и маркетингом</TipItem>
                  </>
                )}
                {activeTab === 'document' && (
                  <>
                    <TipItem>Можете сгенерировать текст или вставить свой</TipItem>
                    <TipItem>Формат Markdown поддерживается большинством CMS</TipItem>
                    <TipItem>Скопируйте или скачайте файл для вашего сайта</TipItem>
                  </>
                )}
                {activeTab === 'result' && (
                  <>
                    <TipItem>Вставьте код перед &lt;/body&gt; на каждой странице</TipItem>
                    <TipItem>Настройки можно менять в личном кабинете</TipItem>
                    <TipItem>Обновления применяются автоматически</TipItem>
                  </>
                )}
              </ul>
            </div>
          </div>
        </aside>
      )}

      {/* Code Modal */}
      {showCodeModal && (
        <CodeModal
          config={config}
          selectedTemplate={selectedTemplate}
          customText={customText}
          onClose={() => setShowCodeModal(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirect="/dashboard"
        title="Создайте аккаунт"
        description="Чтобы сохранить виджет и получить код"
        onSuccess={() => {
          setShowAuthModal(false)
          setShowCodeModal(true)
        }}
      />
    </div>
  )
}

function TipItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}

interface CodeModalProps {
  config: CookieConfig
  selectedTemplate: BannerTemplateId | 'custom'
  customText: string
  onClose: () => void
}

function CodeModal({ config, selectedTemplate, customText, onClose }: CodeModalProps) {
  const [copied, setCopied] = useState(false)

  // Generate embed code
  const embedCode = `<!-- Floqly Cookie Consent -->
<script>
  window.floqlyCookieConfig = ${JSON.stringify(
    {
      company: config.company.name,
      position: config.banner.position,
      colorScheme: config.banner.colorScheme,
      showDecline: config.banner.showDeclineButton,
      showSettings: config.banner.showSettingsButton,
      backdropBlur: config.banner.backdropBlur,
      hideAfterDays: config.banner.hideAfterDays,
      animation: config.banner.animation,
      text: selectedTemplate === 'custom' ? customText : null,
      template: selectedTemplate !== 'custom' ? selectedTemplate : null,
      buttons: config.buttonText,
      cookieTypes: config.cookieTypes.filter(c => c.enabled).map(c => c.id),
      privacyUrl: config.company.privacyPolicyUrl || null,
    },
    null,
    2
  )};
</script>
<script src="https://cdn.floqly.ru/cookie/fl-consent.js" defer></script>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl animate-scale-in overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10">
        {/* Header gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-success/[0.06] to-transparent" />

        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 cursor-pointer rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10 ring-1 ring-success/20">
                <svg className="size-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 id="modal-title" className="text-xl font-semibold tracking-tight text-foreground">
                  Ваш код готов!
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Вставьте перед закрывающим тегом &lt;/body&gt;
                </p>
              </div>
            </div>
          </div>

          {/* Code Block */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
              <span className="text-xs font-medium text-zinc-500">HTML</span>
              <button
                onClick={handleCopy}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  copied
                    ? 'bg-success/20 text-success'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Скопировано
                  </>
                ) : (
                  <>
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    Копировать
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-64 overflow-auto p-4 text-xs leading-relaxed text-zinc-300">
              <code>{embedCode}</code>
            </pre>
          </div>

          {/* Info Card */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/[0.04] p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Управляйте виджетом в личном кабинете</p>
              <p className="mt-1 leading-relaxed text-muted-foreground">
                Редактируйте настройки без изменения кода — обновления применятся автоматически.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Закрыть
            </button>
            <a
              href="/dashboard"
              className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative">Перейти в ЛК</span>
              <svg className="relative size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
