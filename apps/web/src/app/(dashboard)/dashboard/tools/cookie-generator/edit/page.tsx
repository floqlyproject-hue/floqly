'use client'

import { useState, useCallback, useMemo } from 'react'
import { MicroEditorLayout } from '@/components/tools/micro-editor-layout'
import {
  CompanyForm,
  CookieTypesForm,
  BannerSettingsForm,
  TextTemplateForm,
  BannerPreview,
  DocumentPreview,
} from '@/app/(tools)/tools/cookie-generator/components'
import { DEFAULT_CONFIG, type CookieConfig } from '@/app/(tools)/tools/cookie-generator/types'
import { type BannerTemplateId } from '@/app/(tools)/tools/cookie-generator/templates'
import { useCurrentProject } from '@/lib/hooks/use-current-project'
import { useSiteScreenshot } from '@/lib/hooks/use-site-screenshot'

type ActiveTab = 'company' | 'cookies' | 'design' | 'text' | 'document'

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'company',
    label: 'Компания',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
  },
  {
    id: 'cookies',
    label: 'Cookie',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'design',
    label: 'Дизайн',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Текст',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
  {
    id: 'document',
    label: 'Документ',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
]

export default function CookieGeneratorEditPage() {
  const { project } = useCurrentProject()
  const [config, setConfig] = useState<CookieConfig>(DEFAULT_CONFIG)
  const [activeTab, setActiveTab] = useState<ActiveTab>('company')
  const [selectedTemplate, setSelectedTemplate] = useState<BannerTemplateId | 'custom'>('standard')
  const [customText, setCustomText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const { screenshotUrl, isLoading: isScreenshotLoading } = useSiteScreenshot(config.company.website)

  const handleCompanyChange = useCallback((company: CookieConfig['company']) => {
    setConfig((prev) => ({ ...prev, company }))
    setIsDirty(true)
  }, [])

  const handleCookieTypesChange = useCallback((cookieTypes: CookieConfig['cookieTypes']) => {
    setConfig((prev) => ({ ...prev, cookieTypes }))
    setIsDirty(true)
  }, [])

  const handleBannerChange = useCallback((banner: CookieConfig['banner']) => {
    setConfig((prev) => ({ ...prev, banner }))
    setIsDirty(true)
  }, [])

  const handleButtonTextChange = useCallback((buttonText: CookieConfig['buttonText']) => {
    setConfig((prev) => ({ ...prev, buttonText }))
    setIsDirty(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (!project) return

    setIsSaving(true)
    try {
      // TODO: Сохранение в Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsDirty(false)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [project])

  const handleExport = useCallback(() => {
    setShowCodeModal(true)
  }, [])

  const currentTabIndex = useMemo(
    () => TABS.findIndex((t) => t.id === activeTab),
    [activeTab]
  )

  const settingsPanel = (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-border p-2">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id
          const isCompleted = index < currentTabIndex

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className={isCompleted ? 'text-success' : ''}>
                {isCompleted ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  tab.icon
                )}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
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
      <div className="flex shrink-0 items-center justify-between border-t border-border p-4">
        <button
          onClick={() => {
            if (currentTabIndex > 0) {
              setActiveTab(TABS[currentTabIndex - 1].id)
            }
          }}
          disabled={currentTabIndex === 0}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Назад
        </button>

        {currentTabIndex < TABS.length - 1 ? (
          <button
            onClick={() => setActiveTab(TABS[currentTabIndex + 1].id)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Далее
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleExport}
            disabled={!config.company.name}
            className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-success-foreground transition-colors hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            Получить код
          </button>
        )}
      </div>
    </div>
  )

  const previewPanel = (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-4 text-center">
          <span className="text-xs font-medium text-muted-foreground">Предпросмотр</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <BannerPreview
            config={config}
            selectedTemplate={selectedTemplate}
            customText={customText}
            screenshotUrl={screenshotUrl}
            isScreenshotLoading={isScreenshotLoading}
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <MicroEditorLayout
        title="Плашка cookies"
        backHref="/dashboard/tools/cookie-generator"
        backLabel="Плашка cookies"
        settingsPanel={settingsPanel}
        previewPanel={previewPanel}
        onSave={handleSave}
        onExport={handleExport}
        isSaving={isSaving}
        isDirty={isDirty}
      />

      {/* Code Modal */}
      {showCodeModal && (
        <CodeModal
          config={config}
          selectedTemplate={selectedTemplate}
          customText={customText}
          onClose={() => setShowCodeModal(false)}
        />
      )}
    </>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10">
              <svg className="size-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Код готов!</h2>
              <p className="text-sm text-muted-foreground">Вставьте перед &lt;/body&gt;</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
              <span className="text-xs font-medium text-zinc-500">HTML</span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  copied
                    ? 'bg-success/20 text-success'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
            <pre className="max-h-64 overflow-auto p-4 text-xs text-zinc-300">
              <code>{embedCode}</code>
            </pre>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
