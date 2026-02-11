'use client'

import { useState, useMemo, useRef, useCallback, useLayoutEffect } from 'react'
import { ChevronRight, Link2, FileText, ExternalLink } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BannerCustomization } from './liquid-glass-island'
import { TONE_TEXTS, type ToneId, type TextState } from './island-panels/text-panel'
import { ClassicBanner, GlassBanner } from './banner-styles'
import type { BannerStyleProps } from './banner-styles/types'
import { BG_COLORS, BTN_COLORS, type ShadowLabel } from './island-panels'

/* ── Tone options ── */
const TONES: { id: ToneId; label: string; emoji: string }[] = [
  { id: 'friendly', label: 'Дружелюбный', emoji: '👋' },
  { id: 'short', label: 'Короткий', emoji: '⚡' },
  { id: 'official', label: 'Официальный', emoji: '📋' },
  { id: 'creative', label: 'Креативный', emoji: '✨' },
  { id: 'detailed', label: 'Развёрнутый', emoji: '📖' },
]

/* ── Color helpers ── */
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

/* ── Section header ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50">
      {children}
    </p>
  )
}

/* ── Component ── */
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

  // Resolve banner props for preview
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

  /* ── Auto-scale banner to fit fixed container ── */
  const containerRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const CONTAINER_HEIGHT = 120

  const scaleBanner = useCallback(() => {
    const container = containerRef.current
    const banner = bannerRef.current
    if (!container || !banner) return
    // Reset scale to measure natural size
    banner.style.transform = 'scale(1)'
    const bannerH = banner.scrollHeight
    if (bannerH > CONTAINER_HEIGHT) {
      const scale = CONTAINER_HEIGHT / bannerH
      banner.style.transform = `scale(${Math.max(scale, 0.7)})`
    }
  }, [])

  useLayoutEffect(() => {
    scaleBanner()
  }, [scaleBanner, text, bannerProps])

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr,minmax(340px,400px)]">
      {/* ════════════════════════════════════════
          LEFT COLUMN — Settings
          ════════════════════════════════════════ */}
      <div className="max-w-md space-y-6">

        {/* ── Tone ── */}
        <div>
          <SectionLabel>Тон сообщения</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTone(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-all duration-150 ${
                  text.tone === t.id
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground/80'
                }`}
              >
                <span className="text-[11px]">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Buttons ── */}
        <div>
          <SectionLabel>Кнопки баннера</SectionLabel>
          <div className="space-y-2">
            {/* Accept — always on */}
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-3 py-2">
              <Switch checked disabled className="opacity-50" size="sm" />
              <Input
                value={text.accept}
                onChange={(e) => updateText({ accept: e.target.value })}
                className="h-7 border-0 bg-transparent px-0 text-[13px] shadow-none focus-visible:ring-0"
                placeholder="Принять"
              />
              <span className="shrink-0 text-[10px] text-muted-foreground/40">основная</span>
            </div>

            {/* Decline */}
            <div className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors duration-200 ${
              text.showDecline ? 'border-border/50 bg-card' : 'border-border/30 bg-muted/20'
            }`}>
              <Switch
                checked={text.showDecline}
                onCheckedChange={(v) => updateText({ showDecline: v })}
                size="sm"
              />
              <Input
                value={text.decline}
                onChange={(e) => updateText({ decline: e.target.value })}
                disabled={!text.showDecline}
                className={`h-7 border-0 bg-transparent px-0 text-[13px] shadow-none focus-visible:ring-0 ${
                  !text.showDecline ? 'text-muted-foreground/30' : ''
                }`}
                placeholder="Отклонить"
              />
            </div>

            {/* Settings */}
            <div className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors duration-200 ${
              text.showSettings ? 'border-border/50 bg-card' : 'border-border/30 bg-muted/20'
            }`}>
              <Switch
                checked={text.showSettings}
                onCheckedChange={(v) => updateText({ showSettings: v })}
                size="sm"
              />
              <Input
                value={text.settings}
                onChange={(e) => updateText({ settings: e.target.value })}
                disabled={!text.showSettings}
                className={`h-7 border-0 bg-transparent px-0 text-[13px] shadow-none focus-visible:ring-0 ${
                  !text.showSettings ? 'text-muted-foreground/30' : ''
                }`}
                placeholder="Настроить"
              />
            </div>
          </div>
        </div>

        {/* ── Policy Link ── */}
        <div>
          <SectionLabel>Ссылка на политику</SectionLabel>
          <div className="space-y-2">
            {/* Word link */}
            <div className={`rounded-lg border px-3 py-2.5 transition-colors duration-200 ${
              text.linkWordEnabled ? 'border-border/50 bg-card' : 'border-border/30 bg-muted/20'
            }`}>
              <div className="flex items-center gap-3">
                <Switch
                  checked={text.linkWordEnabled}
                  onCheckedChange={(v) => updateText({ linkWordEnabled: v })}
                  size="sm"
                />
                <Label className="flex-1 cursor-pointer text-[13px] font-normal text-foreground/80">
                  Слово-ссылка в тексте
                </Label>
                <Link2 className="size-3.5 text-muted-foreground/30" strokeWidth={1.5} />
              </div>
              {text.linkWordEnabled && (
                <div className="mt-2.5 pl-10">
                  <Input
                    value={text.linkWord}
                    onChange={(e) => updateText({ linkWord: e.target.value })}
                    className="h-8 text-[12.5px]"
                    placeholder="cookie"
                  />
                  <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted-foreground/45">
                    Это слово станет кликабельной ссылкой в тексте баннера
                  </p>
                </div>
              )}
            </div>

            {/* Line link */}
            <div className={`rounded-lg border px-3 py-2.5 transition-colors duration-200 ${
              text.linkLineEnabled ? 'border-border/50 bg-card' : 'border-border/30 bg-muted/20'
            }`}>
              <div className="flex items-center gap-3">
                <Switch
                  checked={text.linkLineEnabled}
                  onCheckedChange={(v) => updateText({ linkLineEnabled: v })}
                  size="sm"
                />
                <Label className="flex-1 cursor-pointer text-[13px] font-normal text-foreground/80">
                  Отдельная строка «Подробнее»
                </Label>
                <ExternalLink className="size-3.5 text-muted-foreground/30" strokeWidth={1.5} />
              </div>
              {text.linkLineEnabled && (
                <div className="mt-2.5 pl-10">
                  <Input
                    value={text.linkLineText}
                    onChange={(e) => updateText({ linkLineText: e.target.value })}
                    className="h-8 text-[12.5px]"
                    placeholder="Подробнее о cookie"
                  />
                </div>
              )}
            </div>

            {/* Link target */}
            {(text.linkWordEnabled || text.linkLineEnabled) && (
              <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5">
                <p className="mb-2 text-[11px] font-medium text-muted-foreground/50">
                  Куда ведёт ссылка
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateText({ linkTarget: 'popup' })}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                      text.linkTarget === 'popup'
                        ? 'bg-foreground text-background'
                        : 'bg-background text-muted-foreground hover:text-foreground/70'
                    }`}
                  >
                    <FileText className="size-3" strokeWidth={1.75} />
                    Попап
                  </button>
                  <button
                    type="button"
                    onClick={() => updateText({ linkTarget: 'page' })}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                      text.linkTarget === 'page'
                        ? 'bg-foreground text-background'
                        : 'bg-background text-muted-foreground hover:text-foreground/70'
                    }`}
                  >
                    <ExternalLink className="size-3" strokeWidth={1.75} />
                    Страница
                  </button>
                </div>
                {text.linkTarget === 'popup' && (
                  <p className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground/45">
                    Откроется попап с полным текстом cookie-политики
                  </p>
                )}
                {text.linkTarget === 'page' && (
                  <div className="mt-2 space-y-1.5">
                    <Input
                      type="url"
                      value={text.linkUrl}
                      onChange={(e) => updateText({ linkUrl: e.target.value })}
                      className="h-8 text-[12.5px]"
                      placeholder="https://site.com/cookie-policy"
                    />
                    <p className="text-[10.5px] leading-relaxed text-muted-foreground/45">
                      Нет страницы? Добавьте ссылку позже в личном кабинете
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Manual text edit ── */}
        <div>
          <button
            type="button"
            onClick={() => setShowManualEdit(!showManualEdit)}
            className="group flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/50 transition-colors hover:text-muted-foreground/80"
          >
            <ChevronRight
              className={`size-3.5 transition-transform duration-200 ${showManualEdit ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
            Редактировать текст вручную
          </button>

          <div
            className="grid transition-all duration-200"
            style={{
              gridTemplateRows: showManualEdit ? '1fr' : '0fr',
            }}
          >
            <div className="overflow-hidden">
              <div className="space-y-3 pt-3">
                <div>
                  <Label className="mb-1.5 text-[11px] text-muted-foreground/50">Заголовок</Label>
                  <Input
                    value={text.title}
                    onChange={(e) => updateText({ title: e.target.value })}
                    className="h-8 text-[13px]"
                    placeholder="Мы используем cookie"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 text-[11px] text-muted-foreground/50">Описание</Label>
                  <textarea
                    value={text.desc}
                    onChange={(e) => updateText({ desc: e.target.value })}
                    rows={2}
                    className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-[13px] text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    placeholder="Текст описания…"
                  />
                </div>
                <p className="text-[10.5px] text-muted-foreground/40">
                  При выборе нового тона текст обновится
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT COLUMN — Banner Preview
          ════════════════════════════════════════ */}
      <div className="lg:sticky lg:top-24">
        {/* Preview container — fixed aspect ratio */}
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
          {/* Mini-header */}
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-2">
            <span className="text-[10.5px] font-medium tracking-wide text-muted-foreground/40">
              ПРЕДПРОСМОТР
            </span>
            <span className="text-[10px] text-muted-foreground/30">
              {text.tone === 'friendly' && '👋 Дружелюбный'}
              {text.tone === 'short' && '⚡ Короткий'}
              {text.tone === 'official' && '📋 Официальный'}
              {text.tone === 'creative' && '✨ Креативный'}
              {text.tone === 'detailed' && '📖 Развёрнутый'}
            </span>
          </div>

          {/* Banner preview — fixed container, auto-scaled */}
          <div
            ref={containerRef}
            className="flex items-center justify-center overflow-hidden px-5 py-4"
            style={{ height: `${CONTAINER_HEIGHT + 32}px` }}
          >
            <div
              ref={bannerRef}
              className="w-full max-w-[360px] origin-center transition-transform duration-150"
            >
              <BannerComponent {...bannerProps} />
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[10.5px] text-muted-foreground/35">
          Стиль настраивается на вкладке «Оформление»
        </p>
      </div>
    </div>
  )
}
