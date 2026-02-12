import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface InDevelopmentPageProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function InDevelopmentPage({
  title,
  description = 'Мы работаем над этой функцией. Она появится в ближайших обновлениях.',
  icon,
}: InDevelopmentPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      {icon && (
        <div className="mb-5 text-muted-foreground/40">
          {icon}
        </div>
      )}
      <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Вернуться на главную
      </Link>
    </div>
  )
}
