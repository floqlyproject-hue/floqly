'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FloqlyLogo } from '@/components/floqly-logo'
import {
  LayoutDashboard,
  Globe,
  Sparkles,
  Wrench,
  BookOpen,
  MessageCircle,
  BarChart3,
  Plug,
  Settings,
  CreditCard,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'

// --- Types ---

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface NavSection {
  label?: string
  items: NavItem[]
}

// --- Navigation config ---

const mainSections: NavSection[] = [
  {
    items: [
      { href: '/dashboard', label: 'Главная', icon: LayoutDashboard },
      { href: '/dashboard/sites', label: 'Сайты', icon: Globe },
    ],
  },
  {
    label: 'Продукты',
    items: [
      { href: '/dashboard/widget', label: 'Умный виджет', icon: Sparkles },
      { href: '/dashboard/tools', label: 'Инструменты', icon: Wrench },
    ],
  },
  {
    label: 'Данные',
    items: [
      { href: '/dashboard/company-data', label: 'База знаний', icon: BookOpen },
      { href: '/dashboard/dialogs', label: 'Диалоги', icon: MessageCircle },
      { href: '/dashboard/analytics', label: 'Аналитика', icon: BarChart3 },
      { href: '/dashboard/integrations', label: 'Интеграции', icon: Plug },
    ],
  },
]

const bottomItems: NavItem[] = [
  { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
  { href: '/dashboard/subscription', label: 'Подписка', icon: CreditCard },
]

// --- Components ---

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive =
    pathname === item.href ||
    (item.href !== '/dashboard' && pathname.startsWith(item.href))

  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150 ${
        isActive
          ? 'bg-foreground/[0.06] text-foreground'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      }`}
    >
      <Icon className="size-[18px]" strokeWidth={1.5} />
      <span>{item.label}</span>
    </Link>
  )
}

function SidebarNav() {
  return (
    <>
      {/* Logo */}
      <div className="flex h-14 items-center px-4">
        <FloqlyLogo variant="dots" size="sm" />
      </div>

      {/* Main navigation */}
      <nav className="flex flex-1 flex-col gap-5 px-3 py-3">
        {mainSections.map((section, i) => (
          <div key={i}>
            {section.label && (
              <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom navigation */}
      <div className="mt-auto border-t border-border px-3 py-3">
        <div className="flex flex-col gap-0.5">
          {bottomItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>
      </div>
    </>
  )
}

// --- Desktop Sidebar ---

export function Sidebar() {
  return (
    <aside className="hidden w-60 flex-col border-r border-border bg-card lg:flex">
      <SidebarNav />
    </aside>
  )
}

// --- Mobile Sidebar (Sheet) ---

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-60 p-0">
        <SheetTitle className="sr-only">Навигация</SheetTitle>
        <div className="flex h-full flex-col" onClick={() => onOpenChange(false)}>
          <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  )
}
