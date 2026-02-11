'use client'

import { useState, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BannerCustomization } from './liquid-glass-island'
import { TONE_TEXTS, type ToneId, type TextState } from './island-panels/text-panel'
import { ClassicBanner, GlassBanner } from './banner-styles'
import type { BannerStyleProps } from './banner-styles/types'
import { BG_COLORS, BTN_COLORS, type ShadowLabel } from './island-panels'

/* ── Constants ── */

const TONES: { id: ToneId; label: string }[] = [
  { id: 'friendly', label: 'Дружелюбный' },
  { id: 'short', label: 'Короткий' },
  { id: 'official', label: 'Официальный' },
  { id: 'creative', label: 'Креативный' },
  { id: 'detailed', label: 'Развёрнутый' },
]

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

/* ── Tiny section label ── */
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-medium text-muted-foreground/50">
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
    updateText({ tone: id, title: t.title, desc: t.desc, accept: t.accept, decline: t.decline })
  }

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

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[280px,1fr]">

      {/* ── LEFT: Compact settings ── */}
      <div className="space-y-5">

        {/* Tone */}
        <div>
          <SLabel>Тон сообщения</SLabel>
          <div className="flex flex-wrap gap-1">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTone(t.id)}
                className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-all duration-150 ${
                  text.tone === t.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground/80'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div>
          <SLabel>Кнопки</SLabel>
          <div className="space-y-1">
            {/* Accept — always on */}
            <div className="flex items-center gap-2.5 rounded-md bg-muted/30 px-2.5 py-1.5">
              <Switch checked disabled size="sm" className="opacity-40" aria-label="Принять" />
              <Input
                value={text.accept}
                onChange={(e) => updateText({ accept: e.target.value })}
                className="h-6 flex-1 border-0 bg-transparent px-0 text-[12px] shadow-none focus-visible:ring-0"
                placeholder="Принять"
                spellCheck={false}
              />
              <span className="text-[9px] text-muted-foreground/35">обяз.</span>
            </div>
            {/* Decline */}
            <div className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 ${text.showDecline ? 'bg-muted/40' : 'bg-muted/20'}`}>
              <Switch
                checked={text.showDecline}
                onCheckedChange={(v) => updateText({ showDecline: v })}
                size="sm"
                aria-label="Отклонить"
              />
              <Input
                value={text.decline}
                onChange={(e) => updateText({ decline: e.target.value })}
                disabled={!text.showDecline}
                className={`h-6 flex-1 border-0 bg-transparent px-0 text-[12px] shadow-none focus-visible:ring-0 ${!text.showDecline ? 'text-muted-foreground/30' : ''}`}
                placeholder="Отклонить"
                spellCheck={false}
              />
            </div>
            {/* Settings */}
            <div className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 ${text.showSettings ? 'bg-muted/40' : 'bg-muted/20'}`}>
              <Switch
                checked={text.showSettings}
                onCheckedChange={(v) => updateText({ showSettings: v })}
                size="sm"
                aria-label="Настроить"
              />
              <Input
                value={text.settings}
                onChange={(e) => updateText({ settings: e.target.value })}
                disabled={!text.showSettings}
                className={`h-6 flex-1 border-0 bg-transparent px-0 text-[12px] shadow-none focus-visible:ring-0 ${!text.showSettings ? 'text-muted-foreground/30' : ''}`}
                placeholder="Настроить"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <SLabel>Ссылка на политику</SLabel>
          <div className="space-y-1.5">
            {/* Word link */}
            <div className={`rounded-md border px-2.5 py-2 transition-colors ${text.linkWordEnabled ? 'border-border/50 bg-muted/30' : 'border-border/30'}`}>
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={text.linkWordEnabled}
                  onCheckedChange={(v) => updateText({ linkWordEnabled: v })}
                  size="sm"
                  aria-label="Слово-ссылка"
                />
                <span className="flex-1 text-[12px] text-foreground/70">Слово-ссылка в тексте</span>
              </div>
              {text.linkWordEnabled && (
                <div className="mt-2 pl-9">
                  <Input
                    value={text.linkWord}
                    onChange={(e) => updateText({ linkWord: e.target.value })}
                    className="h-7 text-[12px]"
                    placeholder="cookie"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Line link */}
            <div className={`rounded-md border px-2.5 py-2 transition-colors ${text.linkLineEnabled ? 'border-border/50 bg-muted/30' : 'border-border/30'}`}>
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={text.linkLineEnabled}
                  onCheckedChange={(v) => updateText({ linkLineEnabled: v })}
                  size="sm"
                  aria-label="Строка-ссылка"
                />
                <span className="flex-1 text-[12px] text-foreground/70">Строка «Подробнее»</span>
              </div>
              {text.linkLineEnabled && (
                <div className="mt-2 pl-9">
                  <Input
                    value={text.linkLineText}
                    onChange={(e) => updateText({ linkLineText: e.target.value })}
                    className="h-7 text-[12px]"
                    placeholder="Подробнее о cookie…"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Link target */}
            {(text.linkWordEnabled || text.linkLineEnabled) && (
              <div className="rounded-md bg-muted/20 px-2.5 py-2">
                <p className="mb-1.5 text-[10px] font-medium text-muted-foreground/40">Куда ведёт</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateText({ linkTarget: 'popup' })}
                    className={`flex-1 rounded px-2 py-1 text-[11px] font-medium transition-all ${
                      text.linkTarget === 'popup'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground/70'
                    }`}
                  >
                    Попап
                  </button>
                  <button
                    type="button"
                    onClick={() => updateText({ linkTarget: 'page' })}
                    className={`flex-1 rounded px-2 py-1 text-[11px] font-medium transition-all ${
                      text.linkTarget === 'page'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground/70'
                    }`}
                  >
                    Страница
                  </button>
                </div>
                {text.linkTarget === 'page' && (
                  <Input
                    type="url"
                    value={text.linkUrl}
                    onChange={(e) => updateText({ linkUrl: e.target.value })}
                    className="mt-1.5 h-7 text-[11px]"
                    placeholder="https://site.ru/cookie-policy"
                    spellCheck={false}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Manual edit */}
        <div>
          <button
            type="button"
            onClick={() => setShowManualEdit(!showManualEdit)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/45 transition-colors hover:text-muted-foreground/70"
          >
            <ChevronRight
              className={`size-3 transition-transform duration-150 ${showManualEdit ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
            Редактировать вручную
          </button>

          <div
            className="grid transition-[grid-template-rows] duration-150 ease-out"
            style={{ gridTemplateRows: showManualEdit ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="space-y-2 pt-2.5">
                <div>
                  <Label htmlFor="m-title" className="mb-1 text-[10px] text-muted-foreground/40">Заголовок</Label>
                  <Input
                    id="m-title"
                    value={text.title}
                    onChange={(e) => updateText({ title: e.target.value })}
                    className="h-7 text-[12px]"
                    placeholder="Мы используем cookie"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <Label htmlFor="m-desc" className="mb-1 text-[10px] text-muted-foreground/40">Описание</Label>
                  <textarea
                    id="m-desc"
                    value={text.desc}
                    onChange={(e) => updateText({ desc: e.target.value })}
                    rows={2}
                    className="w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-1.5 text-[12px] text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    placeholder="Текст описания…"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Banner preview ── */}
      <div className="lg:sticky lg:top-20">
        <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/10">
          {/* Tiny header */}
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/35">
              Предпросмотр
            </span>
            <span className="text-[10px] text-muted-foreground/30">
              {TONES.find(t => t.id === text.tone)?.label}
            </span>
          </div>

          {/* Banner on neutral background — vertically centered */}
          <div className="flex min-h-[180px] items-end bg-gradient-to-b from-muted/5 to-muted/20 p-4 pt-8">
            <div className="w-full">
              <BannerComponent {...bannerProps} />
            </div>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-muted-foreground/30">
          Стиль → вкладка «Оформление»
        </p>
      </div>
    </div>
  )
}
