import Link from 'next/link'
import { BentoGrid, BentoCard, StatCard, ActivityFeed } from '@/components/dashboard'

export const metadata = {
  title: 'Главная | Floqly',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Добро пожаловать</h1>
        <p className="mt-1 text-muted-foreground">
          Вот что происходит на ваших сайтах
        </p>
      </div>

      {/* Bento Grid */}
      <BentoGrid>
        {/* Smart Widget Efficiency Card - 2x2 */}
        <BentoCard
          title="Умный виджет"
          description="За последние 30 дней"
          size="xl"
          variant="primary"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
          }
        >
          <div className="mt-2 space-y-4">
            <div>
              <div className="text-4xl font-bold tracking-tight text-foreground">
                0 <span className="text-lg font-normal text-muted-foreground">часов</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Сэкономлено времени команды
              </p>
            </div>

            {/* Mini chart placeholder */}
            <div className="flex h-20 items-end gap-1">
              {[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/20 transition-all hover:bg-primary/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-success">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                +24%
              </span>
              <span>к прошлому месяцу</span>
            </div>
          </div>
        </BentoCard>

        {/* Tools Status Card - 1x2 */}
        <BentoCard
          title="Ваши инструменты"
          size="lg"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          }
        >
          <div className="mt-2 space-y-3">
            <ToolStatusItem
              name="Плашка cookies"
              status="active"
              href="/dashboard/tools/cookie-generator"
            />
            <ToolStatusItem
              name="Простой виджет"
              status="active"
              href="/tools/simple-widget"
            />
            <ToolStatusItem
              name="Виджет обратного звонка"
              status="coming_soon"
            />
            <ToolStatusItem
              name="Умный виджет"
              status="coming_soon"
            />
          </div>
        </BentoCard>

        {/* Activity Feed - 1x2 */}
        <BentoCard
          title="Последние события"
          description="В реальном времени"
          size="lg"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          }
        >
          <div className="mt-2">
            <ActivityFeed maxItems={4} />
          </div>
        </BentoCard>

        {/* Quick Stats */}
        <StatCard
          title="Сайты"
          value={0}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          }
        />

        <StatCard
          title="Виджеты"
          value={0}
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
            </svg>
          }
        />

        <StatCard
          title="Показы"
          value="0"
          change={{ value: 0, label: 'за месяц' }}
          trend="neutral"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <StatCard
          title="Заявки"
          value="0"
          change={{ value: 0, label: 'за месяц' }}
          trend="neutral"
          icon={
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
      </BentoGrid>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">С чего начать</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            href="/dashboard/sites/new"
            title="Добавить сайт"
            description="Подключите ваш первый сайт"
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
            variant="primary"
          />

          <QuickActionCard
            href="/dashboard/tools/cookie-generator"
            title="Плашка cookies"
            description="Создать уведомление о cookies"
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            variant="success"
          />

          <QuickActionCard
            href="/dashboard/tools"
            title="Все инструменты"
            description="Смотреть каталог виджетов"
            icon={
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            }
            variant="warning"
          />
        </div>
      </div>
    </div>
  )
}

function ToolStatusItem({
  name,
  status,
  href,
}: {
  name: string
  status: 'active' | 'inactive' | 'coming_soon'
  href?: string
}) {
  const statusConfig = {
    active: {
      color: 'bg-success',
      label: 'Активен',
    },
    inactive: {
      color: 'bg-muted',
      label: 'Неактивен',
    },
    coming_soon: {
      color: 'bg-warning',
      label: 'Скоро',
    },
  }

  const content = (
    <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50">
      <span className="text-sm text-foreground">{name}</span>
      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${statusConfig[status].color}`} />
        <span className="text-xs text-muted-foreground">{statusConfig[status].label}</span>
      </div>
    </div>
  )

  if (href && status !== 'coming_soon') {
    return <Link href={href}>{content}</Link>
  }

  return content
}

function QuickActionCard({
  href,
  title,
  description,
  icon,
  variant = 'default',
}: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning'
}) {
  const variantClasses = {
    default: 'hover:border-border/80',
    primary: 'hover:border-primary/50',
    success: 'hover:border-success/50',
    warning: 'hover:border-warning/50',
  }

  const iconClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }

  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md ${variantClasses[variant]}`}
    >
      <div className={`flex size-12 items-center justify-center rounded-xl ${iconClasses[variant]}`}>
        {icon}
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
