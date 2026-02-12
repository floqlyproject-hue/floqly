'use client'

import { useRef, useCallback } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { Globe, Sun, Moon, Upload } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

export type PreviewBackground = 'screenshot' | 'light' | 'dark' | 'custom'

interface BackgroundSwitcherIslandProps {
  activeBackground: PreviewBackground
  onBackgroundChange: (bg: PreviewBackground) => void
  onCustomImageUpload: (url: string) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

const SPRING = { type: 'spring' as const, stiffness: 350, damping: 30 }

const BACKGROUNDS: {
  id: PreviewBackground
  label: string
  icon: typeof Globe
}[] = [
  { id: 'screenshot', label: 'Скриншот сайта', icon: Globe },
  { id: 'light', label: 'Светлый фон', icon: Sun },
  { id: 'dark', label: 'Тёмный фон', icon: Moon },
]

export function BackgroundSwitcherIsland({
  activeBackground,
  onBackgroundChange,
  onCustomImageUpload,
  containerRef,
}: BackgroundSwitcherIslandProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragControls = useDragControls()

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      onCustomImageUpload(url)
      e.target.value = ''
    },
    [onCustomImageUpload]
  )

  const startDrag = useCallback((e: React.PointerEvent) => {
    dragControls.start(e)
  }, [dragControls])

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={containerRef}
        dragMomentum={false}
        dragElastic={0.05}
        whileDrag={{ scale: 1.06 }}
        className="liquid-glass absolute right-5 top-3 z-20"
        style={{ touchAction: 'none' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          layout: SPRING,
          opacity: { delay: 0.25, duration: 0.3 },
          scale: { delay: 0.25, duration: 0.3 },
        }}
      >
        {/* Glass layers — tint + shine only, NO liquid-glass-effect (SVG filter causes artifacts on small elements) */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit] backdrop-blur-md" />
        <div className="liquid-glass-tint" />
        <div className="liquid-glass-shine" />

        {/* Content — entire bar is drag handle, buttons stop propagation */}
        <div className="liquid-glass-content">
          <div
            className="flex cursor-grab items-center gap-0.5 p-1 active:cursor-grabbing"
            onPointerDown={startDrag}
          >
            {BACKGROUNDS.map((bg) => {
              const isActive = activeBackground === bg.id

              return (
                <Tooltip key={bg.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={bg.label}
                      onClick={() => onBackgroundChange(bg.id)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={`flex size-7 items-center justify-center rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 ${
                        isActive
                          ? 'bg-white/30 text-foreground dark:bg-white/15'
                          : 'text-foreground/60 hover:bg-white/20 hover:text-foreground dark:text-foreground/50 dark:hover:bg-white/10 dark:hover:text-foreground'
                      }`}
                    >
                      <bg.icon className="size-[14px]" strokeWidth={1.75} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8} className="text-[10px]">
                    {bg.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}

            {/* Divider */}
            <Separator orientation="vertical" className="mx-0.5 h-4 bg-foreground/10" />

            {/* Upload button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Загрузить свой скриншот"
                  onClick={handleUploadClick}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`flex size-7 items-center justify-center rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 ${
                    activeBackground === 'custom'
                      ? 'bg-white/30 text-foreground dark:bg-white/15'
                      : 'text-foreground/60 hover:bg-white/20 hover:text-foreground dark:text-foreground/50 dark:hover:bg-white/10 dark:hover:text-foreground'
                  }`}
                >
                  <Upload className="size-[14px]" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8} className="max-w-[200px]">
                <p className="text-[10px] font-medium">Загрузить скриншот</p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  PNG, JPG или WebP · 16:10
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
