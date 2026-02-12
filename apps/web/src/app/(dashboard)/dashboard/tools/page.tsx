'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Shield,
  FileText,
  ScrollText,
  MessageSquare,
  Sparkles,
  Star,
  PhoneCall,
  AppWindow,
  LogOut,
  Flame,
  Video,
  ArrowRight,
} from 'lucide-react'
import {
  TOOLS_REGISTRY,
  TOOL_CATEGORIES,
  type Tool,
  type ToolCategory,
} from '@/lib/utils/tools-registry'

// --- Lucide icon map ---

const TOOL_ICON_MAP: Record<string, React.ElementType> = {
  cookie: Shield,
  document: FileText,
  'document-text': ScrollText,
  chat: MessageSquare,
  sparkles: Sparkles,
  star: Star,
  phone: PhoneCall,
  window: AppWindow,
  'arrow-right': LogOut,
  fire: Flame,
  video: Video,
}

// --- Tool href resolver ---

const getToolHref = (tool: Tool): string | undefined => {
  if (tool.status !== 'active') return undefined
  switch (tool.id) {
    case 'cookie-generator':
      return '/dashboard/tools/cookie-generator'
    case 'simple-widget':
      return '/tools/simple-widget'
    default:
      return tool.href
  }
}

// --- Page ---

export default function DashboardToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = Object.entries(TOOL_CATEGORIES) as [ToolCategory, { name: string; description: string }][]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
          Инструменты
        </h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Виджеты и полезные инструменты для вашего сайта
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Поиск инструментов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Все
          </button>
          {categories.map(([key, { name }]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* Empty state */}
      {filteredTools.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="size-8 text-muted-foreground/30" strokeWidth={1} />
          <h3 className="mt-4 text-[15px] font-medium text-foreground">
            Ничего не найдено
          </h3>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Попробуйте изменить поисковый запрос или фильтры
          </p>
        </div>
      )}
    </div>
  )
}

// --- ToolCard ---

function ToolCard({ tool }: { tool: Tool }) {
  const href = getToolHref(tool)
  const isClickable = !!href
  const Icon = TOOL_ICON_MAP[tool.icon] || FileText

  const content = (
    <div
      className={`group rounded-xl border border-border bg-card p-4 transition-colors duration-150 ${
        isClickable
          ? 'cursor-pointer hover:border-foreground/10 hover:bg-muted/30'
          : ''
      }`}
    >
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between">
        <Icon className="size-5 text-muted-foreground/50" strokeWidth={1.5} />

        <div className="flex items-center gap-1.5">
          {tool.isPremium && (
            <span className="text-[11px] font-medium text-foreground/50">
              Pro
            </span>
          )}
          {tool.status === 'active' ? (
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] text-muted-foreground">
                Активен
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground/50">
              Скоро
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="mt-3 text-[14px] font-medium text-foreground">
        {tool.name}
      </h3>

      {/* Description */}
      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
        {tool.description}
      </p>

      {/* Arrow for clickable */}
      {isClickable && (
        <div className="mt-3 flex items-center gap-1 text-[12px] font-medium text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          Открыть
          <ArrowRight className="size-3" strokeWidth={1.5} />
        </div>
      )}
    </div>
  )

  if (isClickable && href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
