'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TurndownService from 'turndown'
import type { CookieConfig } from '../types'
import { generateCookiePolicy, type CookiePolicyData } from '@/lib/templates/cookie-policy'

interface DocumentPreviewProps {
  config: CookieConfig
  cookiePolicyData: Partial<CookiePolicyData>
  mode: 'generate' | 'custom'
  onModeChange: (mode: 'generate' | 'custom') => void
  customDocument: string
  onCustomDocumentChange: (text: string) => void
}

type ViewMode = 'preview' | 'edit'

export function DocumentPreview({
  config,
  cookiePolicyData,
  mode,
  onModeChange,
  customDocument,
  onCustomDocumentChange,
}: DocumentPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [editableGenerated, setEditableGenerated] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const editableRef = useRef<HTMLDivElement>(null)
  const turndownService = useRef(new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  }))

  const generatedText = useMemo(() => {
    // Build full CookiePolicyData from Step 1 + Step 2
    const fullData: CookiePolicyData = {
      // From Step 1 (Company)
      companyName: config.company.name || '',
      siteUrl: config.company.website || '',
      email: config.company.email || '',
      currentDate: new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),

      // From Step 2 (Cookie Policy Form)
      technicalFeatures: cookiePolicyData.technicalFeatures || {
        cart: false,
        auth: false,
        payment: false,
        preferences: false,
        security: false,
        externalServices: [],
      },
      analytics: cookiePolicyData.analytics || {
        yandexMetrika: false,
        liveInternet: false,
        mailRu: false,
        customAnalytics: false,
        other: [],
      },
      crossBorder: cookiePolicyData.crossBorder || {
        googleServices: false,
        facebookPixel: false,
        other: [],
      },
      marketing: cookiePolicyData.marketing || {
        vkPixel: false,
        myTarget: false,
        yandexDirect: false,
        partnerNetworks: [],
        other: [],
      },
    }

    return generateCookiePolicy(fullData)
  }, [config, cookiePolicyData])

  // Sync generated text into editable state when config changes
  useEffect(() => {
    setEditableGenerated(generatedText)
  }, [generatedText])

  const activeText = mode === 'generate' ? editableGenerated : customDocument

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadMarkdown = () => {
    let markdownContent = activeText

    // If in edit mode and contentEditable was used, convert HTML back to Markdown
    if (viewMode === 'edit' && editableRef.current) {
      const htmlContent = editableRef.current.innerHTML
      markdownContent = turndownService.current.turndown(htmlContent)
    }

    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cookie-policy.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadMenuOpen(false)
  }

  const handleReset = () => {
    if (mode === 'generate') {
      setEditableGenerated(generatedText)
      if (editableRef.current) {
        editableRef.current.innerHTML = '' // Will be re-rendered by React
      }
    } else {
      onCustomDocumentChange('')
    }
    setShowResetConfirm(false)
    setViewMode('preview')
  }

  const handleDownloadHTML = () => {
    // Convert Markdown to HTML
    const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Политика использования файлов cookie</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #1a1a1a;
    }
    h1 { font-size: 2rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; }
    h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.75rem; }
    h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    p { margin-bottom: 1rem; }
    ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.25rem; }
    strong { font-weight: 600; }
    blockquote {
      border-left: 4px solid #e5e5e5;
      padding-left: 1rem;
      margin-left: 0;
      font-style: italic;
      color: #666;
    }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
