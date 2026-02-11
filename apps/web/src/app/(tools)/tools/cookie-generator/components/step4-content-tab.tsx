'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, Link2, ExternalLink, FileText, Pen } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { BannerCustomization } from './liquid-glass-island'
import { TONE_TEXTS, type ToneId, type TextState } from './island-panels/text-panel'
import { ClassicBanner, GlassBanner } from './banner-styles'
import type { BannerStyleProps } from './banner-styles/types'
import { BG_COLORS, BTN_COLORS, type ShadowLabel } from './island-panels'

/* ══════════════════════════════════════════════════════════
   Constants
   ══════════════════════════════════════════════════════════ */

const TONES: { id: ToneId; label: string; emoji: string }[] = [
  { id: 'friendly', label: 'Дружелюбный', emoji: '👋' },
  { id: 'short', label: 'Короткий', emoji: '⚡' },
  { id: 'official', label: 'Официальный', emoji: '📋' },
  { id: 'creative', label: 'Креативный', emoji: '✨' },
  { id: 'detailed', label: 'Развёрнутый', emoji: '📖' },
]

/* Color maps */
const BG_COLOR_MAP = Object.fromEntries(BG_COLORS.map((c) => [c.id, c.color]))
const BTN_COLOR_MAP = Object.fromEntries(BTN_COLORS.map((c) => [c.id, c.color]))
const SHADOW_MAP: Record<ShadowLabel, BannerStyleProps['shadow']> = {
  'Нет': 'none',
  'Мягкая': 'soft',
  'Сильная': 'strong',
}

function resolveBgColor(bgColor: string, bgCustom: string): string {
  if (bgColor === 'custom') return bgCustom
  return BG_COLOR_MAP[bgColor] ?? '#FFFFFF'
}
function resolveBtnColor(btnColor: string, btnCustom: string): string {
  if (btnColor === 'custom') return btnCustom
  return BTN_COLOR_MAP[btnColor] ?? '#000000'
}

/* ══════════════════════════════════════════════════════════
   Mini-site preview component
   Shows a fake site skeleton with the banner overlaid at the bottom
   ══════════════════════════════════════════════════════════ */

function MiniSitePreview({
  bannerProps,
  BannerComponent,
}: {
  bannerProps: BannerStyleProps
  BannerComponent: typeof ClassicBanner | typeof GlassBanner
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      {/* Mini browser chrome */}
      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-1.5">
        <div className="flex gap-1">
          <div className="size-[7px] rounded-full bg-foreground/10" />
          <div className="size-[7px] rounded-full bg-foreground/10" />
          <div className="size-[7px] rounded-full bg-foreground/10" />
        </div>
        <div className="mx-auto flex h-4 w-28 items-center justify-center rounded bg-muted/60">
          <span className="text-[8px] text-muted-foreground/50">yoursite.ru</span>
        </div>
        <div className="w-7" />
      </div>

      {/* Site content area — fixed height, banner at bottom */}
      <div className="relative bg-gradient-to-b from-background via-background to-muted/10" style={{ height: '220px' }}>
        {/* Skeleton site content */}
        <div className="p-4">
          {/* Nav */}
          <div className="flex items-center gap-2">
            <div className="size-4 rounded bg-foreground/[0.06]" />
            <div className="h-1.5 w-10 rounded-full bg-foreground/[0.06]" />
            <div className="ml-auto flex gap-2">
              <div className="h-1.5 w-6 rounded-full bg-foreground/[0.04]" />
              <div className="h-1.5 w-6 rounded-full bg-foreground/[0.04]" />
            </div>
          </div>
          {/* Hero */}
          <div className="mt-5 flex flex-col items-center">
            <div className="h-2 w-24 rounded-full bg-foreground/[0.07]" />
            <div className="mt-1.5 h-1.5 w-36 rounded-full bg-foreground/[0.04]" />
            <div className="mt-1 h-1.5 w-28 rounded-full bg-foreground/[0.04]" />
            <div className="mt-3 h-4 w-14 rounded bg-foreground/[0.06]" />
          </div>
          {/* Cards */}
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded border border-border/20 p-1.5">
                <div className="aspect-[4/3] rounded bg-foreground/[0.04]" />
                <div className="mt-1 h-1 w-3/4 rounded-full bg-foreground/[0.05]" />
              </div>
            ))}
          </div>
        </div>

        {/* Cookie banner — positioned at bottom like on real site */}
        <div className="absolute inset-x-0 bottom-0">
          <BannerComponent {...bannerProps} />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Settings row — reusable inline toggle + input row
   ══════════════════════════════════════════════════════════ */

