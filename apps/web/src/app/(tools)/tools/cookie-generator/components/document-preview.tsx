'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { CookieConfig } from '../types'
import { generateCookiePolicy, type CookiePolicyData } from '@/lib/templates/cookie-policy'

interface DocumentPreviewProps {
  config: CookieConfig
  cookiePolicyData: Partial<CookiePolicyData>
}

type ViewMode = 'preview' | 'edit'

export function DocumentPreview({
  config,
  cookiePolicyData,
}: DocumentPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [editedHtml, setEditedHtml] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const downloadRef = useRef<HTMLDivElement>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewBtnRef = useRef<HTMLButtonElement>(null)
  const editorBtnRef = useRef<HTMLButtonElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  // Generate markdown source from config
  const generatedMarkdown = useMemo(() => {
    const fullData: CookiePolicyData = {
      companyName: config.company.name || '',
      siteUrl: config.company.website || '',
      email: config.company.email || '',
      currentDate: new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      technicalFeatures: cookiePolicyData.technicalFeatures || {
        cart: false, auth: false, payment: false,
        preferences: false, security: false, externalServices: [],
      },
      analytics: cookiePolicyData.analytics || {
        yandexMetrika: false, liveInternet: false, mailRu: false,
        customAnalytics: false, other: [],
      },
      crossBorder: cookiePolicyData.crossBorder || {
        googleServices: false, facebookPixel: false, other: [],
      },
      marketing: cookiePolicyData.marketing || {
        vkPixel: false, myTarget: false, yandexDirect: false,
        partnerNetworks: [], other: [],
      },
    }
    return generateCookiePolicy(fullData)
  }, [config, cookiePolicyData])

  // Reset edited HTML when source markdown changes (user went back and changed config)
  useEffect(() => {
    setEditedHtml(null)
  }, [generatedMarkdown])

  // Update sliding indicator position
  const updateIndicator = useCallback(() => {
    const activeBtn = viewMode === 'preview' ? previewBtnRef.current : editorBtnRef.current
    const parent = activeBtn?.parentElement
    if (activeBtn && parent) {
      const parentRect = parent.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      setIndicatorStyle({
        left: btnRect.left - parentRect.left,
        width: btnRect.width,
      })
    }
  }, [viewMode])

  useEffect(() => {
    updateIndicator()
    // Recalculate on resize
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  // When switching to edit: make contentEditable + focus
  useEffect(() => {
    if (viewMode === 'edit' && contentRef.current) {
      contentRef.current.contentEditable = 'true'
      // Place cursor at start
      const timer = setTimeout(() => {
        contentRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else if (viewMode === 'preview' && contentRef.current) {
      contentRef.current.contentEditable = 'false'
    }
  }, [viewMode])

  // Close dropdown on Escape key
  useEffect(() => {
    if (!downloadMenuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDownloadMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [downloadMenuOpen])

  // Auto-dismiss reset confirmation after 5s
  useEffect(() => {
    if (showResetConfirm) {
      resetTimerRef.current = setTimeout(() => setShowResetConfirm(false), 5000)
      return () => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      }
    }
  }, [showResetConfirm])

  const hasChanges = editedHtml !== null

  // Save edits from contentEditable
  const handleInput = useCallback(() => {
    if (contentRef.current) {
      setEditedHtml(contentRef.current.innerHTML)
    }
  }, [])

  const handleCopy = useCallback(async () => {
    // Copy plain text (what user sees)
    const text = contentRef.current?.innerText || ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleDownloadMarkdown = useCallback(() => {
    // Only available when no manual edits (original markdown)
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cookie-policy.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadMenuOpen(false)
  }, [generatedMarkdown])

  const handleDownloadHTML = useCallback(() => {
    const bodyContent = contentRef.current?.innerHTML || ''
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
    h1 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 1rem; }
    h2 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    h3 { font-size: 1.1rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; }
    p { margin-bottom: 1rem; }
    ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.25rem; }
    strong { font-weight: 600; }
    em { font-style: italic; }
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
${bodyContent}
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
  }, [])

  const handleReset = useCallback(() => {
    setEditedHtml(null)
    setShowResetConfirm(false)
    setViewMode('preview')
  }, [])

  // Switch mode handler — save HTML snapshot before leaving edit (only if user actually edited)
  const switchMode = useCallback((mode: ViewMode) => {
    if (viewMode === 'edit' && mode === 'preview' && contentRef.current && editedHtml !== null) {
      // User made edits via onInput — persist latest innerHTML snapshot
      setEditedHtml(contentRef.current.innerHTML)
    }
    setViewMode(mode)
  }, [viewMode, editedHtml])

  return (
    <div>
      {/* Section Header */}
      <div className="mb-12 max-w-lg">
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">Текст документа</h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground/70">
          Проверьте и отредактируйте сгенерированную политику cookie
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Mode Toggle (segmented control with sliding indicator) */}
        <div className="relative flex items-center gap-0.5 rounded-lg border border-border p-0.5">
          {/* Sliding indicator */}
          <div
            className="absolute top-0.5 h-[calc(100%-4px)] rounded-md bg-foreground transition-all duration-300"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
            }}
          />
          <button
            ref={previewBtnRef}
            onClick={() => switchMode('preview')}
            aria-pressed={viewMode === 'preview'}
            className={`relative z-10 rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              viewMode === 'preview'
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Просмотр
          </button>
          <button
            ref={editorBtnRef}
            onClick={() => switchMode('edit')}
            aria-pressed={viewMode === 'edit'}
            className={`relative z-10 rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              viewMode === 'edit'
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Редактор
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Reset (inline confirm, only when hasChanges) */}
          {hasChanges && (
            <>
              {showResetConfirm ? (
                <div className="expand-enter flex items-center gap-1.5 mr-1">
                  <span className="text-[12px] text-muted-foreground">Сбросить?</span>
                  <button
                    onClick={handleReset}
                    className="rounded-md bg-foreground px-2.5 py-1 text-[12px] font-medium text-background transition-all duration-150 hover:opacity-80"
                  >
                    Да
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="rounded-md px-2.5 py-1 text-[12px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    Нет
                  </button>
                </div>
              ) : (
                <span className="tooltip-trigger relative inline-flex">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    aria-label="Сбросить к оригинальной версии"
                    className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                  <span className="tooltip-content mb-2.5 w-auto whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-[12px] font-normal text-background shadow-lg dark:bg-[oklch(25%_0.025_260)] dark:text-[oklch(90%_0.01_264)]">
                    Сбросить
                  </span>
                </span>
              )}
            </>
          )}

          {/* Copy */}
          <span className="tooltip-trigger relative inline-flex">
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Текст скопирован' : 'Копировать текст'}
              className={`flex size-8 items-center justify-center rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                copied
                  ? 'text-success'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {copied ? (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              )}
            </button>
            <span className="tooltip-content mb-2.5 w-auto whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-[12px] font-normal text-background shadow-lg dark:bg-[oklch(25%_0.025_260)] dark:text-[oklch(90%_0.01_264)]">
              {copied ? 'Скопировано' : 'Копировать'}
            </span>
          </span>

          {/* Download Dropdown */}
          <div ref={downloadRef} className="relative">
            <span className="tooltip-trigger relative inline-flex">
              <button
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                aria-label="Скачать документ"
                aria-expanded={downloadMenuOpen}
                aria-haspopup="menu"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
              {!downloadMenuOpen && (
                <span className="tooltip-content mb-2.5 w-auto whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-[12px] font-normal text-background shadow-lg dark:bg-[oklch(25%_0.025_260)] dark:text-[oklch(90%_0.01_264)]">
                  Скачать
                </span>
              )}
            </span>

            {downloadMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDownloadMenuOpen(false)} />
                <div className="dropdown-enter absolute right-0 top-full z-20 mt-1.5 w-48 overflow-hidden rounded-lg border border-border bg-card p-1 shadow-lg" role="menu">
                  {!hasChanges && (
                    <button
                      onClick={handleDownloadMarkdown}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
                    >
                      <span className="text-[13px] font-medium text-foreground">.md</span>
                      <span className="text-[12px] text-muted-foreground">Markdown</span>
                    </button>
                  )}
                  <button
                    onClick={handleDownloadHTML}
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
                  >
                    <span className="text-[13px] font-medium text-foreground">.html</span>
                    <span className="text-[12px] text-muted-foreground">HTML страница</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Document Content — single container, contentEditable in edit mode */}
      <div
        className={`overflow-hidden rounded-xl border transition-all duration-300 ${
          viewMode === 'edit'
            ? 'border-foreground/20 ring-1 ring-foreground/10'
            : 'border-border'
        }`}
        role="document"
        aria-label={viewMode === 'edit' ? 'Редактор документа' : 'Предпросмотр политики cookie'}
      >
        <div
          ref={contentRef}
          onInput={viewMode === 'edit' ? handleInput : undefined}
          suppressContentEditableWarning
          className={`doc-content px-5 py-6 outline-none sm:px-8 sm:py-8 ${
            viewMode === 'edit' ? 'cursor-text' : ''
          }`}
        >
          {editedHtml === null ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {generatedMarkdown}
            </ReactMarkdown>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: editedHtml }} />
          )}
        </div>
      </div>

      {/* Edit mode hint */}
      {viewMode === 'edit' && (
        <p className="mode-crossfade-enter mt-3 text-[12px] text-muted-foreground/60">
          Кликните на текст для редактирования. Изменения сохраняются автоматически.
        </p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   Markdown Component Mappings
   ───────────────────────────────────────── */
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-[24px] font-semibold tracking-tight text-foreground mb-4 mt-6 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-[20px] font-semibold tracking-tight text-foreground mb-3 mt-6">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-[17px] font-semibold tracking-tight text-foreground mb-2 mt-5">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[15px] leading-relaxed text-foreground mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-2 mb-4 pl-6 list-disc marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="space-y-2 mb-4 pl-6 list-decimal marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-[15px] leading-relaxed text-foreground">
      {children}
    </li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground mb-4">
      {children}
    </blockquote>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-foreground">
      {children}
    </em>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline decoration-muted-foreground hover:decoration-foreground transition-colors"
    >
      {children}
    </a>
  ),
}
