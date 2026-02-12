'use client'

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import {
  Eye, Pen, Copy, Check, Download, RotateCcw,
  Bold, Italic, Strikethrough, List, ListOrdered, Link, HelpCircle, X,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { CookieConfig } from '../types'
import { generateCookiePolicy, type CookiePolicyData } from '@/lib/templates/cookie-policy'

interface DocumentPreviewProps {
  config: CookieConfig
  cookiePolicyData: Partial<CookiePolicyData>
  /** Pre-generated markdown (from parent) — avoids double generation */
  markdown?: string
  /** Callback when user edits content in the editor (returns innerHTML) */
  onContentChange?: (html: string) => void
}

type ViewMode = 'preview' | 'edit'

/* ─────────────────────────────────────────
   Formatting Toolbar Button
   ───────────────────────────────────────── */
interface ToolbarBtnProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  isActive?: boolean
}

function ToolbarBtn({ icon, label, onClick, isActive }: ToolbarBtnProps) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault() // prevent stealing focus from contentEditable
        onClick()
      }}
      aria-label={label}
      title={label}
      className={`flex size-7 items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isActive
          ? 'bg-foreground/10 text-foreground'
          : 'text-muted-foreground/60 hover:bg-muted hover:text-foreground'
      }`}
    >
      {icon}
    </button>
  )
}

/* ─────────────────────────────────────────
   Tips Popover
   ───────────────────────────────────────── */
const TIPS = [
  'Документ создан автоматически по данным из шагов 1 и 2',
  'Переключитесь в «Редактор» для правки текста',
  'Используйте панель форматирования для жирного, курсива, списков',
  'Скопируйте текст или скачайте файл (.html)',
  'Сброс вернёт документ к оригинальной версии',
]

