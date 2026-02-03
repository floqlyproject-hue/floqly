'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  CompanyForm,
  CookieTypesForm,
  BannerSettingsForm,
  TextTemplateForm,
  BannerPreview,
  DocumentPreview,
} from './components'
import { DEFAULT_CONFIG, type CookieConfig } from './types'
import { type BannerTemplateId } from './templates'

type ActiveTab = 'company' | 'cookies' | 'design' | 'text' | 'document'

const TABS: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  {
    id: 'company',
    label: 'Компания',
    shortLabel: 'Компания',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'cookies',
    label: 'Типы cookie',
    shortLabel: 'Cookie',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'design',
    label: 'Дизайн',
    shortLabel: 'Дизайн',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Текст баннера',
    shortLabel: 'Текст',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
  },
  {
    id: 'document',
    label: 'Документ',
    shortLabel: 'Документ',
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

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,480px]">
      {/* Left Column - Editor */}
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Шаг {currentTabIndex + 1} из {TABS.length}</span>
            <span>{Math.round(progress)}% завершено</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1.5">
          {TABS.map((tab, index) => {
            const isActive = activeTab === tab.id
            const isCompleted = index < currentTabIndex

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                }`}
              >
                <span className={`transition-colors ${isCompleted ? 'text-primary' : ''}`}>
                  {isCompleted ? (
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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

        {/* Tab Content */}
        <div className="min-h-[400px] rounded-xl border border-border bg-card p-6 shadow-sm">
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
          {activeTab === 'document' && (
            <DocumentPreview config={config} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevTab}
            disabled={currentTabIndex === 0}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>

          <div className="flex items-center gap-3">
            {activeTab === 'document' && (
              <button
                onClick={() => setShowCodeModal(true)}
                disabled={!isConfigValid}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Получить код
              </button>
            )}

            {currentTabIndex < TABS.length - 1 && (
              <button
                onClick={goToNextTab}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Далее
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <BannerPreview
            config={config}
            selectedTemplate={selectedTemplate}
            customText={customText}
          />
        </div>

        {/* Context Tips - change based on active tab */}
        <div className="mt-4 rounded-xl border border-border bg-card/50 p-4">
          <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {activeTab === 'company' && 'Зачем это нужно?'}
            {activeTab === 'cookies' && 'Какие cookie выбрать?'}
            {activeTab === 'design' && 'Советы по дизайну'}
            {activeTab === 'text' && 'Про текст'}
            {activeTab === 'document' && 'Про документ'}
          </h4>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            {activeTab === 'company' && (
              <>
                <TipItem>Название компании появится в тексте баннера</TipItem>
                <TipItem>Email позволит пользователям связаться по вопросам приватности</TipItem>
                <TipItem>Ссылка на политику — для тех, кто хочет узнать больше</TipItem>
              </>
            )}
            {activeTab === 'cookies' && (
              <>
                <TipItem>Включите только те cookie, которые реально используете</TipItem>
                <TipItem>Аналитические — Google Analytics, Яндекс.Метрика</TipItem>
                <TipItem>Маркетинговые — ретаргетинг, рекламные пиксели</TipItem>
              </>
            )}
            {activeTab === 'design' && (
              <>
                <TipItem>Плавающая позиция меньше мешает контенту</TipItem>
                <TipItem>Кнопка «Отклонить» повышает доверие пользователей</TipItem>
                <TipItem>Backdrop blur добавляет современный эффект</TipItem>
              </>
            )}
            {activeTab === 'text' && (
              <>
                <TipItem>Используйте понятный язык без юридических терминов</TipItem>
                <TipItem>Шаблон «Юридический» подходит для B2B-сайтов</TipItem>
                <TipItem>Можете написать свой текст, если шаблоны не подходят</TipItem>
              </>
            )}
            {activeTab === 'document' && (
              <>
                <TipItem>Этот текст можно разместить на отдельной странице</TipItem>
                <TipItem>Формат Markdown поддерживается большинством CMS</TipItem>
                <TipItem>Скопируйте или скачайте файл для вашего сайта</TipItem>
              </>
            )}
          </ul>
        </div>

        {/* Quick Actions */}
        {activeTab === 'document' && isConfigValid && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Всё готово!
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Нажмите «Получить код», чтобы скопировать код для вставки на сайт
            </p>
          </div>
        )}
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

function TipItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg className="mt-0.5 size-3 shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl animate-scale-in rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
              <svg className="size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Ваш код готов!</h2>
              <p className="text-sm text-muted-foreground">
                Вставьте перед закрывающим тегом &lt;/body&gt;
              </p>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="relative">
          <pre className="max-h-72 overflow-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300">
            <code>{embedCode}</code>
          </pre>

          <button
            onClick={handleCopy}
            className={`absolute right-3 top-3 flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
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
                Скопировано!
              </>
            ) : (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Копировать код
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary/5 p-4">
          <svg className="mt-0.5 size-5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-foreground">Хотите управлять виджетом без кода?</p>
            <p className="mt-1 text-muted-foreground">
              <a href="/dashboard" className="cursor-pointer text-primary hover:underline">
                Создайте бесплатный аккаунт
              </a>
              {' '}— редактируйте настройки в личном кабинете, изменения применятся автоматически.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Закрыть
          </button>
          <a
            href="/dashboard"
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
