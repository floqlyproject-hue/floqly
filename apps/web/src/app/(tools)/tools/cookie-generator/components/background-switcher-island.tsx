'use client'

import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Globe, Sun, Moon, Upload } from 'lucide-react'

export type PreviewBackground = 'screenshot' | 'light' | 'dark' | 'custom'

interface BackgroundSwitcherIslandProps {
  activeBackground: PreviewBackground
  onBackgroundChange: (bg: PreviewBackground) => void
  onCustomImageUpload: (url: string) => void
  hasScreenshot: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

const SPRING = { type: 'spring' as const, stiffness: 350, damping: 30 }

const BACKGROUNDS: {
  id: PreviewBackground
  label: string
  icon: typeof Globe
}[] = [
  { id: 'screenshot', label: 'Скриншот вашего сайта', icon: Globe },
  { id: 'light', label: 'Чистый светлый фон', icon: Sun },
  { id: 'dark', label: 'Чистый тёмный фон', icon: Moon },
]

export function BackgroundSwitcherIsland({
  activeBackground,
  onBackgroundChange,
  onCustomImageUpload,
  hasScreenshot,
  containerRef,
}: BackgroundSwitcherIslandProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      onCustomImageUpload(url)
      // Reset input so the same file can be re-uploaded
      e.target.value = ''
    },
    [onCustomImageUpload]
  )

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      dragElastic={0.05}
      whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
      className="liquid-glass absolute right-5 top-3 z-20"
      style={{ cursor: 'grab', touchAction: 'none' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        layout: SPRING,
        opacity: { delay: 0.25, duration: 0.3 },
        scale: { delay: 0.25, duration: 0.3 },
      }}
    >
      {/* Glass layers */}
      <div className="liquid-glass-effect" />
      <div className="liquid-glass-tint" />
      <div className="liquid-glass-shine" />

      {/* Content */}
      <div className="liquid-glass-content">
        <div className="flex items-center gap-0.5 p-1">
          {BACKGROUNDS.map((bg) => {
            const isActive = activeBackground === bg.id
            const isDisabled = bg.id === 'screenshot' && !hasScreenshot

            return (
              <span key={bg.id} className="tooltip-trigger relative">
                <button
                  type="button"
                  disabled={isDisabled}
                  aria-label={bg.label}
                  onClick={() => onBackgroundChange(bg.id)}
                  className={`flex size-7 items-center justify-center rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-white/30 text-foreground dark:bg-white/15'
                      : isDisabled
                        ? 'cursor-not-allowed text-foreground/25 dark:text-foreground/20'
                        : 'text-foreground/60 hover:bg-white/20 hover:text-foreground dark:text-foreground/50 dark:hover:bg-white/10 dark:hover:text-foreground'
                  }`}
                >
                  <bg.icon className="size-[14px]" strokeWidth={1.75} />
                </button>
                <span className="tooltip-content-bottom whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[10px] font-medium text-background shadow-lg">
                  {isDisabled ? 'Введите домен на шаге 1' : bg.label}
                </span>
              </span>
            )
          })}

          {/* Divider */}
          <div className="mx-0.5 h-4 w-px bg-foreground/10" />

          {/* Upload button */}
          <span className="tooltip-trigger relative">
            <button
              type="button"
              aria-label="Загрузить свой скриншот"
              onClick={handleUploadClick}
              className={`flex size-7 items-center justify-center rounded-md transition-colors duration-150 ${
                activeBackground === 'custom'
                  ? 'bg-white/30 text-foreground dark:bg-white/15'
                  : 'text-foreground/60 hover:bg-white/20 hover:text-foreground dark:text-foreground/50 dark:hover:bg-white/10 dark:hover:text-foreground'
              }`}
            >
              <Upload className="size-[14px]" strokeWidth={1.75} />
            </button>
            <span className="tooltip-content-bottom whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[10px] font-medium text-background shadow-lg">
              Загрузить свой скриншот
            </span>
          </span>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </motion.div>
  )
}
