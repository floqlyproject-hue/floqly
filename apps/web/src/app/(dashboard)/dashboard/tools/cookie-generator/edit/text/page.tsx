'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { useCurrentProject } from '@/lib/hooks/use-current-project'
import { useWidget, type StoredWidgetConfig } from '@/lib/hooks/use-widget'
import { useProjects } from '@/lib/hooks/use-projects'
import { EditorHeader } from '@/components/dashboard/editor-header'
import { DocumentPreview } from '@/app/(tools)/tools/cookie-generator/components'

export default function TextEditorPage() {
  const { projects, isLoading: projectsLoading } = useProjects()
  const { projectId } = useCurrentProject()
  const { widget, config, isLoading: widgetLoading, updateConfig, isSaving } = useWidget(projectId)

  const [isDirty, setIsDirty] = useState(false)
  const editedHtmlRef = useRef<string | null>(null)
  const snapshotRef = useRef<StoredWidgetConfig | null>(null)
  const [resetKey, setResetKey] = useState(0)

  // Take snapshot of original config when first loaded
  useEffect(() => {
    if (config && !snapshotRef.current) {
      snapshotRef.current = structuredClone(config)
    }
  }, [config])

  const handleContentChange = useCallback((html: string) => {
    editedHtmlRef.current = html
    setIsDirty(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (!editedHtmlRef.current) return

    try {
      await updateConfig({ documentHtml: editedHtmlRef.current })
      setIsDirty(false)
      // Update snapshot after save
      if (config) {
        snapshotRef.current = {
          ...config,
          documentHtml: editedHtmlRef.current,
        }
      }
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }, [updateConfig, config])

  const handleReset = useCallback(() => {
    editedHtmlRef.current = null
    setIsDirty(false)
    // Force re-mount DocumentPreview to reset to generated markdown
    setResetKey((k) => k + 1)
  }, [])

  const isLoading = projectsLoading || widgetLoading

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-8">
        <div className="flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="space-y-4">
            <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
            <div className="h-96 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  // No widget found
  if (!widget || !config) {
    return (
      <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-8">
        <EditorHeader
          title="Редактирование текста"
          backHref="/dashboard/tools/cookie-generator"
          backLabel="Плашка cookies"
          onSave={() => {}}
          onReset={() => {}}
          isSaving={false}
          isDirty={false}
        />
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <FileText className="mb-4 size-10 text-muted-foreground/30" strokeWidth={1} />
          <h2 className="text-[15px] font-medium text-foreground">
            Нет настроенной плашки cookies
          </h2>
          <p className="mt-2 max-w-sm text-[13px] text-muted-foreground">
            Сначала создайте плашку cookies, чтобы редактировать текст документа.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-8">
      <EditorHeader
        title="Редактирование текста"
        backHref="/dashboard/tools/cookie-generator"
        backLabel="Плашка cookies"
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        isDirty={isDirty}
      />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <DocumentPreview
          key={resetKey}
          config={config.cookieConfig}
          cookiePolicyData={config.cookiePolicyData}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  )
}
