'use client'

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react'
import { motion, useDragControls, AnimatePresence } from 'framer-motion'
import { Palette, Sparkles, Type, LayoutTemplate, X, GripVertical } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
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

/* ── Collapsed size (4 icons stacked vertically) ── */
const COLLAPSED_W = 48
const COLLAPSED_H = 156 // 4×36 icons + 2×6 padding + 3×2 gap

interface LiquidGlassIslandProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  customization: BannerCustomization
  onCustomizationChange: (next: BannerCustomization) => void
  onPlayAnimation?: () => void
}

export function LiquidGlassIsland({
  containerRef,
  customization,
  onCustomizationChange,
  onPlayAnimation,
}: LiquidGlassIslandProps) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null)
  const [lastPanel, setLastPanel] = useState<PanelId>('text') // for pre-measuring
  const dragControls = useDragControls()
  const isExpanded = activePanel !== null
  const activeCategory = ISLAND_CATEGORIES.find((c) => c.id === activePanel)

  /* ── Measure expanded panel height dynamically ── */
  const expandedRef = useRef<HTMLDivElement>(null)
  const [expandedH, setExpandedH] = useState(320)

  // Measure expanded panel height on panel switch (initial measurement)
  useLayoutEffect(() => {
    if (!expandedRef.current) return
    const h = expandedRef.current.scrollHeight
    if (h > 0) setExpandedH(h)
  }, [activePanel])

  // Also observe resize (in case content changes dynamically e.g. color picker expand)
  useEffect(() => {
    if (!expandedRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height + entry.target.scrollTop
        const scrollH = (entry.target as HTMLElement).scrollHeight
        if (scrollH > 0) setExpandedH(scrollH)
      }
    })
    ro.observe(expandedRef.current)
    return () => ro.disconnect()
  }, [activePanel])

  /* ── Handlers ── */
  const handleIconClick = useCallback((id: PanelId) => {
    setActivePanel((prev) => {
      if (prev === id) return null
      setLastPanel(id)
      return id
    })
  }, [])

  const handleDotClick = useCallback((id: PanelId) => {
    setLastPanel(id)
    setActivePanel(id)
  }, [])

  const startDrag = useCallback((e: React.PointerEvent) => {
    dragControls.start(e)
  }, [dragControls])

  /* ── Computed morph dimensions ── */
  const morphW = isExpanded ? 260 : COLLAPSED_W
  const morphH = isExpanded ? expandedH : COLLAPSED_H

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
            onPlay={onPlayAnimation}
          />
        )
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
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

      {/* Draggable island — motion.div only for drag, NO layout animation */}
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={containerRef}
        dragMomentum={false}
        dragElastic={0.05}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2"
        style={{ touchAction: 'none' }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Morphing glass container — size transitions via CSS */}
        <div
          className="liquid-glass"
          style={{
            width: morphW,
            height: morphH,
          }}
        >
          {/* Glass layers */}
          <div className="liquid-glass-effect" />
          <div className="liquid-glass-tint" />
          <div className="liquid-glass-shine" />

          {/* Content — both layers always mounted, visibility via data attrs */}
          <div className="liquid-glass-content">

            {/* ── Layer 1: Collapsed icons ── */}
            <div
              className="island-layer-collapsed"
              data-hidden={isExpanded}
              style={{
                position: isExpanded ? 'absolute' : 'relative',
                top: 0,
                left: 0,
              }}
            >
              <div
                className="flex cursor-grab flex-col gap-0.5 p-1.5 active:cursor-grabbing"
                onPointerDown={startDrag}
              >
                {ISLAND_CATEGORIES.map((cat) => (
                  <Tooltip key={cat.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={cat.label}
                        onClick={() => handleIconClick(cat.id)}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="flex size-9 items-center justify-center rounded-lg text-foreground/70 transition-colors duration-150 hover:bg-white/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 dark:text-foreground/60 dark:hover:bg-white/10 dark:hover:text-foreground"
                      >
                        <cat.icon className="size-[18px]" strokeWidth={1.75} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8} className="text-xs">
                      {cat.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* ── Layer 2: Expanded panel ── */}
            <div
              className="island-layer-expanded"
              data-hidden={!isExpanded}
              ref={expandedRef}
              style={{
                position: !isExpanded ? 'absolute' : 'relative',
                top: 0,
                left: 0,
                width: 260,
              }}
            >
              {/* Header — drag handle */}
              <div
                className="flex cursor-grab items-center justify-between px-3 pb-0 pt-3 active:cursor-grabbing"
                onPointerDown={startDrag}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="size-3.5 text-foreground/20" strokeWidth={2} />
                  {activeCategory && (
                    <activeCategory.icon
                      className="size-4 text-foreground/50"
                      strokeWidth={1.75}
                    />
                  )}
                  <span className="select-none text-[13px] font-semibold text-foreground">
                    {activeCategory?.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex size-6 items-center justify-center rounded-md text-foreground/40 transition-colors hover:bg-white/15 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
                  aria-label="Закрыть"
                >
                  <X className="size-3.5" strokeWidth={2} />
                </button>
              </div>

              {/* Separator */}
              <div className="mx-3 mt-2.5 border-t border-foreground/[0.06]" />

              {/* Panel content — AnimatePresence for crossfade between panels */}
              <div className="px-3 pb-3 pt-2.5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activePanel ?? lastPanel}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {renderPanel(activePanel ?? lastPanel)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dot navigation */}
              <div className="mx-3 flex items-center justify-center gap-1.5 border-t border-foreground/[0.06] pb-3 pt-2.5">
                {ISLAND_CATEGORIES.map((cat) => (
                  <Tooltip key={cat.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label={cat.label}
                        onClick={() => handleDotClick(cat.id)}
                        className={`rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 ${
                          cat.id === activePanel
                            ? 'size-2 bg-foreground'
                            : 'size-1.5 bg-foreground/25 hover:bg-foreground/50'
                        }`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={6} className="text-[10px]">
                      {cat.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
