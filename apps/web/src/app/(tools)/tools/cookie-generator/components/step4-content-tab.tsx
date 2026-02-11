'use client'

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import type { BannerCustomization } from './liquid-glass-island'
import { TONE_TEXTS, type ToneId, type TextState } from './island-panels/text-panel'
import { ClassicBanner, GlassBanner } from './banner-styles'
import type { BannerStyleProps } from './banner-styles/types'
import { BG_COLORS, BTN_COLORS, type ShadowLabel } from './island-panels'

/* ── Tone options ── */
const TONE_ROWS: { id: ToneId; label: string }[][] = [
  [
    { id: 'friendly', label: 'Дружелюбный' },
    { id: 'short', label: 'Короткий' },
    { id: 'official', label: 'Официальный' },
  ],
  [
    { id: 'creative', label: 'Креативный' },
    { id: 'detailed', label: 'Развёрнутый' },
  ],
]

/* ── Color helpers (same as banner-preview) ── */
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

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left column — Settings */}
      <div className="space-y-6">
        {/* Section: Tone */}
        <section>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Тон сообщения
          </h4>
          <div className="mt-3 flex flex-col gap-1.5">
            {TONE_ROWS.map((row, i) => (
              <div key={i} className="flex gap-1.5">
                {row.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTone(t.id)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                      text.tone === t.id
                        ? 'border-foreground/20 bg-foreground/[0.04] text-foreground shadow-sm'
                        : 'border-border bg-background text-muted-foreground hover:border-foreground/10 hover:text-foreground/70'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Section: Buttons */}
        <section>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Кнопки
          </h4>
          <div className="mt-3 space-y-3">
            {/* Accept — always on */}
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-9 shrink-0 items-center rounded-full bg-foreground/80 px-0.5">
                <div className="size-4 rounded-full bg-background shadow-sm translate-x-4" />
              </div>
              <input
                type="text"
                value={text.accept}
                onChange={(e) => updateText({ accept: e.target.value })}
                className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] text-foreground outline-none transition-colors focus:border-foreground/20"
                placeholder="Принять"
              />
            </div>

            {/* Decline — toggleable */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateText({ showDecline: !text.showDecline })}
                className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ${
                  text.showDecline ? 'bg-foreground/80' : 'bg-muted-foreground/20'
                }`}
              >
                <div
                  className={`size-4 rounded-full bg-background shadow-sm transition-transform duration-200 ${
                    text.showDecline ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <input
                type="text"
                value={text.decline}
                onChange={(e) => updateText({ decline: e.target.value })}
                disabled={!text.showDecline}
                className={`h-9 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] outline-none transition-colors focus:border-foreground/20 ${
                  text.showDecline ? 'text-foreground' : 'text-muted-foreground/30'
                }`}
                placeholder="Отклонить"
              />
            </div>

            {/* Settings — toggleable */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateText({ showSettings: !text.showSettings })}
                className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ${
                  text.showSettings ? 'bg-foreground/80' : 'bg-muted-foreground/20'
                }`}
              >
                <div
                  className={`size-4 rounded-full bg-background shadow-sm transition-transform duration-200 ${
                    text.showSettings ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <input
                type="text"
                value={text.settings}
                onChange={(e) => updateText({ settings: e.target.value })}
                disabled={!text.showSettings}
                className={`h-9 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] outline-none transition-colors focus:border-foreground/20 ${
                  text.showSettings ? 'text-foreground' : 'text-muted-foreground/30'
                }`}
                placeholder="Настроить"
              />
            </div>
          </div>
        </section>

        {/* Section: Policy link */}
        <section>
          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/50">
            Ссылка на политику
          </h4>
          <div className="mt-3 space-y-4">
            {/* Option A: Link word in text */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateText({ linkWordEnabled: !text.linkWordEnabled })}
                  className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ${
                    text.linkWordEnabled ? 'bg-foreground/80' : 'bg-muted-foreground/20'
                  }`}
                >
                  <div
                    className={`size-4 rounded-full bg-background shadow-sm transition-transform duration-200 ${
                      text.linkWordEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-[13px] text-foreground/80">Слово-ссылка в тексте</span>
              </div>
              {text.linkWordEnabled && (
                <div className="ml-12">
                  <input
                    type="text"
                    value={text.linkWord}
                    onChange={(e) => updateText({ linkWord: e.target.value })}
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground outline-none transition-colors focus:border-foreground/20"
                    placeholder="cookie"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground/50">
                    Это слово в тексте баннера станет кликабельной ссылкой
                  </p>
                </div>
              )}
            </div>

            {/* Option B: Separate link line */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateText({ linkLineEnabled: !text.linkLineEnabled })}
                  className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ${
                    text.linkLineEnabled ? 'bg-foreground/80' : 'bg-muted-foreground/20'
                  }`}
                >
                  <div
                    className={`size-4 rounded-full bg-background shadow-sm transition-transform duration-200 ${
                      text.linkLineEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-[13px] text-foreground/80">Отдельная строка-ссылка</span>
              </div>
              {text.linkLineEnabled && (
                <div className="ml-12">
                  <input
                    type="text"
                    value={text.linkLineText}
                    onChange={(e) => updateText({ linkLineText: e.target.value })}
                    className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground outline-none transition-colors focus:border-foreground/20"
                    placeholder="Подробнее о cookie"
                  />
                </div>
              )}
            </div>

            {/* Link target — shown when at least one link option enabled */}
            {(text.linkWordEnabled || text.linkLineEnabled) && (
              <div className="ml-12 space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
                  Куда ведёт ссылка
                </p>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateText({ linkTarget: 'popup' })}
                    className={`flex-1 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all duration-200 ${
                      text.linkTarget === 'popup'
                        ? 'border-foreground/20 bg-foreground/[0.04] text-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground/10'
                    }`}
                  >
                    Документ в попапе
                  </button>
                  <button
                    type="button"
                    onClick={() => updateText({ linkTarget: 'page' })}
                    className={`flex-1 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all duration-200 ${
                      text.linkTarget === 'page'
                        ? 'border-foreground/20 bg-foreground/[0.04] text-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground/10'
                    }`}
                  >
                    Ссылка на страницу
                  </button>
                </div>
                {text.linkTarget === 'popup' && (
                  <p className="text-[11px] leading-relaxed text-muted-foreground/50">
                    При клике откроется всплывающее окно с полным текстом cookie-политики
                  </p>
                )}
                {text.linkTarget === 'page' && (
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      value={text.linkUrl}
                      onChange={(e) => updateText({ linkUrl: e.target.value })}
                      className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground outline-none transition-colors focus:border-foreground/20"
                      placeholder="https://site.com/cookie-policy"
                    />
                    <p className="text-[11px] leading-relaxed text-muted-foreground/50">
                      Если страницы ещё нет — вы сможете создать её и добавить ссылку позже в личном кабинете
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Manual text editing — collapsible */}
        <section>
          <button
            type="button"
            onClick={() => setShowManualEdit(!showManualEdit)}
            className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground/70"
          >
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${showManualEdit ? 'rotate-180' : ''}`}
              strokeWidth={1.75}
            />
            Редактировать текст вручную
          </button>

          {showManualEdit && (
            <div className="mt-3 space-y-3 rounded-xl border border-dashed border-border/60 p-4">
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={text.title}
                  onChange={(e) => updateText({ title: e.target.value })}
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground outline-none transition-colors focus:border-foreground/20"
                  placeholder="Мы используем cookie"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
                  Описание
                </label>
                <textarea
                  value={text.desc}
                  onChange={(e) => updateText({ desc: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none transition-colors focus:border-foreground/20"
                  placeholder="Текст описания…"
                />
              </div>
              <p className="text-[11px] text-muted-foreground/40">
                Изменения сохраняются. При выборе нового тона текст обновится
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Right column — Banner Preview */}
      <div className="flex items-start justify-center lg:sticky lg:top-24">
        <div className="w-full max-w-md">
          {/* Preview label */}
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
            Предпросмотр
          </p>

          {/* Banner on neutral background */}
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/30 p-6">
            <div className="mx-auto max-w-sm">
              <BannerComponent {...bannerProps} />
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] text-muted-foreground/40">
            Стиль и позиция настраиваются на вкладке «Оформление»
          </p>
        </div>
      </div>
    </div>
  )
}
