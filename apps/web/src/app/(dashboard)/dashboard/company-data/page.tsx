'use client'

import { useState, useCallback } from 'react'
import { Globe, FileText, MessageSquare, Upload, X, Search, Lightbulb } from 'lucide-react'

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

  const totalFiles = documents.length + dialogs.length
  const hasData = totalFiles > 0 || !!websiteUrl

  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-12">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Данные компании
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
          Загрузите информацию о бизнесе — виджет будет отвечать клиентам точно и по делу
        </p>
      </div>

      {/* ─── Section 1: Website ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-[14px] font-medium text-foreground">Сайт компании</h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-[13px] text-muted-foreground">
            Укажите адрес — мы проанализируем страницы и соберём информацию об услугах, ценах и контактах
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.ru"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none"
              />
            </div>
            <button
              onClick={handleStartResearch}
              disabled={!websiteUrl.trim() || isResearching}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isResearching ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  Анализирую...
                </>
              ) : (
                <>
                  <Search className="size-3.5" strokeWidth={2} />
                  Исследовать
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Documents ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <FileText className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-[14px] font-medium text-foreground">Документы</h2>
          {documents.length > 0 && (
            <span className="text-[12px] text-muted-foreground">{documents.length}</span>
          )}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverDocuments(true) }}
          onDragLeave={() => setDragOverDocuments(false)}
          onDrop={(e) => handleDrop(e, 'document')}
          className={`relative rounded-xl border border-dashed p-6 transition-colors ${
            dragOverDocuments
              ? 'border-foreground/30 bg-muted/60'
              : 'border-border bg-card hover:border-foreground/15'
          }`}
        >
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.csv"
            onChange={(e) => handleFileInput(e, 'document')}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className={`size-5 ${dragOverDocuments ? 'text-foreground' : 'text-muted-foreground/40'}`} strokeWidth={1.5} />
            <div>
              <p className="text-[13px] text-foreground">
                Перетащите файлы или <span className="font-medium underline underline-offset-2 decoration-foreground/20">выберите</span>
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                PDF, Word, Excel, TXT — до 25 МБ
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded documents list */}
        {documents.length > 0 && (
          <div className="space-y-1.5">
            {documents.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5"
              >
                <FileTypeIcon name={file.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(file.id, 'document')}
                  className="rounded-md p-1 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-destructive"
                >
                  <X className="size-3.5" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Suggested document types */}
        <div className="flex flex-wrap gap-1.5">
          {['Прайс-лист', 'КП', 'FAQ', 'Каталог', 'Условия'].map((type) => (
            <span
              key={type}
              className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
            >
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Section 3: Dialog examples ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="text-[14px] font-medium text-foreground">Примеры диалогов</h2>
          {dialogs.length > 0 && (
            <span className="text-[12px] text-muted-foreground">{dialogs.length}</span>
          )}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverDialogs(true) }}
          onDragLeave={() => setDragOverDialogs(false)}
          onDrop={(e) => handleDrop(e, 'dialog')}
          className={`relative rounded-xl border border-dashed p-6 transition-colors ${
            dragOverDialogs
              ? 'border-foreground/30 bg-muted/60'
              : 'border-border bg-card hover:border-foreground/15'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileInput(e, 'dialog')}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className={`size-5 ${dragOverDialogs ? 'text-foreground' : 'text-muted-foreground/40'}`} strokeWidth={1.5} />
            <div>
              <p className="text-[13px] text-foreground">
                Загрузите скриншоты переписок
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                PNG, JPG — диалоги из мессенджеров, почты, соцсетей
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded dialogs list */}
        {dialogs.length > 0 && (
          <div className="grid gap-1.5 sm:grid-cols-2">
            {dialogs.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                  <MessageSquare className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(file.id, 'dialog')}
                  className="rounded-md p-1 text-muted-foreground/40 transition-colors hover:bg-muted hover:text-destructive"
                >
                  <X className="size-3.5" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tip */}
        <div className="flex gap-2.5 rounded-lg bg-muted/50 px-3.5 py-3">
          <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" strokeWidth={1.5} />
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Загружайте удачные диалоги — виджет будет использовать похожий стиль общения
          </p>
        </div>
      </section>

      {/* ─── Summary + Save ─── */}
      <section className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">Сайтов</p>
            <p className="mt-0.5 text-lg font-semibold text-foreground">{websiteUrl ? 1 : 0}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">Документов</p>
            <p className="mt-0.5 text-lg font-semibold text-foreground">{documents.length}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">Диалогов</p>
            <p className="mt-0.5 text-lg font-semibold text-foreground">{dialogs.length}</p>
          </div>
        </div>

        <button
          disabled={!hasData}
          className="rounded-lg bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Сохранить
        </button>
      </section>
    </div>
  )
}

/* ─── File type icon ─── */

function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase() || ''

  let label = 'TXT'
  let bgClass = 'bg-muted'
  let textClass = 'text-muted-foreground'

  if (ext === 'pdf') {
    label = 'PDF'
    bgClass = 'bg-red-500/10'
    textClass = 'text-red-500 dark:text-red-400'
  } else if (ext === 'doc' || ext === 'docx') {
    label = 'DOC'
    bgClass = 'bg-blue-500/10'
    textClass = 'text-blue-500 dark:text-blue-400'
  } else if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') {
    label = 'XLS'
    bgClass = 'bg-green-500/10'
    textClass = 'text-green-500 dark:text-green-400'
  }

  return (
    <div className={`flex size-7 shrink-0 items-center justify-center rounded-md ${bgClass}`}>
      <span className={`text-[9px] font-bold uppercase ${textClass}`}>{label}</span>
    </div>
  )
}
