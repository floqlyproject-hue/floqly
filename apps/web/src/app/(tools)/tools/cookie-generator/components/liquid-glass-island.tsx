'use client'

import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Palette, Sparkles, Type, LayoutTemplate, X } from 'lucide-react'
import {
  DesignPanel, AnimationPanel, TextPanel, PositionPanel,
  type TextState, type DesignState, type PositionState, type AnimationState,
} from './island-panels'

type PanelId = 'text' | 'design' | 'position' | 'animation'

export interface BannerCustomization {
  text: TextState
  design: DesignState
  position: PositionState
  animation: AnimationState
}

const ISLAND_CATEGORIES: {
  id: PanelId
  label: string
  icon: typeof Palette
}[] = [
  { id: 'text', label: 'Текст', icon: Type },
  { id: 'design', label: 'Стиль', icon: Palette },
  { id: 'position', label: 'Позиция', icon: LayoutTemplate },
  { id: 'animation', label: 'Анимация', icon: Sparkles },
]

const SPRING = { type: 'spring' as const, stiffness: 350, damping: 30 }

interface LiquidGlassIslandProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  customization: BannerCustomization
  onCustomizationChange: (next: BannerCustomization) => void
  /** Hide text panel (text is edited on Content tab of Step4Editor) */
  hideTextPanel?: boolean
}

export function LiquidGlassIsland({
  containerRef,
  customization,
  onCustomizationChange,
  hideTextPanel,
}: LiquidGlassIslandProps) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null)
  const isExpanded = activePanel !== null

  // Filter out text panel when hideTextPanel is true
  const visibleCategories = hideTextPanel
    ? ISLAND_CATEGORIES.filter((c) => c.id !== 'text')
    : ISLAND_CATEGORIES
  const activeCategory = visibleCategories.find((c) => c.id === activePanel)

  function handleIconClick(id: PanelId) {
    setActivePanel((prev) => (prev === id ? null : id))
  }

  function handleDotClick(id: PanelId) {
    setActivePanel(id)
  }

  function renderPanel(panelId: PanelId) {
    switch (panelId) {
      case 'text':
        return (
          <TextPanel
            value={customization.text}
            onChange={(next) => onCustomizationChange({ ...customization, text: next })}
          />
        )
      case 'design':
        return (
          <DesignPanel
            value={customization.design}
            onChange={(next) => onCustomizationChange({ ...customization, design: next })}
          />
        )
      case 'position':
        return (
          <PositionPanel
            value={customization.position}
            onChange={(next) => onCustomizationChange({ ...customization, position: next })}
          />
        )
      case 'animation':
        return (
          <AnimationPanel
            value={customization.animation}
            onChange={(next) => onCustomizationChange({ ...customization, animation: next })}
          />
        )
    }
  }

  return (
    <>
      {/* Hidden SVG filter — glass distortion */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="liquid-glass-distortion"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves={1}
              seed={5}
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation={2} result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale={25}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Draggable island with morph */}
      <LayoutGroup>
        <motion.div
          drag
          dragConstraints={containerRef}
          dragMomentum={false}
          dragElastic={0.05}
          whileDrag={{ scale: 1.04, cursor: 'grabbing' }}
          layout="size"
          className="liquid-glass absolute left-4 top-1/2 z-20 -translate-y-1/2"
          style={{ cursor: 'grab', touchAction: 'none' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            layout: SPRING,
            opacity: { delay: 0.15, duration: 0.3 },
            scale: { delay: 0.15, duration: 0.3 },
          }}
        >
          {/* Glass layers */}
          <div className="liquid-glass-effect" />
          <div className="liquid-glass-tint" />
          <div className="liquid-glass-shine" />

          {/* Content */}
          <div className="liquid-glass-content">
            {!isExpanded ? (
              /* ── Collapsed: icon buttons ── */
              <div className="flex flex-col gap-0.5 p-1.5">
                {visibleCategories.map((cat) => (
                  <span key={cat.id} className="tooltip-trigger relative">
                    <motion.button
                      layout
                      type="button"
                      aria-label={cat.label}
                      onClick={() => handleIconClick(cat.id)}
                      className="flex size-9 items-center justify-center rounded-lg text-foreground/70 transition-colors duration-150 hover:bg-white/20 hover:text-foreground dark:text-foreground/60 dark:hover:bg-white/10 dark:hover:text-foreground"
                      transition={{ layout: SPRING }}
                    >
                      <cat.icon className="size-[18px]" strokeWidth={1.75} />
                    </motion.button>
                    <span className="tooltip-content-right ml-1 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background shadow-lg">
                      {cat.label}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              /* ── Expanded: panel ── */
              <div className="w-[240px] p-3">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeCategory && (
                      <activeCategory.icon
                        className="size-4 text-foreground/60"
                        strokeWidth={1.75}
                      />
                    )}
                    <span className="text-[13px] font-semibold text-foreground">
                      {activeCategory?.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePanel(null)}
                    className="flex size-6 items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-white/15 hover:text-foreground"
                    aria-label="Закрыть"
                  >
                    <X className="size-3.5" strokeWidth={2} />
                  </button>
                </div>

                {/* Panel content with AnimatePresence */}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activePanel}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
                  >
                    {renderPanel(activePanel!)}
                  </motion.div>
                </AnimatePresence>

                {/* Dot navigation */}
                <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-foreground/[0.06] pt-3">
                  {visibleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      aria-label={cat.label}
                      onClick={() => handleDotClick(cat.id)}
                      className={`rounded-full transition-all duration-200 ${
                        cat.id === activePanel
                          ? 'size-2 bg-foreground'
                          : 'size-1.5 bg-foreground/25 hover:bg-foreground/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </LayoutGroup>
    </>
  )
}
