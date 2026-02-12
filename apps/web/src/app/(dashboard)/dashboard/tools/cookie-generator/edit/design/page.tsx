'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Palette } from 'lucide-react'
import { useCurrentProject } from '@/lib/hooks/use-current-project'
import { useWidget } from '@/lib/hooks/use-widget'
import { useProjects } from '@/lib/hooks/use-projects'
import { useSiteScreenshot } from '@/lib/hooks/use-site-screenshot'
import { EditorHeader } from '@/components/dashboard/editor-header'
import { BannerPreview } from '@/app/(tools)/tools/cookie-generator/components'
import { type BannerCustomization } from '@/app/(tools)/tools/cookie-generator/components/liquid-glass-island'

export default function DesignEditorPage() {
  const { projects, isLoading: projectsLoading } = useProjects()
  const { projectId, project } = useCurrentProject()
  const { widget, config, isLoading: widgetLoading, updateConfig, isSaving } = useWidget(projectId)

  const [isDirty, setIsDirty] = useState(false)
  const [customization, setCustomization] = useState<BannerCustomization | null>(null)
  const snapshotRef = useRef<BannerCustomization | null>(null)

  // Screenshot for background
  const domain = project?.domain || config?.cookieConfig.company.website || ''
  const { screenshotUrl, isLoading: isScreenshotLoading } = useSiteScreenshot(domain)

  // Initialize customization from loaded config
  useEffect(() => {
    if (config && !customization) {
      setCustomization(config.bannerCustomization)
      snapshotRef.current = structuredClone(config.bannerCustomization)
    }
  }, [config, customization])

  const handleCustomizationChange = useCallback((next: BannerCustomization) => {
    setCustomization(next)
    setIsDirty(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (!customization) return

    try {
      await updateConfig({ bannerCustomization: customization })
      setIsDirty(false)
      // Update snapshot after save
      snapshotRef.current = structuredClone(customization)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }, [updateConfig, customization])

  const handleReset = useCallback(() => {
    if (snapshotRef.current) {
      setCustomization(structuredClone(snapshotRef.current))
      setIsDirty(false)
    }
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
        <div className="flex items-center justify-center p-8">
          <div className="h-[500px] w-full max-w-3xl animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    )
  }

  // No widget found
  if (!widget || !config || !customization) {
    return (
      <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-8">
        <EditorHeader
          title="Редактирование дизайна"
          backHref="/dashboard/tools/cookie-generator"
          backLabel="Плашка cookies"
          onSave={() => {}}
          onReset={() => {}}
          isSaving={false}
          isDirty={false}
        />
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <Palette className="mb-4 size-10 text-muted-foreground/30" strokeWidth={1} />
          <h2 className="text-[15px] font-medium text-foreground">
            Нет настроенной плашки cookies
          </h2>
          <p className="mt-2 max-w-sm text-[13px] text-muted-foreground">
            Сначала создайте плашку cookies, чтобы редактировать дизайн баннера.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-8">
      <EditorHeader
        title="Редактирование дизайна"
        backHref="/dashboard/tools/cookie-generator"
        backLabel="Плашка cookies"
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        isDirty={isDirty}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <BannerPreview
              config={config.cookieConfig}
              screenshotUrl={screenshotUrl}
              isScreenshotLoading={isScreenshotLoading}
              customization={customization}
              onCustomizationChange={handleCustomizationChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
