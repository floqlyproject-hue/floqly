'use client'

import { useState, useCallback } from 'react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: 'document' | 'dialog'
  status: 'uploading' | 'processing' | 'ready' | 'error'
  progress?: number
}

export default function CompanyDataPage() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isResearching, setIsResearching] = useState(false)
  const [documents, setDocuments] = useState<UploadedFile[]>([])
  const [dialogs, setDialogs] = useState<UploadedFile[]>([])
  const [dragOverDocuments, setDragOverDocuments] = useState(false)
  const [dragOverDialogs, setDragOverDialogs] = useState(false)

  const handleStartResearch = useCallback(() => {
    if (!websiteUrl.trim()) return
    setIsResearching(true)
    // TODO: Implement actual website research
    setTimeout(() => setIsResearching(false), 3000)
  }, [websiteUrl])

  const handleDrop = useCallback((
    e: React.DragEvent,
    type: 'document' | 'dialog'
  ) => {
    e.preventDefault()
    if (type === 'document') {
      setDragOverDocuments(false)
    } else {
      setDragOverDialogs(false)
    }

    const files = Array.from(e.dataTransfer.files)
    const newFiles: UploadedFile[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      type,
      status: 'ready' as const,
    }))

    if (type === 'document') {
      setDocuments(prev => [...prev, ...newFiles])
    } else {
      setDialogs(prev => [...prev, ...newFiles])
    }
  }, [])

  const handleFileInput = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'document' | 'dialog'
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    const newFiles: UploadedFile[] = files.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      type,
      status: 'ready' as const,
    }))

    if (type === 'document') {
      setDocuments(prev => [...prev, ...newFiles])
    } else {
      setDialogs(prev => [...prev, ...newFiles])
    }
    e.target.value = ''
  }, [])

  const removeFile = useCallback((id: string, type: 'document' | 'dialog') => {
    if (type === 'document') {
      setDocuments(prev => prev.filter(f => f.id !== id))
    } else {
      setDialogs(prev => prev.filter(f => f.id !== id))
    }
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} Б`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Данные компании
        </h1>
        <p className="mt-2 text-muted-foreground">
          Загрузите информацию о вашем бизнесе, чтобы Умный виджет отвечал клиентам точно и по делу
        </p>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Зачем это нужно?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Умный виджет использует эти данные, чтобы отвечать на вопросы клиентов.
              Чем больше информации вы загрузите — тем точнее и полезнее будут ответы.
              Виджет научится говорить так, как это принято у вас в компании.
            </p>
          </div>
        </div>
      </div>

      {/* Website Research Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-success/10">
            <svg className="size-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Исследование сайта</h2>
            <p className="text-sm text-muted-foreground">Автоматически соберём информацию с вашего сайта</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="size-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.ru"
                className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={handleStartResearch}
              disabled={!websiteUrl.trim() || isResearching}
              className="flex items-center justify-center gap-2 rounded-xl bg-success px-6 py-3 font-medium text-success-foreground transition-all hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResearching ? (
                <>
                  <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Исследую...
                </>
              ) : (
                <>
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Исследовать сайт
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Мы проанализируем все страницы, соберём информацию об услугах, ценах и контактах
          </p>
        </div>
      </section>

      {/* Documents Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Документы компании</h2>
            <p className="text-sm text-muted-foreground">Прайсы, КП, описания услуг, FAQ — всё, что поможет виджету</p>
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverDocuments(true) }}
          onDragLeave={() => setDragOverDocuments(false)}
          onDrop={(e) => handleDrop(e, 'document')}
          className={`relative rounded-2xl border-2 border-dashed p-8 transition-all ${
            dragOverDocuments
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:border-primary/50'
          }`}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv"
            onChange={(e) => handleFileInput(e, 'document')}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`flex size-14 items-center justify-center rounded-2xl transition-colors ${
              dragOverDocuments ? 'bg-primary/20' : 'bg-muted'
            }`}>
              <svg className={`size-7 ${dragOverDocuments ? 'text-primary' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">
                Перетащите файлы сюда или <span className="text-primary">выберите</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF, Word, Excel, TXT — до 25 МБ каждый
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileIcon name={file.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    Загружено
                  </span>
                  <button
                    onClick={() => removeFile(file.id, 'document')}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Document Types Hint */}
        <div className="flex flex-wrap gap-2">
          {['Прайс-лист', 'Коммерческое предложение', 'FAQ', 'Каталог', 'Условия работы'].map((type) => (
            <span
              key={type}
              className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground"
            >
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* Dialogs Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10">
            <svg className="size-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Примеры диалогов</h2>
            <p className="text-sm text-muted-foreground">Скриншоты переписок с клиентами — виджет научится вашему стилю общения</p>
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverDialogs(true) }}
          onDragLeave={() => setDragOverDialogs(false)}
          onDrop={(e) => handleDrop(e, 'dialog')}
          className={`relative rounded-2xl border-2 border-dashed p-8 transition-all ${
            dragOverDialogs
              ? 'border-warning bg-warning/5'
              : 'border-border bg-card hover:border-warning/50'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileInput(e, 'dialog')}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`flex size-14 items-center justify-center rounded-2xl transition-colors ${
              dragOverDialogs ? 'bg-warning/20' : 'bg-muted'
            }`}>
              <svg className={`size-7 ${dragOverDialogs ? 'text-warning' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">
                Загрузите скриншоты переписок
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PNG, JPG — любые диалоги с клиентами из мессенджеров, почты, соцсетей
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Dialogs */}
        {dialogs.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2">
            {dialogs.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-warning/30"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                  <svg className="size-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(file.id, 'dialog')}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dialog Hint */}
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
          <div className="flex gap-3">
            <svg className="size-5 shrink-0 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Совет:</span> Загружайте удачные диалоги,
              где вы хорошо ответили на вопросы клиента. Виджет будет использовать похожую риторику и стиль.
            </p>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground">Загружено данных</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
                <svg className="size-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{websiteUrl ? 1 : 0}</p>
                <p className="text-sm text-muted-foreground">Сайтов</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Документов</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
                <svg className="size-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{dialogs.length}</p>
                <p className="text-sm text-muted-foreground">Диалогов</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            disabled={documents.length === 0 && dialogs.length === 0 && !websiteUrl}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Сохранить данные
          </button>
        </div>
      </section>
    </div>
  )
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') {
    return (
      <svg className="size-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    )
  }

  if (ext === 'doc' || ext === 'docx') {
    return (
      <svg className="size-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    )
  }

  if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') {
    return (
      <svg className="size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    )
  }

  return (
    <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}
