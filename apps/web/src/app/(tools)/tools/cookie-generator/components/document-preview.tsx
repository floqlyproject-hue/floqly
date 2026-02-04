'use client'

import { useMemo, useState } from 'react'
import type { CookieConfig } from '../types'
import { generateDetailedText } from '../templates'

interface DocumentPreviewProps {
  config: CookieConfig
}

export function DocumentPreview({ config }: DocumentPreviewProps) {
  const [copied, setCopied] = useState(false)

  const documentText = useMemo(() => {
    return generateDetailedText(config)
  }, [config])

  // Convert markdown to simple HTML for preview
  const htmlContent = useMemo(() => {
    return documentText
      .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-foreground mt-6 mb-3 first:mt-0">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-sm font-medium text-foreground mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="text-sm text-muted-foreground mb-3 leading-relaxed">')
      .replace(/^/, '<p class="text-sm text-muted-foreground mb-3 leading-relaxed">')
      .replace(/$/, '</p>')
  }, [documentText])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(documentText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([documentText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cookie-policy.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isEmpty = !config.company.name

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary ring-1 ring-primary/10">
          5
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">Полный текст документа</h3>
          <p className="text-sm text-muted-foreground">Политика использования cookie</p>
        </div>
      </div>

      {isEmpty ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/60">
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
          <div className="overflow-hidden rounded-2xl border border-border/60">
            {/* Header with Actions */}
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    className="size-4 text-primary"
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
                <div>
                  <span className="text-sm font-medium text-foreground">cookie-policy.md</span>
                  <span className="ml-2 text-xs text-muted-foreground">Markdown</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  aria-label="Копировать текст документа"
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
                <button
                  onClick={handleDownload}
                  aria-label="Скачать документ"
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Скачать
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div
              className="max-h-80 overflow-y-auto bg-background p-5"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

          {/* Info Card */}
          <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/[0.04] p-4">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Этот текст можно использовать как <span className="font-medium text-foreground">отдельную страницу</span> политики cookie на вашем сайте.
              Формат Markdown поддерживается большинством CMS.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
