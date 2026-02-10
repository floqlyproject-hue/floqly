'use client'

import { motion } from 'framer-motion'
import { Palette, Sparkles, Type, LayoutTemplate } from 'lucide-react'

const ISLAND_CATEGORIES = [
  { id: 'design', label: 'Дизайн', icon: Palette },
  { id: 'animation', label: 'Анимация', icon: Sparkles },
  { id: 'text', label: 'Текст', icon: Type },
  { id: 'position', label: 'Позиция', icon: LayoutTemplate },
] as const

interface LiquidGlassIslandProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function LiquidGlassIsland({ containerRef }: LiquidGlassIslandProps) {
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

      {/* Draggable island */}
      <motion.div
        drag
        dragConstraints={containerRef}
        dragMomentum={false}
        dragElastic={0.05}
        whileDrag={{ scale: 1.04, cursor: 'grabbing' }}
        className="liquid-glass absolute left-4 top-1/2 z-20 -translate-y-1/2"
        style={{ cursor: 'grab', touchAction: 'none' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3, ease: [0, 0, 0.2, 1] }}
      >
        {/* Glass layers */}
        <div className="liquid-glass-effect" />
        <div className="liquid-glass-tint" />
        <div className="liquid-glass-shine" />

        {/* Icon buttons */}
        <div className="liquid-glass-content flex flex-col gap-0.5 p-1.5">
          {ISLAND_CATEGORIES.map((cat) => (
            <span key={cat.id} className="tooltip-trigger relative">
              <button
                type="button"
                aria-label={cat.label}
                className="flex size-9 items-center justify-center rounded-lg text-foreground/70 transition-colors duration-150 hover:bg-white/20 hover:text-foreground dark:text-foreground/60 dark:hover:bg-white/10 dark:hover:text-foreground"
              >
                <cat.icon className="size-[18px]" strokeWidth={1.75} />
              </button>
              <span className="tooltip-content-right ml-1 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background shadow-lg">
                {cat.label}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </>
  )
}
