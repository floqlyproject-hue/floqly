'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  CompanyForm,
  CookieConfigForm,
  BannerSettingsForm,
  TextTemplateForm,
  BannerPreview,
  DocumentPreview,
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

  const isFullWidthStep = activeTab === 'design' || activeTab === 'company' || activeTab === 'cookies'

  return (
    <div className={`grid gap-8 transition-all duration-300 ${
      isFullWidthStep
        ? 'lg:grid-cols-1'
        : 'lg:grid-cols-[1fr,380px] xl:grid-cols-[1fr,420px]'
    }`}>
      {/* Left Column - Editor */}
      <div>
        {/* Tabs */}
        <nav className="mb-8" aria-label="Шаги настройки">
          <div className="-mb-px flex border-b border-border">
            {TABS.map((tab, index) => {
              const isActive = activeTab === tab.id
              const isCompleted = index < currentTabIndex

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`relative flex cursor-pointer items-center gap-2 whitespace-nowrap px-5 py-3 text-[13px] font-medium tracking-tight transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? 'text-foreground'
                      : isCompleted
                        ? 'text-foreground/70 hover:text-foreground'
                        : 'text-muted-foreground hover:text-foreground/70'
                  }`}
                >
                  {isCompleted && (
                    <svg className="size-4 shrink-0 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  <span>{tab.shortLabel}</span>
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-px h-[2px] bg-foreground" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="min-h-[400px] rounded-xl border border-border bg-card p-6 sm:p-8">
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
                  <div className="border-t border-border pt-6">
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
                  <div className="mt-4 rounded-lg border border-border bg-card p-4">
                    <h4 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/60">
                      Советы
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
                <div>
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <h3 className="text-[15px] font-medium text-foreground">Всё готово</h3>
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">Проверьте настройки и получите код для вставки.</p>
                </div>

                {/* Checklist */}
                <div className="space-y-1.5">
                  {['Данные компании заполнены', 'Документ сформирован', 'Баннер настроен'].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 py-1">
                      <svg className="size-3.5 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-[13px] text-foreground/70">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Mini Banner Preview */}
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="border-b border-border bg-background px-4 py-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/60">Предпросмотр</span>
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
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3 text-[13px] font-medium text-background transition-all duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                  Получить код
                </button>
              </div>
            )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goToPrevTab}
            disabled={currentTabIndex === 0}
            aria-label="Предыдущий шаг"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-0"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Назад
          </button>

          {currentTabIndex < TABS.length - 1 && (
            <button
              onClick={goToNextTab}
              aria-label="Следующий шаг"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Далее
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>

        {/* Step 1: What you'll get */}
        {activeTab === 'company' && (
          <div className="mt-12 max-w-md">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              За 5 минут вы получите
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                { label: 'Политику cookie', desc: 'готовый документ по 152-ФЗ' },
                { label: 'Баннер согласия', desc: 'с настраиваемым дизайном' },
                { label: 'Код для вставки', desc: 'одна строка — и готово' },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline gap-3"
                >
                  <span className="mt-px block size-[3px] shrink-0 rounded-full bg-foreground" aria-hidden="true" />
                  <span className="text-[13px] leading-relaxed text-foreground">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-muted-foreground"> — {item.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 2: Config summary — compact, left-aligned */}
        {activeTab === 'cookies' && (
          <CookieStepSummary cookieTypes={config.cookieTypes} documentSettings={config.documentSettings} />
        )}
      </div>

      {/* Right Column - Sidebar (hidden on full-width steps) */}
      {!isFullWidthStep && (
        <aside className="lg:sticky lg:top-24 lg:h-fit" aria-label="Подсказки">
          <div key={activeTab} className="animate-enter space-y-5">
            {/* Step 5: Ready to install */}
            {activeTab === 'result' && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2.5">
                  <svg className="size-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-[13px] font-medium text-foreground">Готово к установке</h4>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  Скопируйте код и вставьте перед закрывающим тегом &lt;/body&gt; на вашем сайте.
                </p>
              </div>
            )}

            {/* Context Tips */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/70">
                {activeTab === 'document' && 'Про документ'}
                {activeTab === 'result' && 'Что дальше'}
              </h4>
              <ul className="mt-3 space-y-2">
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

function CookieStepSummary({ cookieTypes, documentSettings }: { cookieTypes: CookieConfig['cookieTypes']; documentSettings: DocumentSettings }) {
  const enabledCookies = cookieTypes.filter((c) => c.enabled)
  const enabledAnalytics = documentSettings.analyticsTools.filter((t) => t.enabled)
  const hasCrossBorder = enabledAnalytics.some((t) => t.isCrossBorder)
  const hasMarketing = documentSettings.marketing.showAds || documentSettings.marketing.retargeting

  // Build list of document sections that will be generated
  const sections: { label: string; active: boolean }[] = [
    { label: 'Общие положения', active: true },
    { label: `Типы cookie (${enabledCookies.length})`, active: enabledCookies.length > 0 },
    { label: 'Сбор и обработка данных', active: true },
    {
      label: 'Интернет-магазин',
      active: documentSettings.businessScenario.ecommerce,
    },
    {
      label: 'Авторизация и личный кабинет',
      active: documentSettings.businessScenario.authService,
    },
    {
      label: 'Платный контент',
      active: documentSettings.businessScenario.paidContent,
    },
    {
      label: `Аналитика (${enabledAnalytics.map((t) => t.name).join(', ')})`,
      active: enabledAnalytics.length > 0,
    },
    { label: 'Трансграничная передача данных', active: hasCrossBorder },
    { label: 'Маркетинг и реклама', active: hasMarketing },
    { label: 'Управление согласием', active: true },
    { label: 'Контакты оператора', active: true },
  ]

  const activeSections = sections.filter((s) => s.active)

  return (
    <div className="mt-10 max-w-md">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
        Структура документа
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        {activeSections.length} {activeSections.length >= 5 ? 'разделов' : activeSections.length >= 2 ? 'раздела' : 'раздел'} сформируются на основе ваших настроек
      </p>
      <div className="mt-4 space-y-1">
        {activeSections.map((section, i) => (
          <div
            key={section.label}
            className="animate-enter flex items-center gap-2.5 py-0.5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="w-4 text-right text-[11px] tabular-nums text-muted-foreground/40">
              {i + 1}
            </span>
            <span className="text-[13px] text-foreground/80">{section.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TipItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted-foreground">
      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/20" aria-hidden="true" />
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
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl animate-scale-in overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="p-6">
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <svg className="size-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <h2 id="modal-title" className="text-[15px] font-semibold text-foreground">
                Ваш код готов
              </h2>
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Вставьте перед закрывающим тегом &lt;/body&gt;
            </p>
          </div>

          {/* Code Block */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
              <span className="font-mono text-[11px] text-zinc-500">HTML</span>
              <button
                onClick={handleCopy}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition-all ${
                  copied
                    ? 'text-success'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Скопировано
                  </>
                ) : (
                  <>
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    Копировать
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-56 overflow-auto p-4 font-mono text-[12px] leading-relaxed text-zinc-300">
              <code>{embedCode}</code>
            </pre>
          </div>

          {/* Hint */}
          <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
            Управляйте виджетом в личном кабинете — обновления применятся автоматически, без изменения кода.
          </p>

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-border px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Закрыть
            </button>
            <a
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Перейти в ЛК
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
