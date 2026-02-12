'use client'

import { useState, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
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
    <div className="grid items-start gap-8 md:grid-cols-2">

      {/* ── LEFT: Settings ── */}
      <div className="space-y-6">

        {/* Tone */}
        <div>
          <p className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50">
            Тон сообщения
          </p>
          <div className="flex flex-wrap gap-1">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTone(t.id)}
                className={`rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150 ${
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
          <p className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50">
            Кнопки
          </p>
          <div className="space-y-0.5">
            {/* Accept — always on */}
            <div className="flex items-center gap-3 py-2.5">
              <label className="flex shrink-0 cursor-not-allowed items-center">
                <input
                  type="checkbox"
                  className="cb"
                  checked
                  disabled
                  style={{ opacity: 0.35 }}
                />
              </label>
              <input
                type="text"
                value={text.accept}
                onChange={(e) => updateText({ accept: e.target.value })}
                className="flex-1 border-b border-transparent bg-transparent px-0 py-0.5 text-[14px] font-medium text-foreground/90 transition-colors focus:border-border focus:outline-none"
                placeholder="Принять"
                spellCheck={false}
              />
              <span className="text-[11px] text-muted-foreground/35">обяз.</span>
            </div>

            {/* Decline */}
            <div className="flex items-center gap-3 py-2.5">
              <label className="flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="cb"
                  checked={text.showDecline}
                  onChange={(e) => updateText({ showDecline: e.target.checked })}
                />
              </label>
              <input
                type="text"
                value={text.decline}
                onChange={(e) => updateText({ decline: e.target.value })}
                disabled={!text.showDecline}
                className={`flex-1 border-b border-transparent bg-transparent px-0 py-0.5 text-[14px] font-medium transition-colors focus:border-border focus:outline-none ${
                  text.showDecline ? 'text-foreground/90' : 'text-muted-foreground/30'
                }`}
                placeholder="Отклонить"
                spellCheck={false}
              />
            </div>

            {/* Settings */}
            <div className="flex items-center gap-3 py-2.5">
              <label className="flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="cb"
                  checked={text.showSettings}
                  onChange={(e) => updateText({ showSettings: e.target.checked })}
                />
              </label>
              <input
                type="text"
                value={text.settings}
                onChange={(e) => updateText({ settings: e.target.value })}
                disabled={!text.showSettings}
                className={`flex-1 border-b border-transparent bg-transparent px-0 py-0.5 text-[14px] font-medium transition-colors focus:border-border focus:outline-none ${
                  text.showSettings ? 'text-foreground/90' : 'text-muted-foreground/30'
                }`}
                placeholder="Настроить"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50">
            Ссылка на политику
          </p>
          <div className="space-y-0.5">
            {/* Word link */}
            <div>
              <label className="group flex cursor-pointer items-center gap-3 py-2.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  className="cb"
                  checked={text.linkWordEnabled}
                  onChange={() => updateText({ linkWordEnabled: !text.linkWordEnabled })}
                />
                <span className="text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
                  Слово-ссылка в тексте
                </span>
              </label>
              {text.linkWordEnabled && (
                <div className="expand-enter ml-[1.875rem] mt-1 space-y-2 border-l-2 border-border pl-4">
                  <input
                    type="text"
                    value={text.linkWord}
                    onChange={(e) => updateText({ linkWord: e.target.value })}
                    className="w-full border-b border-border bg-transparent px-0 py-2 text-[13px] text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
                    placeholder="cookie"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Line link */}
            <div>
              <label className="group flex cursor-pointer items-center gap-3 py-2.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  className="cb"
                  checked={text.linkLineEnabled}
                  onChange={() => updateText({ linkLineEnabled: !text.linkLineEnabled })}
                />
                <span className="text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
                  Строка «Подробнее»
                </span>
              </label>
              {text.linkLineEnabled && (
                <div className="expand-enter ml-[1.875rem] mt-1 space-y-2 border-l-2 border-border pl-4">
                  <input
                    type="text"
                    value={text.linkLineText}
                    onChange={(e) => updateText({ linkLineText: e.target.value })}
                    className="w-full border-b border-border bg-transparent px-0 py-2 text-[13px] text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
                    placeholder="Подробнее о cookie..."
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Link target — shown when at least one link type is enabled */}
            {(text.linkWordEnabled || text.linkLineEnabled) && (
              <div className="expand-enter ml-[1.875rem] mt-2 border-l-2 border-border pl-4">
                <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50">
                  Куда ведёт
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateText({ linkTarget: 'popup' })}
                    className={`flex-1 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150 ${
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
                    className={`flex-1 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150 ${
                      text.linkTarget === 'page'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground/70'
                    }`}
                  >
                    Страница
                  </button>
                </div>
                {text.linkTarget === 'page' && (
                  <input
                    type="url"
                    value={text.linkUrl}
                    onChange={(e) => updateText({ linkUrl: e.target.value })}
                    className="mt-2 w-full border-b border-border bg-transparent px-0 py-2 text-[13px] text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
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
            className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground/60 transition-colors duration-150 hover:text-foreground/70"
          >
            <ChevronRight
              className={`size-3.5 transition-transform duration-150 ${showManualEdit ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
            Редактировать вручную
          </button>

          <div
            className="grid transition-[grid-template-rows] duration-200 ease-out"
            style={{ gridTemplateRows: showManualEdit ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 pt-3">
                <div>
                  <label
                    htmlFor="m-title"
                    className="mb-2 block text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50"
                  >
                    Заголовок
                  </label>
                  <input
                    id="m-title"
                    type="text"
                    value={text.title}
                    onChange={(e) => updateText({ title: e.target.value })}
                    className="w-full border-b border-border bg-transparent px-0 py-2 text-[14px] text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
                    placeholder="Мы используем cookie"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <label
                    htmlFor="m-desc"
                    className="mb-2 block text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50"
                  >
                    Описание
                  </label>
                  <textarea
                    id="m-desc"
                    value={text.desc}
                    onChange={(e) => updateText({ desc: e.target.value })}
                    rows={2}
                    className="w-full resize-none border-b border-border bg-transparent px-0 py-2 text-[14px] text-foreground transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
                    placeholder="Текст описания..."
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Banner preview ── */}
      <div className="md:sticky md:top-20">
        <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
              Предпросмотр
            </span>
            <span className="text-[11px] text-muted-foreground/30">
              {TONES.find(t => t.id === text.tone)?.label}
            </span>
          </div>

          {/* Banner */}
          <div className="flex items-end px-4 py-6">
            <div className="w-full">
              <BannerComponent {...bannerProps} />
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[11px] text-muted-foreground/30">
          Стиль — вкладка «Оформление»
        </p>
      </div>
    </div>
  )
}
