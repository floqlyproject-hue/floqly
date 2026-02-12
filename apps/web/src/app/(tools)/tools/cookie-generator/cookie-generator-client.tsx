'use client'

import { useState, useCallback, useMemo, useEffect, useRef, Fragment } from 'react'
import {
  CompanyForm,
  BannerPreview,
  DocumentPreview,
  ResultStep,
} from './components'
import { CookiePolicyForm } from './components/cookie-policy-form'
import { DEFAULT_CUSTOMIZATION } from './components/banner-preview'
import type { BannerCustomization } from './components/liquid-glass-island'
import { DEFAULT_CONFIG, type CookieConfig } from './types'
import type { CookiePolicyData } from '@/lib/templates/cookie-policy'
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
  const [bannerCustomization, setBannerCustomization] = useState<BannerCustomization>(DEFAULT_CUSTOMIZATION)
  const { screenshotUrl, isLoading: isScreenshotLoading } = useSiteScreenshot(config.company.website)
  const { parserData, isLoading: isParserLoading } = useSiteParser(config.company.website, { mode: 'all' })

  // Cookie policy data (for document template)
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

  const handleCompanyChange = useCallback((company: CookieConfig['company']) => {
    setConfig((prev) => ({ ...prev, company }))
  }, [])

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

  return (
    <div className="grid gap-8 lg:grid-cols-1">
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
              <BannerPreview
                config={config}
                screenshotUrl={screenshotUrl}
                isScreenshotLoading={isScreenshotLoading}
                customization={bannerCustomization}
                onCustomizationChange={setBannerCustomization}
              />
            )}
            {activeTab === 'result' && (
              <ResultStep
                config={config}
                cookiePolicyData={cookiePolicyData}
                bannerCustomization={bannerCustomization}
              />
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

    </div>
  )
}
