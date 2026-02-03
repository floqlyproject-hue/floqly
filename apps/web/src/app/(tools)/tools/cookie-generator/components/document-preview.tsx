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
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-foreground mt-6 mb-3 first:mt-0">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-medium text-foreground mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="text-sm text-muted-foreground mb-3">')
      .replace(/^/, '<p class="text-sm text-muted-foreground mb-3">')
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          5
        </div>
        Полный текст документа
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <svg
            className="mx-auto size-12 text-muted-foreground/50"
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
          <h3 className="mt-4 text-sm font-medium text-foreground">
            Документ будет сгенерирован автоматически
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Заполните информацию о компании на первом шаге
          </p>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-border bg-card/50 p-4">
          {/* Actions */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <svg
                className="size-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium text-foreground">
                Политика использования cookie
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {copied ? (
                  <>
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Скопировано
                  </>
                ) : (
                  <>
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Копировать
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Скачать .md
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div
            className="prose prose-sm max-h-96 max-w-none overflow-y-auto rounded-lg bg-background p-4 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Info */}
          <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 p-3 text-xs text-blue-700 dark:text-blue-400">
            <svg className="mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Этот текст можно использовать как отдельную страницу политики cookie на вашем сайте.
              Формат Markdown — вставьте в любой редактор или CMS.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
