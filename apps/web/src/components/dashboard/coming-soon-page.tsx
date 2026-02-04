'use client'

import { useState } from 'react'

interface ComingSoonPageProps {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
  accentColor?: 'primary' | 'success' | 'warning'
  illustration?: React.ReactNode
}

export function ComingSoonPage({
  title,
  description,
  features,
  icon,
  accentColor = 'primary',
  illustration,
}: ComingSoonPageProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const accentClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }

  const buttonClasses = {
    primary: 'bg-primary hover:bg-primary/90',
    success: 'bg-success hover:bg-success/90',
    warning: 'bg-warning hover:bg-warning/90 text-warning-foreground',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      // TODO: Сохранение в Supabase waitlist
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Icon */}
        <div className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${accentClasses[accentColor]}`}>
          {icon}
        </div>

        {/* Badge */}
        <div className="mt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-warning animate-pulse" />
            Скоро
          </span>
        </div>

        {/* Title & Description */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {description}
        </p>

        {/* Features */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {features.map((feature) => (
            <span
              key={feature}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
            >
              <svg className="size-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {feature}
            </span>
          ))}
        </div>

        {/* Illustration */}
        {illustration && (
          <div className="mt-8">
            {illustration}
          </div>
        )}

        {/* Waitlist Form */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          {isSubmitted ? (
            <div className="space-y-3">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10">
                <svg className="size-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Вы в списке!</h3>
              <p className="text-sm text-muted-foreground">
                Мы отправим вам письмо, как только функция станет доступна.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-foreground">
                Хотите узнать первыми?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Оставьте email и мы сообщим, когда функция будет готова
              </p>
              <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`h-11 rounded-xl px-6 text-sm font-medium text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonClasses[accentColor]}`}
                >
                  {isLoading ? (
                    <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    'Уведомить меня'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
