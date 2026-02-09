'use client'

import { useState, useCallback, useMemo, useEffect, useRef, Fragment } from 'react'
import {
  CompanyForm,
  BannerSettingsForm,
  TextTemplateForm,
  BannerPreview,
  DocumentPreview,
} from './components'
import { CookiePolicyForm } from './components/cookie-policy-form'
import { DEFAULT_CONFIG, type CookieConfig } from './types'
import { type BannerTemplateId } from './templates'
import { type CookiePolicyData } from '@/lib/templates/cookie-policy'
import { AuthModal } from '@/app/auth/components'
import { createClient } from '@/lib/supabase/client'
import { useSiteScreenshot } from '@/lib/hooks/use-site-screenshot'
import { useSiteParser } from '@/lib/hooks/use-site-parser'

export type ActiveTab = 'company' | 'cookies' | 'document' | 'design' | 'result'

const TABS: { id: ActiveTab; shortLabel: string }[] = [
  { id: 'company', shortLabel: 'Компания' },
  { id: 'cookies', shortLabel: 'Cookie' },
  { id: 'document', shortLabel: 'Документ' },
  { id: 'design', shortLabel: 'Оформление' },
  { id: 'result', shortLabel: 'Результат' },
]

export function CookieGeneratorClient() {
  const stepsRef = useRef<HTMLElement>(null)
  const [config, setConfig] = useState<CookieConfig>(DEFAULT_CONFIG)
  const [activeTab, setActiveTab] = useState<ActiveTab>('company')
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplateId | 'custom'>('standard')
  const [customText, setCustomText] = useState('')
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { screenshotUrl, isLoading: isScreenshotLoading } = useSiteScreenshot(config.company.website)
  const { parserData, isLoading: isParserLoading } = useSiteParser(config.company.website, { mode: 'all' })

  // New cookie policy data (for new document template)
  const [cookiePolicyData, setCookiePolicyData] = useState<Partial<CookiePolicyData>>({
    technicalFeatures: {
      cart: false,
      auth: false,
      payment: false,
      preferences: false,
      security: false,
      externalServices: [],
    },
    analytics: {
      yandexMetrika: false,
      liveInternet: false,
      mailRu: false,
      customAnalytics: false,
      other: [],
    },
    crossBorder: {
      googleServices: false,
      facebookPixel: false,
      other: [],
    },
    marketing: {
      vkPixel: false,
      myTarget: false,
      yandexDirect: false,
      partnerNetworks: [],
      other: [],
    },
  })

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

  // Debug: Log parser results
  useEffect(() => {
    if (parserData) {
      console.log('🔍 Parser Results:', parserData)
      console.log('📊 Detected Services:', parserData.detected)
      console.log('💬 Chat Widgets:', parserData.chatWidgets)
      console.log('📈 Analytics:', parserData.analytics)
      console.log('📱 Messengers:', parserData.messengers)
    }
  }, [parserData])

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

  const scrollToSteps = useCallback(() => {
    stepsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const goToNextTab = useCallback(() => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id)
      scrollToSteps()
    }
  }, [currentTabIndex, scrollToSteps])

  const goToPrevTab = useCallback(() => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id)
      scrollToSteps()
    }
  }, [currentTabIndex, scrollToSteps])

  const isFullWidthStep = activeTab === 'design' || activeTab === 'company' || activeTab === 'cookies'

  return (
    <div className={`grid gap-8 transition-all duration-300 ${
      isFullWidthStep
        ? 'lg:grid-cols-1'
        : 'lg:grid-cols-[1fr,380px] xl:grid-cols-[1fr,420px]'
    }`}>
      {/* Left Column - Editor */}
      <div>
        {/* Steps */}
        <nav ref={stepsRef} className="mb-12 max-w-2xl scroll-mt-24" aria-label="Шаги настройки">
          <div className="flex items-center">
            {TABS.map((tab, index) => {
              const isActive = activeTab === tab.id
              const isCompleted = index < currentTabIndex

              return (
                <Fragment key={tab.id}>
                  <button
                    onClick={() => { setActiveTab(tab.id); scrollToSteps() }}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group flex items-center gap-2.5 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      isActive
                        ? 'text-foreground'
                        : isCompleted
                          ? 'text-foreground/50 hover:text-foreground/70'
                          : 'text-muted-foreground/40 hover:text-muted-foreground/70'
                    }`}
                  >
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors duration-150 ${
                        isActive
                          ? 'bg-foreground text-background'
                          : isCompleted
                            ? 'bg-foreground/10 text-foreground/60'
                            : 'bg-muted text-muted-foreground/40'
                      }`}
                      aria-hidden="true"
                    >
                      {isCompleted ? (
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="hidden sm:block">{tab.shortLabel}</span>
                  </button>

                  {index < TABS.length - 1 && (
                    <div
                      className={`mx-3 h-px flex-1 transition-colors duration-150 ${
                        index < currentTabIndex ? 'bg-foreground/15' : 'bg-border'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </Fragment>
              )
            })}
          </div>
        </nav>

        {/* Step Content */}
        <div key={activeTab} className="step-enter min-h-[400px]">
            {activeTab === 'company' && (
              <CompanyForm
                data={config.company}
                onChange={handleCompanyChange}
                isParserLoading={isParserLoading}
                parserData={parserData}
              />
            )}
            {activeTab === 'cookies' && (
              <CookiePolicyForm
                data={cookiePolicyData}
                onChange={setCookiePolicyData}
              />
            )}
            {activeTab === 'document' && (
              <DocumentPreview
                config={config}
                cookiePolicyData={cookiePolicyData}
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
        <div className="mt-10 flex max-w-lg items-center gap-4">
          {currentTabIndex > 0 && (
            <button
              onClick={goToPrevTab}
              aria-label="Предыдущий шаг"
              className="flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Назад
            </button>
          )}

          {currentTabIndex < TABS.length - 1 && (
            <button
              onClick={goToNextTab}
              aria-label="Следующий шаг"
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Далее
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>

        {/* Step 1: What you'll get — inline */}
        {activeTab === 'company' && (
          <div className="mt-16 flex max-w-lg flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground/50">
            <span>Политика cookie</span>
            <span className="size-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
            <span>Баннер согласия</span>
            <span className="size-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
            <span>Код для вставки</span>
          </div>
        )}

        {/* Step 2: inline summary */}
        {activeTab === 'cookies' && (
          <div className="mt-16 flex max-w-lg flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground/50">
            <span>Технические cookie</span>
            <span className="size-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
            <span>Аналитика</span>
            <span className="size-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
            <span>Маркетинг</span>
          </div>
        )}

        {/* Step 3: inline summary */}
        {activeTab === 'document' && (
          <div className="mt-16 flex max-w-lg flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground/50">
            <span>Markdown</span>
            <span className="size-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
            <span>HTML</span>
            <span className="size-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
            <span>PDF (скоро)</span>
          </div>
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