${activeText.split('\n').map(line => {
  // Basic Markdown to HTML conversion
  line = line.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  line = line.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  line = line.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  line = line.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
  line = line.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  line = line.replace(/^\* (.+)$/gm, '<li>$1</li>')
  if (line.startsWith('<li>')) {
    return line
  }
  if (line.trim() === '') {
    return '<br>'
  }
  if (!line.startsWith('<h') && !line.startsWith('<blockquote>')) {
    return '<p>' + line + '</p>'
  }
  return line
}).join('\n').replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')}
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cookie-policy.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadMenuOpen(false)
  }

  const isEmpty = !config.company.name && mode === 'generate'

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">Текст документа</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">Политика использования cookie</p>
      </div>

      {/* Mode Toggle */}
      <div className="-mb-px flex gap-0 border-b border-border">
        <button
          onClick={() => onModeChange('generate')}
          className={`relative flex cursor-pointer items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
            mode === 'generate'
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Сгенерировать
          {mode === 'generate' && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-foreground" />}
        </button>
        <button
          onClick={() => onModeChange('custom')}
          className={`relative flex cursor-pointer items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
            mode === 'custom'
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          Вставить свой
          {mode === 'custom' && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-foreground" />}
        </button>
      </div>

      {mode === 'generate' && isEmpty ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-foreground/[0.05]">
            <svg
              className="size-7 text-muted-foreground/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h4 className="mt-4 text-sm font-medium text-foreground">
            Документ будет сгенерирован автоматически
          </h4>
          <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Заполните информацию о компании на первом шаге, чтобы увидеть готовый документ
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Document Card */}
          <div className="overflow-hidden rounded-xl border border-border">
            {/* Header with Actions */}
            <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
              <div className="flex items-center gap-2">
                <svg
                  className="size-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <div>
                  <span className="text-[13px] font-medium text-foreground">
                    {viewMode === 'preview' ? 'Предпросмотр документа' : 'Редактирование документа'}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {viewMode === 'preview' ? 'HTML' : 'Markdown'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit/Save Button */}
                <button
                  onClick={() => {
                    if (viewMode === 'edit' && editableRef.current) {
                      // Save HTML edits back to Markdown state
                      const htmlContent = editableRef.current.innerHTML
                      const markdownContent = turndownService.current.turndown(htmlContent)
                      if (mode === 'generate') {
                        setEditableGenerated(markdownContent)
                      } else {
                        onCustomDocumentChange(markdownContent)
                      }
                    }
                    setViewMode(viewMode === 'preview' ? 'edit' : 'preview')
                  }}
                  aria-label={viewMode === 'preview' ? 'Редактировать документ' : 'Сохранить изменения'}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {viewMode === 'preview' ? (
                    <>
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                      Редактировать
                    </>
                  ) : (
                    <>
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Сохранить
                    </>
                  )}
                </button>

                {/* Reset Button - only show in edit mode */}
                {viewMode === 'edit' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      aria-label="Сбросить к оригиналу"
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Сбросить
                    </button>

                    {/* Confirmation Popup */}
                    {showResetConfirm && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowResetConfirm(false)}
                        />
                        {/* Popup */}
                        <div className="absolute right-0 top-full mt-1 z-20 w-64 rounded-lg border border-border bg-background p-3 shadow-lg">
                          <p className="text-[13px] text-foreground mb-3">
                            Вернуть документ к оригинальной версии? Все изменения будут потеряны.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleReset}
                              className="flex-1 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                            >
                              Сбросить
                            </button>
                            <button
                              onClick={() => setShowResetConfirm(false)}
                              className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  disabled={!activeText}
                  aria-label="Копировать текст документа"
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 ${
                    copied
                      ? 'bg-success/10 text-success'
                      : 'bg-background text-foreground hover:bg-muted'
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

                {/* Download Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                    disabled={!activeText}
                    aria-label="Скачать документ"
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Скачать
                    <svg className="size-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {downloadMenuOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDownloadMenuOpen(false)}
                      />
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-1 z-20 w-48 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                        <button
                          onClick={handleDownloadMarkdown}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-muted"
                        >
                          <svg className="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <div>
                            <div className="font-medium">Markdown (.md)</div>
                            <div className="text-xs text-muted-foreground">Исходный формат</div>
                          </div>
                        </button>
                        <button
                          onClick={handleDownloadHTML}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-foreground transition-colors hover:bg-muted"
                        >
                          <svg className="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                          </svg>
                          <div>
                            <div className="font-medium">HTML (.html)</div>
                            <div className="text-xs text-muted-foreground">Готовая страница</div>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Document Content: Preview or Edit Mode */}
            {viewMode === 'preview' ? (
              /* Preview Mode: ReactMarkdown */
              <div className="prose prose-slate max-w-none bg-background p-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-[24px] font-semibold tracking-tight text-foreground mb-4 mt-6 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-[20px] font-semibold tracking-tight text-foreground mb-3 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-[17px] font-semibold tracking-tight text-foreground mb-2 mt-5">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[15px] leading-relaxed text-foreground mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2 mb-4 pl-6 list-disc marker:text-muted-foreground">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-2 mb-4 pl-6 list-decimal marker:text-muted-foreground">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-[15px] leading-relaxed text-foreground">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground mb-4">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline decoration-muted-foreground hover:decoration-foreground transition-colors"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {activeText}
                </ReactMarkdown>
              </div>
            ) : (
              /* Edit Mode: ContentEditable HTML */
              <div
                ref={editableRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[480px] w-full bg-background p-6 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:ring-inset rounded-b-xl"
                style={{
                  // Inline styles for contentEditable formatting
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-[24px] font-semibold tracking-tight text-foreground mb-4 mt-6 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-[20px] font-semibold tracking-tight text-foreground mb-3 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-[17px] font-semibold tracking-tight text-foreground mb-2 mt-5">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[15px] leading-relaxed text-foreground mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2 mb-4 pl-6 list-disc marker:text-muted-foreground">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-2 mb-4 pl-6 list-decimal marker:text-muted-foreground">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-[15px] leading-relaxed text-foreground">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground mb-4">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline decoration-muted-foreground hover:decoration-foreground transition-colors"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {activeText}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <svg className="size-4 shrink-0 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-[13px] leading-relaxed text-foreground/80">
              {viewMode === 'preview' ? (
                <>Документ отображается так, как он будет выглядеть на вашем сайте. Нажмите <span className="font-medium text-foreground">«Редактировать»</span>, чтобы внести изменения.</>
              ) : (
                <>Редактируйте документ прямо в тексте — изменяйте заголовки, списки и параграфы. Нажмите <span className="font-medium text-foreground">«Сохранить»</span> когда закончите. Случайно удалили что-то? Используйте кнопку <span className="font-medium text-foreground">«Сбросить»</span>.</>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
