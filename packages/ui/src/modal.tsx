'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from './utils'

interface ModalProps {
  /** Открыт ли модал */
  open: boolean
  /** Callback при закрытии */
  onClose: () => void
  /** Содержимое модала */
  children: React.ReactNode
  /** Дополнительные классы для контейнера */
  className?: string
  /** Закрывать при клике на overlay */
  closeOnOverlayClick?: boolean
  /** Закрывать при нажатии Escape */
  closeOnEscape?: boolean
}

export function Modal({
  open,
  onClose,
  children,
  className,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle Escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    },
    [closeOnEscape, onClose]
  )

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === overlayRef.current) {
        onClose()
      }
    },
    [closeOnOverlayClick, onClose]
  )

  // Add/remove event listeners
  useEffect(() => {
    if (!open) return

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, handleEscape])

  // Focus trap
  useEffect(() => {
    if (open && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      firstElement?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={contentRef}
        className={cn(
          'relative w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-lg animate-scale-in',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function ModalTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
}

export function ModalDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-1 text-sm text-muted-foreground', className)} {...props} />
  )
}

export function ModalFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-6 flex justify-end gap-3', className)}
      {...props}
    />
  )
}

export function ModalClose({
  onClose,
  className,
}: {
  onClose: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClose}
      className={cn(
        'absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        className
      )}
      aria-label="Закрыть"
    >
      <svg
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}