export function DocumentPreview({
  config,
  cookiePolicyData,
  markdown: externalMarkdown,
  onContentChange,
}: DocumentPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [tipsOpen, setTipsOpen] = useState(false)

  // Track whether user has edited (to show reset button & disable markdown download)
  const [hasEdited, setHasEdited] = useState(false)

  const contentRef = useRef<HTMLDivElement>(null)
  const downloadRef = useRef<HTMLDivElement>(null)
  const tipsRef = useRef<HTMLDivElement>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewBtnRef = useRef<HTMLButtonElement>(null)
  const editorBtnRef = useRef<HTMLButtonElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  // Snapshot HTML when leaving edit mode
  const htmlSnapshotRef = useRef<string | null>(null)
  // Mirror ref value as state for safe render access (react-hooks/refs)
  const [htmlSnapshot, setHtmlSnapshot] = useState<string | null>(null)

  // Use external markdown if provided, otherwise generate internally
  const generatedMarkdown = useMemo(() => {
    if (externalMarkdown) return externalMarkdown
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
  }, [config, cookiePolicyData, externalMarkdown])

  // Reset edited state when source markdown changes — setState during render pattern
  const [prevMarkdown, setPrevMarkdown] = useState(generatedMarkdown)
  if (prevMarkdown !== generatedMarkdown) {
    setPrevMarkdown(generatedMarkdown)
    setHtmlSnapshot(null)
    setHasEdited(false)
  }

  // Sync ref with state (ref used in effects/callbacks, state for render)
  useEffect(() => {
    if (htmlSnapshot === null) {
      htmlSnapshotRef.current = null
    }
  }, [htmlSnapshot])

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
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  // When switching to edit: make contentEditable + focus
  useEffect(() => {
    if (viewMode === 'edit' && contentRef.current) {
      contentRef.current.contentEditable = 'true'
      // If we have a previous snapshot, restore it
      if (htmlSnapshotRef.current !== null) {
        contentRef.current.innerHTML = htmlSnapshotRef.current
      }
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
    if (!downloadMenuOpen && !tipsOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDownloadMenuOpen(false)
        setTipsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [downloadMenuOpen, tipsOpen])

  // Auto-dismiss reset confirmation after 5s
  useEffect(() => {
    if (showResetConfirm) {
      resetTimerRef.current = setTimeout(() => setShowResetConfirm(false), 5000)
      return () => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      }
    }
  }, [showResetConfirm])

  // Close tips popover on outside click
  useEffect(() => {
    if (!tipsOpen) return
    const handleClick = (e: MouseEvent) => {
      if (tipsRef.current && !tipsRef.current.contains(e.target as Node)) {
        setTipsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [tipsOpen])

  /* ─── Handlers ─── */

  // Track edits via onInput — but DON'T call setState (avoids re-render = cursor fix!)
  const handleInput = useCallback(() => {
    if (contentRef.current) {
      // Only mark as edited, don't store HTML (prevents re-render & cursor jump)
      setHasEdited(true)
      // Notify parent about content change (for save functionality)
      onContentChange?.(contentRef.current.innerHTML)
    }
  }, [onContentChange])

  const handleCopy = useCallback(async () => {
    const text = contentRef.current?.innerText || ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleDownloadMarkdown = useCallback(() => {
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
    htmlSnapshotRef.current = null
    setHtmlSnapshot(null)
    setHasEdited(false)
    setShowResetConfirm(false)
    setViewMode('preview')
  }, [])

  // Switch mode handler — snapshot HTML when leaving edit mode
  const switchMode = useCallback((mode: ViewMode) => {
    if (viewMode === 'edit' && mode === 'preview' && contentRef.current) {
      // Snapshot current DOM before switching to preview
      const snapshot = contentRef.current.innerHTML
      htmlSnapshotRef.current = snapshot
      setHtmlSnapshot(snapshot)
    }
    setViewMode(mode)
  }, [viewMode])

  /* ─── Formatting Commands (execCommand) ─── */
  const execFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    // Mark as edited after formatting
    setHasEdited(true)
  }, [])

  const handleBold = useCallback(() => execFormat('bold'), [execFormat])
  const handleItalic = useCallback(() => execFormat('italic'), [execFormat])
  const handleStrikethrough = useCallback(() => execFormat('strikeThrough'), [execFormat])
  const handleUnorderedList = useCallback(() => execFormat('insertUnorderedList'), [execFormat])
  const handleOrderedList = useCallback(() => execFormat('insertOrderedList'), [execFormat])
  const handleLink = useCallback(() => {
    const url = window.prompt('Введите URL:')
    if (url) execFormat('createLink', url)
  }, [execFormat])

  // Detect active formatting states
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    strikethrough: false,
    unorderedList: false,
    orderedList: false,
  })

  const updateFormatState = useCallback(() => {
    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      strikethrough: document.queryCommandState('strikeThrough'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    })
  }, [])

  // Update format state on selection change
  useEffect(() => {
    if (viewMode !== 'edit') return
    const handler = () => updateFormatState()
    document.addEventListener('selectionchange', handler)
    return () => document.removeEventListener('selectionchange', handler)
  }, [viewMode, updateFormatState])

  // Keyboard shortcuts in edit mode
  useEffect(() => {
    if (viewMode !== 'edit') return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        if (e.key === 'b') { e.preventDefault(); handleBold() }
        if (e.key === 'i') { e.preventDefault(); handleItalic() }
        if (e.key === 'k') { e.preventDefault(); handleLink() }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [viewMode, handleBold, handleItalic, handleLink])

  return (
    <div>
      {/* Section Header */}
      <div className="mb-10 max-w-lg">
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">Текст документа</h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground/70">
          Проверьте и отредактируйте сгенерированную политику cookie
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Mode Toggle with icons */}
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
            className={`relative z-10 flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              viewMode === 'preview'
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="size-3.5" strokeWidth={1.5} />
            Просмотр
          </button>
          <button
            ref={editorBtnRef}
            onClick={() => switchMode('edit')}
            aria-pressed={viewMode === 'edit'}
            className={`relative z-10 flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              viewMode === 'edit'
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Pen className="size-3" strokeWidth={1.5} />
            Редактор
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Reset (inline confirm, only when hasEdited) */}
          {hasEdited && (
            <>
              {showResetConfirm ? (
                <div className="expand-enter mr-1 flex items-center gap-1.5">
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
                    <RotateCcw className="size-4" strokeWidth={1.5} />
                  </button>
                  <span className="tooltip-content mb-2.5 w-auto whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-[12px] font-normal text-background shadow-lg dark:bg-[oklch(25%_0.025_260)] dark:text-[oklch(90%_0.01_264)]">
                    Сбросить
                  </span>
                </span>
              )}
            </>
          )}

          {/* Separator */}
          {hasEdited && (
            <div className="mx-0.5 h-4 w-px bg-border" aria-hidden="true" />
          )}

          {/* Tips */}
          <div ref={tipsRef} className="relative">
            <span className="tooltip-trigger relative inline-flex">
              <button
                onClick={() => setTipsOpen(!tipsOpen)}
                aria-label="Подсказки"
                aria-expanded={tipsOpen}
                className={`flex size-8 items-center justify-center rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  tipsOpen
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <HelpCircle className="size-4" strokeWidth={1.5} />
              </button>
              {!tipsOpen && (
                <span className="tooltip-content mb-2.5 w-auto whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-[12px] font-normal text-background shadow-lg dark:bg-[oklch(25%_0.025_260)] dark:text-[oklch(90%_0.01_264)]">
                  Подсказки
                </span>
              )}
            </span>

            {tipsOpen && (
              <div className="dropdown-enter absolute right-0 top-full z-20 mt-1.5 w-72 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/70">
                    Подсказки
                  </h4>
                  <button
                    onClick={() => setTipsOpen(false)}
                    className="flex size-5 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:text-foreground"
                    aria-label="Закрыть"
                  >
                    <X className="size-3" strokeWidth={2} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {TIPS.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted-foreground">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/20" aria-hidden="true" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Copy */}
          <span className="tooltip-trigger relative inline-flex">
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Текст скопирован' : 'Копировать текст'}
              className={`flex size-8 items-center justify-center rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                copied
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {copied ? (
                <Check className="size-4" strokeWidth={2} />
              ) : (
                <Copy className="size-4" strokeWidth={1.5} />
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
                <Download className="size-4" strokeWidth={1.5} />
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
                  {!hasEdited && (
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

      {/* Formatting Toolbar — only in edit mode */}
      {viewMode === 'edit' && (
        <div className="mode-crossfade-enter mb-3 flex items-center gap-0.5 rounded-lg border border-border bg-card/60 px-1.5 py-1">
          <ToolbarBtn
            icon={<Bold className="size-3.5" strokeWidth={2} />}
            label="Жирный (Ctrl+B)"
            onClick={handleBold}
            isActive={formatState.bold}
          />
          <ToolbarBtn
            icon={<Italic className="size-3.5" strokeWidth={2} />}
            label="Курсив (Ctrl+I)"
            onClick={handleItalic}
            isActive={formatState.italic}
          />
          <ToolbarBtn
            icon={<Strikethrough className="size-3.5" strokeWidth={2} />}
            label="Зачёркнутый"
            onClick={handleStrikethrough}
            isActive={formatState.strikethrough}
          />

          <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

          <ToolbarBtn
            icon={<List className="size-3.5" strokeWidth={2} />}
            label="Маркированный список"
            onClick={handleUnorderedList}
            isActive={formatState.unorderedList}
          />
          <ToolbarBtn
            icon={<ListOrdered className="size-3.5" strokeWidth={2} />}
            label="Нумерованный список"
            onClick={handleOrderedList}
            isActive={formatState.orderedList}
          />

          <div className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

          <ToolbarBtn
            icon={<Link className="size-3.5" strokeWidth={2} />}
            label="Ссылка (Ctrl+K)"
            onClick={handleLink}
          />

          <div className="ml-auto text-[11px] text-muted-foreground/40">
            Ctrl+B · Ctrl+I · Ctrl+K
          </div>
        </div>
      )}

      {/* Document Content — paper-like container */}
      <div
        className={`overflow-hidden rounded-xl border transition-all duration-300 ${
          viewMode === 'edit'
            ? 'border-foreground/20 shadow-sm ring-2 ring-foreground/5'
            : 'border-border shadow-[0_1px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.2)]'
        }`}
        role="document"
        aria-label={viewMode === 'edit' ? 'Редактор документа' : 'Предпросмотр политики cookie'}
      >
        {/* Edit mode indicator bar */}
        <div
          className={`h-0.5 w-full transition-all duration-300 ${
            viewMode === 'edit' ? 'bg-foreground/20' : 'bg-transparent'
          }`}
        />

        <div
          ref={contentRef}
          onInput={viewMode === 'edit' ? handleInput : undefined}
          suppressContentEditableWarning
          className={`doc-content px-5 py-6 outline-none sm:px-8 sm:py-8 ${
            viewMode === 'edit' ? 'cursor-text' : ''
          }`}
        >
          {/*
            Key insight for cursor bug fix:
            In preview mode → render ReactMarkdown (static)
            In edit mode → contentEditable manages its own DOM, no React re-renders
            We only re-render when switching modes, not on every keystroke
          */}
          {viewMode === 'preview' && htmlSnapshot ? (
            <div dangerouslySetInnerHTML={{ __html: htmlSnapshot }} />
          ) : viewMode === 'preview' ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {generatedMarkdown}
            </ReactMarkdown>
          ) : (
            /* In edit mode: initial render only, then contentEditable takes over */
            !htmlSnapshot ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {generatedMarkdown}
              </ReactMarkdown>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: htmlSnapshot }} />
            )
          )}
        </div>
      </div>

      {/* Edit mode hint */}
      {viewMode === 'edit' && (
        <p className="mode-crossfade-enter mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground/60">
          <Pen className="size-3" strokeWidth={1.5} />
          Кликните на текст для редактирования. Изменения сохраняются автоматически.
        </p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   Helpers
   ───────────────────────────────────────── */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\wа-яёА-ЯЁ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

/* ─────────────────────────────────────────
   Markdown Component Mappings — with anchor IDs
   ───────────────────────────────────────── */
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => {
    const text = typeof children === 'string' ? children : getTextContent(children)
    return (
      <h1 id={slugify(text)} className="mb-4 mt-6 scroll-mt-24 text-[24px] font-semibold tracking-tight text-foreground first:mt-0">
        {children}
      </h1>
    )
  },
  h2: ({ children }: { children?: React.ReactNode }) => {
    const text = typeof children === 'string' ? children : getTextContent(children)
    return (
      <h2 id={slugify(text)} className="mb-3 mt-8 scroll-mt-24 border-t border-border/40 pt-4 text-[20px] font-semibold tracking-tight text-foreground first:border-0 first:pt-0">
        {children}
      </h2>
    )
  },
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-2 mt-5 text-[17px] font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 text-[15px] leading-relaxed text-foreground/90">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 space-y-2 pl-6 list-disc marker:text-muted-foreground/40">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 space-y-2 pl-6 list-decimal marker:text-muted-foreground/40">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-[15px] leading-relaxed text-foreground/90">
      {children}
    </li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-4 border-l-4 border-border pl-4 italic text-muted-foreground">
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
      className="text-foreground underline decoration-muted-foreground transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  ),
}

/** Recursively extract text content from React children */
function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    const el = children as React.ReactElement<{ children?: React.ReactNode }>
    return getTextContent(el.props.children)
  }
  return ''
}