function ToggleRow({
  checked,
  onCheckedChange,
  value,
  onValueChange,
  placeholder,
  disabled,
  badge,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  value: string
  onValueChange: (v: string) => void
  placeholder: string
  disabled?: boolean
  badge?: string
}) {
  const isDisabledVisually = disabled || !checked
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 ${
        isDisabledVisually
          ? 'bg-muted/30'
          : 'bg-muted/50'
      }`}
    >
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        size="sm"
        aria-label={placeholder}
      />
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={isDisabledVisually}
        className={`h-7 flex-1 border-0 bg-transparent px-0 text-[13px] shadow-none focus-visible:ring-0 ${
          isDisabledVisually ? 'text-muted-foreground/40' : 'text-foreground'
        }`}
        placeholder={placeholder}
        spellCheck={false}
      />
      {badge && (
        <span className="shrink-0 rounded bg-foreground/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/40">
          {badge}
        </span>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════════════════ */

interface Step4ContentTabProps {
  customization: BannerCustomization
  onCustomizationChange: (next: BannerCustomization) => void
}

export function Step4ContentTab({
  customization,
  onCustomizationChange,
}: Step4ContentTabProps) {
  const [showManualEdit, setShowManualEdit] = useState(false)
  const text = customization.text

  /* ── Helpers ── */
  function updateText(partial: Partial<TextState>) {
    onCustomizationChange({
      ...customization,
      text: { ...text, ...partial },
    })
  }

  function applyTone(id: ToneId) {
    const t = TONE_TEXTS[id]
    updateText({
      tone: id,
      title: t.title,
      desc: t.desc,
      accept: t.accept,
      decline: t.decline,
    })
  }

  /* ── Resolve banner preview props ── */
  const bannerProps: BannerStyleProps = useMemo(() => ({
    title: text.title,
    description: text.desc || 'Для удобства работы сайт использует cookie.',
    acceptText: text.accept,
    declineText: text.decline,
    settingsText: text.settings,
    showDecline: text.showDecline,
    showSettings: text.showSettings,
    linkWordEnabled: text.linkWordEnabled,
    linkWord: text.linkWord,
    linkLineEnabled: text.linkLineEnabled,
    linkLineText: text.linkLineText,
    backgroundColor: resolveBgColor(customization.design.bgColor, customization.design.bgCustom),
    textColor: '#111111',
    buttonColor: resolveBtnColor(customization.design.btnColor, customization.design.btnCustom),
    borderRadius: customization.design.radius,
    shadow: SHADOW_MAP[customization.design.shadow],
  }), [text, customization.design])

  const BannerComponent = customization.design.bannerStyle === 'glass' ? GlassBanner : ClassicBanner

  const activeTone = TONES.find((t) => t.id === text.tone)

  /* ══════════════════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════════════════ */

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr,380px] xl:grid-cols-[1fr,420px]">

      {/* ────────────────────────────────────────
          LEFT — Settings panel
          ──────────────────────────────────────── */}
      <div className="space-y-8">

        {/* ── Section 1: Tone ── */}
        <section>
          <div className="mb-3">
            <h4 className="text-[13px] font-semibold text-foreground">
              Тон сообщения
            </h4>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/60">
              Выберите стиль общения с посетителями
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTone(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-all duration-150 ${
                  text.tone === t.id
                    ? 'border-foreground/20 bg-foreground text-background shadow-sm'
                    : 'border-border/60 bg-background text-muted-foreground hover:border-foreground/15 hover:bg-muted/60 hover:text-foreground/80'
                }`}
              >
                <span className="text-[12px] leading-none">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* ── Section 2: Buttons ── */}
        <section>
          <div className="mb-3">
            <h4 className="text-[13px] font-semibold text-foreground">
              Кнопки
            </h4>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/60">
              Какие кнопки показывать и с каким текстом
            </p>
          </div>

          <div className="space-y-1.5">
            <ToggleRow
              checked
              onCheckedChange={() => {}}
              value={text.accept}
              onValueChange={(v) => updateText({ accept: v })}
              placeholder="Принять"
              disabled
              badge="обязательная"
            />
            <ToggleRow
              checked={text.showDecline}
              onCheckedChange={(v) => updateText({ showDecline: v })}
              value={text.decline}
              onValueChange={(v) => updateText({ decline: v })}
              placeholder="Отклонить"
            />
            <ToggleRow
              checked={text.showSettings}
              onCheckedChange={(v) => updateText({ showSettings: v })}
              value={text.settings}
              onValueChange={(v) => updateText({ settings: v })}
              placeholder="Настроить"
            />
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* ── Section 3: Policy link ── */}
        <section>
          <div className="mb-3">
            <h4 className="text-[13px] font-semibold text-foreground">
              Ссылка на политику
            </h4>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/60">
              Добавьте ссылку на политику конфиденциальности
            </p>
          </div>

          <div className="space-y-3">
            {/* Word link toggle */}
            <div className={`rounded-lg border transition-colors duration-150 ${
              text.linkWordEnabled ? 'border-border/60 bg-muted/40' : 'border-border/40 bg-muted/20'
            }`}>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Switch
                  checked={text.linkWordEnabled}
                  onCheckedChange={(v) => updateText({ linkWordEnabled: v })}
                  size="sm"
                  aria-label="Слово-ссылка"
                />
                <div className="min-w-0 flex-1">
                  <Label className="text-[13px] font-normal text-foreground/80">
                    Слово-ссылка в тексте
                  </Label>
                </div>
                <Link2 className="size-3.5 shrink-0 text-muted-foreground/30" strokeWidth={1.5} />
              </div>
              {text.linkWordEnabled && (
                <div className="border-t border-border/30 px-3 py-2.5 pl-12">
                  <Input
                    value={text.linkWord}
                    onChange={(e) => updateText({ linkWord: e.target.value })}
                    className="h-8 text-[12.5px]"
                    placeholder="cookie"
                    spellCheck={false}
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground/45">
                    Это слово в описании станет кликабельной ссылкой
                  </p>
                </div>
              )}
            </div>

            {/* Line link toggle */}
            <div className={`rounded-lg border transition-colors duration-150 ${
              text.linkLineEnabled ? 'border-border/60 bg-muted/40' : 'border-border/40 bg-muted/20'
            }`}>
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Switch
                  checked={text.linkLineEnabled}
                  onCheckedChange={(v) => updateText({ linkLineEnabled: v })}
                  size="sm"
                  aria-label="Отдельная строка-ссылка"
                />
                <div className="min-w-0 flex-1">
                  <Label className="text-[13px] font-normal text-foreground/80">
                    Отдельная строка «Подробнее»
                  </Label>
                </div>
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/30" strokeWidth={1.5} />
              </div>
              {text.linkLineEnabled && (
                <div className="border-t border-border/30 px-3 py-2.5 pl-12">
                  <Input
                    value={text.linkLineText}
                    onChange={(e) => updateText({ linkLineText: e.target.value })}
                    className="h-8 text-[12.5px]"
                    placeholder="Подробнее о cookie…"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Link target — only shown when any link is active */}
            {(text.linkWordEnabled || text.linkLineEnabled) && (
              <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-3">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/45">
                  Куда ведёт ссылка
                </p>
                <div className="flex gap-1">
                  {([
                    { id: 'popup' as const, label: 'Попап', icon: FileText, desc: 'Откроется попап с текстом политики' },
                    { id: 'page' as const, label: 'Страница', icon: ExternalLink, desc: '' },
                  ]).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateText({ linkTarget: opt.id })}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                        text.linkTarget === opt.id
                          ? 'border-foreground/20 bg-foreground text-background'
                          : 'border-transparent bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground/70'
                      }`}
                    >
                      <opt.icon className="size-3" strokeWidth={1.75} />
                      {opt.label}
                    </button>
                  ))}
                </div>
                {text.linkTarget === 'page' && (
                  <div className="mt-2.5">
                    <Input
                      type="url"
                      value={text.linkUrl}
                      onChange={(e) => updateText({ linkUrl: e.target.value })}
                      className="h-8 text-[12.5px]"
                      placeholder="https://yoursite.ru/cookie-policy"
                      spellCheck={false}
                    />
                    <p className="mt-1.5 text-[11px] text-muted-foreground/45">
                      Нет страницы? Добавьте позже в личном кабинете
                    </p>
                  </div>
                )}
                {text.linkTarget === 'popup' && (
                  <p className="mt-2 text-[11px] text-muted-foreground/45">
                    Текст политики подставится из шага 5
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* ── Section 4: Manual edit (collapsed by default) ── */}
        <section>
          <button
            type="button"
            onClick={() => setShowManualEdit(!showManualEdit)}
            className="group flex items-center gap-2 text-[13px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground/80"
          >
            <div className="flex size-5 items-center justify-center rounded-md bg-muted/50 transition-colors group-hover:bg-muted">
              <Pen className="size-3" strokeWidth={2} />
            </div>
            Редактировать текст вручную
            <ChevronRight
              className={`size-3.5 text-muted-foreground/40 transition-transform duration-200 ${showManualEdit ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
          </button>

          <div
            className="grid transition-[grid-template-rows] duration-200 ease-out"
            style={{ gridTemplateRows: showManualEdit ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="space-y-3 pt-4">
                <div>
                  <Label htmlFor="manual-title" className="mb-1.5 text-[11px] font-medium text-muted-foreground/50">
                    Заголовок
                  </Label>
                  <Input
                    id="manual-title"
                    value={text.title}
                    onChange={(e) => updateText({ title: e.target.value })}
                    className="h-8 text-[13px]"
                    placeholder="Мы используем cookie"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <Label htmlFor="manual-desc" className="mb-1.5 text-[11px] font-medium text-muted-foreground/50">
                    Описание
                  </Label>
                  <textarea
                    id="manual-desc"
                    value={text.desc}
                    onChange={(e) => updateText({ desc: e.target.value })}
                    rows={2}
                    className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-[13px] text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    placeholder="Текст описания…"
                    spellCheck={false}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground/40">
                  При выборе нового тона текст обновится автоматически
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ────────────────────────────────────────
          RIGHT — Live preview
          ──────────────────────────────────────── */}
      <div className="lg:sticky lg:top-20">
        {/* Header above preview */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
            Предпросмотр
          </span>
          {activeTone && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground/50">
              {activeTone.emoji} {activeTone.label}
            </span>
          )}
        </div>

        {/* Mini-site with banner */}
        <MiniSitePreview
          bannerProps={bannerProps}
          BannerComponent={BannerComponent}
        />

        {/* Footer hint */}
        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground/35">
          Позиция и стиль настраиваются на вкладке «Оформление»
        </p>
      </div>
    </div>
  )
}
