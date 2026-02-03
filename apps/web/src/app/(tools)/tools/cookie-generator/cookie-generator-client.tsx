'use client'

import { useState, useCallback } from 'react'
import {
  CompanyForm,
  CookieTypesForm,
  BannerSettingsForm,
  TextTemplateForm,
  BannerPreview,
} from './components'
import { DEFAULT_CONFIG, type CookieConfig } from './types'
import { type BannerTemplateId } from './templates'

type ActiveTab = 'company' | 'cookies' | 'design' | 'text'

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'company',
    label: 'Компания',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'cookies',
    label: 'Cookie',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    id: 'design',
    label: 'Дизайн',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Текст',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export function CookieGeneratorClient() {
  const [config, setConfig] = useState<CookieConfig>(DEFAULT_CONFIG)
  const [activeTab, setActiveTab] = useState<ActiveTab>('company')
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplateId | 'custom'>('standard')
  const [customText, setCustomText] = useState('')
  const [showCodeModal, setShowCodeModal] = useState(false)

  const handleCompanyChange = useCallback((company: CookieConfig['company']) => {
    setConfig((prev) => ({ ...prev, company }))
  }, [])

  const handleCookieTypesChange = useCallback((cookieTypes: CookieConfig['cookieTypes']) => {
    setConfig((prev) => ({ ...prev, cookieTypes }))
  }, [])

  const handleBannerChange = useCallback((banner: CookieConfig['banner']) => {
    setConfig((prev) => ({ ...prev, banner }))
  }, [])

  const handleButtonTextChange = useCallback((buttonText: CookieConfig['buttonText']) => {
    setConfig((prev) => ({ ...prev, buttonText }))
  }, [])

  const isConfigValid = config.company.name.trim() !== ''

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,480px]">
      {/* Left Column - Editor */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-xl border border-border bg-card p-6">
          {activeTab === 'company' && (
            <CompanyForm data={config.company} onChange={handleCompanyChange} />
          )}
          {activeTab === 'cookies' && (
            <CookieTypesForm data={config.cookieTypes} onChange={handleCookieTypesChange} />
          )}
          {activeTab === 'design' && (
            <BannerSettingsForm data={config.banner} onChange={handleBannerChange} />
          )}
          {activeTab === 'text' && (
            <TextTemplateForm
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              customText={customText}
              onCustomTextChange={setCustomText}
              config={config}
              buttonText={config.buttonText}
              onButtonTextChange={handleButtonTextChange}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const currentIndex = TABS.findIndex((t) => t.id === activeTab)
              if (currentIndex > 0) {
                setActiveTab(TABS[currentIndex - 1].id)
              }
            }}
            disabled={activeTab === 'company'}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>

          {activeTab !== 'text' ? (
            <button
              onClick={() => {
                const currentIndex = TABS.findIndex((t) => t.id === activeTab)
                if (currentIndex < TABS.length - 1) {
                  setActiveTab(TABS[currentIndex + 1].id)
                }
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Далее
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setShowCodeModal(true)}
              disabled={!isConfigValid}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Получить код
            </button>
          )}
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-xl border border-border bg-card p-4">
          <BannerPreview
            config={config}
            selectedTemplate={selectedTemplate}
            customText={customText}
          />
        </div>

        {/* Tips */}
        <div className="mt-4 rounded-lg border border-border bg-card/50 p-4">
          <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Советы
          </h4>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-1.5">
              <span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground" />
              Используйте понятный язык без юридических терминов
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground" />
              Укажите только те cookie, которые реально используете
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-1 size-1 shrink-0 rounded-full bg-muted-foreground" />
              Кнопка «Отклонить» повышает доверие пользователей
            </li>
          </ul>
        </div>
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <CodeModal
          config={config}
          selectedTemplate={selectedTemplate}
          customText={customText}
          onClose={() => setShowCodeModal(false)}
        />
      )}
    </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Ваш код готов!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Вставьте этот код перед закрывающим тегом &lt;/body&gt; на вашем сайте
          </p>
        </div>

        {/* Code Block */}
        <div className="relative">
          <pre className="max-h-80 overflow-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-300">
            <code>{embedCode}</code>
          </pre>

          <button
            onClick={handleCopy}
            className={`absolute right-2 top-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {copied ? (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Скопировано
              </>
            ) : (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Копировать
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 flex items-start gap-3 rounded-lg bg-primary/5 p-3">
          <svg className="mt-0.5 size-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Хотите сохранить настройки?</p>
            <p className="mt-0.5 text-muted-foreground">
              <a href="/dashboard" className="text-primary hover:underline">
                Создайте бесплатный аккаунт
              </a>
              , чтобы редактировать виджет без изменения кода на сайте
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Закрыть
          </button>
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Создать аккаунт
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
