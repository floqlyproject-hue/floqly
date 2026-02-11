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
}

const BACKGROUNDS: {
  id: PreviewBackground
  label: string
  icon: typeof Globe
}[] = [
  { id: 'screenshot', label: 'Сайт', icon: Globe },
  { id: 'light', label: 'Светлый фон', icon: Sun },
  { id: 'dark', label: 'Тёмный фон', icon: Moon },
]

export function BackgroundSwitcherIsland({
  activeBackground,
  onBackgroundChange,
  onCustomImageUpload,
  hasScreenshot,
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
    <div className="absolute right-3 top-3 z-20">
      <motion.div
        className="liquid-glass"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
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
              // If no screenshot, disable the screenshot button
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
                    {bg.label}
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
                aria-label="Загрузить скриншот"
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
                Загрузить скриншот
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
    </div>
  )
}
