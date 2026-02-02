'use client'

import { createContext, useContext, useState } from 'react'
import { cn } from './utils'

interface AccordionContextValue {
  expanded: string[]
  toggle: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

function useAccordionContext() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider')
  }
  return context
}

interface AccordionProps {
  /** Тип: single (только один открыт) или multiple (несколько) */
  type?: 'single' | 'multiple'
  /** Значение по умолчанию */
  defaultValue?: string[]
  /** Дочерние элементы */
  children: React.ReactNode
  /** Дополнительные классы */
  className?: string
}

export function Accordion({
  type = 'single',
  defaultValue = [],
  children,
  className,
}: AccordionProps) {
  const [expanded, setExpanded] = useState<string[]>(defaultValue)

  const toggle = (value: string) => {
    setExpanded((prev) => {
      if (type === 'single') {
        return prev.includes(value) ? [] : [value]
      }
      return prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    })
  }

  return (
    <AccordionContext.Provider value={{ expanded, toggle, type }}>
      <div className={cn('divide-y divide-border', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  /** Уникальное значение */
  value: string
  /** Дочерние элементы */
  children: React.ReactNode
  /** Дополнительные классы */
  className?: string
}

const AccordionItemContext = createContext<string>('')

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn('', className)}>{children}</div>
    </AccordionItemContext.Provider>
  )
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { expanded, toggle } = useAccordionContext()
  const value = useContext(AccordionItemContext)
  const isExpanded = expanded.includes(value)

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      aria-expanded={isExpanded}
      className={cn(
        'flex w-full items-center justify-between py-4 font-medium text-foreground transition-all hover:text-primary [&[data-state=open]>svg]:rotate-180',
        className
      )}
      data-state={isExpanded ? 'open' : 'closed'}
      {...props}
    >
      {children}
      <svg
        className="size-4 shrink-0 transition-transform duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useAccordionContext()
  const value = useContext(AccordionItemContext)
  const isExpanded = expanded.includes(value)

  return (
    <div
      className={cn(
        'overflow-hidden text-sm transition-all',
        isExpanded ? 'animate-slide-in pb-4' : 'h-0',
        className
      )}
      data-state={isExpanded ? 'open' : 'closed'}
      hidden={!isExpanded}
      {...props}
    >
      <div className="text-muted-foreground">{children}</div>
    </div>
  )
}
