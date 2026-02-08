'use client'

import { useState } from 'react'
import type { CookiePolicyData } from '@/lib/templates/cookie-policy'

interface CookiePolicyFormProps {
  data: Partial<CookiePolicyData>
  onChange: (data: Partial<CookiePolicyData>) => void
}

export function CookiePolicyForm({ data, onChange }: CookiePolicyFormProps) {
  // Local state for "Other" forms
  const [showExternalServicesForm, setShowExternalServicesForm] = useState(false)
  const [newExternalService, setNewExternalService] = useState('')

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleTechnicalFeatureToggle = (feature: keyof CookiePolicyData['technicalFeatures']) => {
    if (feature === 'externalServices') return // This is an array, not a boolean

    onChange({
      ...data,
      technicalFeatures: {
        ...data.technicalFeatures,
        cart: data.technicalFeatures?.cart || false,
        auth: data.technicalFeatures?.auth || false,
        payment: data.technicalFeatures?.payment || false,
        preferences: data.technicalFeatures?.preferences || false,
        externalServices: data.technicalFeatures?.externalServices || [],
        [feature]: !data.technicalFeatures?.[feature],
      },
    })
  }

  const handleAddExternalService = () => {
    if (!newExternalService.trim()) return

    onChange({
      ...data,
      technicalFeatures: {
        ...data.technicalFeatures,
        cart: data.technicalFeatures?.cart || false,
        auth: data.technicalFeatures?.auth || false,
        payment: data.technicalFeatures?.payment || false,
        preferences: data.technicalFeatures?.preferences || false,
        externalServices: [
          ...(data.technicalFeatures?.externalServices || []),
          { name: newExternalService.trim() },
        ],
      },
    })

    setNewExternalService('')
  }

  const handleRemoveExternalService = (index: number) => {
    onChange({
      ...data,
      technicalFeatures: {
        ...data.technicalFeatures,
        cart: data.technicalFeatures?.cart || false,
        auth: data.technicalFeatures?.auth || false,
        payment: data.technicalFeatures?.payment || false,
        preferences: data.technicalFeatures?.preferences || false,
        externalServices: data.technicalFeatures?.externalServices?.filter((_, i) => i !== index) || [],
      },
    })
  }

  const handleAnalyticsToggle = (tool: keyof CookiePolicyData['analytics']) => {
    if (tool === 'other') return // This is an array

    onChange({
      ...data,
      analytics: {
        ...data.analytics,
        yandexMetrika: data.analytics?.yandexMetrika || false,
        googleAnalytics: data.analytics?.googleAnalytics || false,
        liveInternet: data.analytics?.liveInternet || false,
        mailRu: data.analytics?.mailRu || false,
        topMailRu: data.analytics?.topMailRu || false,
        matomo: data.analytics?.matomo || false,
        other: data.analytics?.other || [],
        [tool]: !data.analytics?.[tool],
      },
    })
  }

  const handleCrossBorderToggle = (service: keyof CookiePolicyData['crossBorder']) => {
    if (service === 'other') return // This is an array

    onChange({
      ...data,
      crossBorder: {
        ...data.crossBorder,
        googleServices: data.crossBorder?.googleServices || false,
        facebookPixel: data.crossBorder?.facebookPixel || false,
        other: data.crossBorder?.other || [],
        [service]: !data.crossBorder?.[service],
      },
    })
  }

  const handleMarketingToggle = (tool: keyof CookiePolicyData['marketing']) => {
    if (tool === 'other') return // This is an array

    const newMarketing = {
      ...data.marketing,
      yandexDirect: data.marketing?.yandexDirect || false,
      yandexAudiences: data.marketing?.yandexAudiences || false,
      vkAds: data.marketing?.vkAds || false,
      googleAds: data.marketing?.googleAds || false,
      facebookAds: data.marketing?.facebookAds || false,
      telegramAds: data.marketing?.telegramAds || false,
      okAds: data.marketing?.okAds || false,
      other: data.marketing?.other || [],
      [tool]: !data.marketing?.[tool],
    }

    // Auto-enable cross-border if Google/Facebook selected
    const shouldEnableCrossBorder = newMarketing.googleAds || newMarketing.facebookAds

    onChange({
      ...data,
      marketing: newMarketing,
      crossBorder: shouldEnableCrossBorder
        ? {
            ...data.crossBorder,
            googleServices: newMarketing.googleAds || data.crossBorder?.googleServices || false,
            facebookPixel: newMarketing.facebookAds || data.crossBorder?.facebookPixel || false,
            other: data.crossBorder?.other || [],
          }
        : data.crossBorder,
    })
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary ring-1 ring-primary/10">
          2
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">Настройки сайта</h3>
          <p className="text-sm text-muted-foreground">
            Расскажите о функциях и сервисах, которые используются на вашем сайте
          </p>
        </div>
      </div>

      {/* ========================================================================
          BLOCK 1: TECHNICAL FEATURES (Технические функции сайта)
          ======================================================================== */}
      <div className="space-y-4">
        <div>
          <h4 className="text-[13px] font-medium text-foreground">
            Какие функции доступны на вашем сайте?
          </h4>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Выберите функции, которые используются на вашем сайте. Это поможет корректно составить политику.
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Cart */}
          <label className="group flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.technicalFeatures?.cart || false}
              onChange={() => handleTechnicalFeatureToggle('cart')}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="flex-1 space-y-0.5">
              <span className="text-[13px] font-medium text-foreground">
                Корзина заказов
              </span>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Возможность добавлять товары или услуги в корзину покупок
              </p>
            </div>
          </label>

          {/* Auth */}
          <label className="group flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.technicalFeatures?.auth || false}
              onChange={() => handleTechnicalFeatureToggle('auth')}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="flex-1 space-y-0.5">
              <span className="text-[13px] font-medium text-foreground">
                Личный кабинет / Регистрация
              </span>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Авторизация пользователей (вход по логину-паролю или SMS)
              </p>
            </div>
          </label>

          {/* Payment */}
          <label className="group flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.technicalFeatures?.payment || false}
              onChange={() => handleTechnicalFeatureToggle('payment')}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="flex-1 space-y-0.5">
              <span className="text-[13px] font-medium text-foreground">
                Онлайн-оплата
              </span>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Эквайринг, ввод данных карты, переход на платежный шлюз
              </p>
            </div>
          </label>

          {/* Preferences */}
          <label className="group flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.technicalFeatures?.preferences || false}
              onChange={() => handleTechnicalFeatureToggle('preferences')}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="flex-1 space-y-0.5">
              <span className="text-[13px] font-medium text-foreground">
                Избранное / Сравнение / Выбор города
              </span>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Сохранение пользовательских настроек и предпочтений
              </p>
            </div>
          </label>

          {/* External Services (Chat widgets, etc.) */}
          <div className="rounded-lg border border-border/60 bg-card/40 p-3.5">
            <button
              type="button"
              onClick={() => setShowExternalServicesForm(!showExternalServicesForm)}
              className="flex w-full cursor-pointer items-start gap-3 text-left transition-all"
            >
              <div
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  showExternalServicesForm || (data.technicalFeatures?.externalServices?.length ?? 0) > 0
                    ? 'border-primary bg-primary'
                    : 'border-input bg-background'
                }`}
              >
                {(showExternalServicesForm || (data.technicalFeatures?.externalServices?.length ?? 0) > 0) && (
                  <svg className="size-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <span className="text-[13px] font-medium text-foreground">
                  Средства взаимодействия с посетителями
                </span>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  Виджеты онлайн-чатов, системы связи, коммуникационные сервисы
                </p>
              </div>
              <svg
                className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform ${showExternalServicesForm ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* External Services Form */}
            {showExternalServicesForm && (
              <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
                <p className="text-[13px] text-muted-foreground">
                  Укажите названия сервисов, которые используются на вашем сайте для общения с посетителями (например, JivoSite, Битрикс24, Carrot Quest)
                </p>

                {/* Added services list */}
                {(data.technicalFeatures?.externalServices?.length ?? 0) > 0 && (
                  <div className="space-y-2">
                    {data.technicalFeatures?.externalServices?.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/60 px-3 py-2"
                      >
                        <svg className="size-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1 text-[13px] font-medium text-foreground">
                          {service.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExternalService(index)}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new service */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExternalService}
                    onChange={(e) => setNewExternalService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddExternalService()
                      }
                    }}
                    placeholder="Название сервиса (например, JivoSite)"
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddExternalService}
                    disabled={!newExternalService.trim()}
                    className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Добавить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================
          BLOCK 2: ANALYTICS (Аналитика)
          ======================================================================== */}
      <div className="space-y-4">
        <div>
          <h4 className="text-[13px] font-medium text-foreground">
            Используете ли вы инструменты аналитики?
          </h4>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Системы веб-аналитики помогают отслеживать посещаемость сайта. Укажите, какие инструменты вы используете.
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Yandex Metrika */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.analytics?.yandexMetrika || false}
              onChange={() => handleAnalyticsToggle('yandexMetrika')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Яндекс.Метрика</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Google Analytics */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.analytics?.googleAnalytics || false}
              onChange={() => handleAnalyticsToggle('googleAnalytics')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Google Analytics</span>
            <span className="ml-auto rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning">
              США
            </span>
          </label>

          {/* LiveInternet */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.analytics?.liveInternet || false}
              onChange={() => handleAnalyticsToggle('liveInternet')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">LiveInternet</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Рейтинг Mail.ru */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.analytics?.mailRu || false}
              onChange={() => handleAnalyticsToggle('mailRu')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Рейтинг Mail.ru</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Top@Mail.ru */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.analytics?.topMailRu || false}
              onChange={() => handleAnalyticsToggle('topMailRu')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Top@Mail.ru</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Matomo (Piwik) */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.analytics?.matomo || false}
              onChange={() => handleAnalyticsToggle('matomo')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Matomo (Piwik)</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Self-hosted
            </span>
          </label>
        </div>
      </div>

      {/* ========================================================================
          BLOCK 3: CROSS-BORDER TRANSFER (Трансграничная передача)
          ======================================================================== */}
      <div className="space-y-4">
        <div>
          <h4 className="text-[13px] font-medium text-foreground">
            Используете ли вы иностранные сервисы?
          </h4>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Некоторые сервисы (Google, Facebook) передают данные на серверы за пределами РФ. Это требует специального указания в политике.
          </p>
        </div>

        {/* Expert warning */}
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/90">
            <span className="font-medium text-foreground">Согласно ФЗ-152,</span> при использовании иностранных сервисов необходимо указать факт трансграничной передачи данных. Это защитит вас от претензий регуляторов.
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Google */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.crossBorder?.googleServices || false}
              onChange={() => handleCrossBorderToggle('googleServices')}
              disabled={data.marketing?.googleAds} // Auto-enabled if Google Ads selected
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="text-[13px] font-medium text-foreground">
              Google Analytics / Google Ads
            </span>
            <span className="ml-auto rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning">
              США
            </span>
          </label>

          {/* Facebook */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.crossBorder?.facebookPixel || false}
              onChange={() => handleCrossBorderToggle('facebookPixel')}
              disabled={data.marketing?.facebookAds} // Auto-enabled if Facebook Ads selected
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="text-[13px] font-medium text-foreground">
              Facebook Pixel / Meta Ads
            </span>
            <span className="ml-auto rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning">
              США
            </span>
          </label>
        </div>
      </div>

      {/* ========================================================================
          BLOCK 4: MARKETING/RETARGETING (Реклама и ретаргетинг)
          ======================================================================== */}
      <div className="space-y-4">
        <div>
          <h4 className="text-[13px] font-medium text-foreground">
            Показываете ли вы рекламу на сайте?
          </h4>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Если вы используете рекламные системы или пиксели для ретаргетинга, это нужно указать в политике.
          </p>
        </div>

        <div className="space-y-2.5">
          {/* Yandex Direct */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.marketing?.yandexDirect || false}
              onChange={() => handleMarketingToggle('yandexDirect')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Яндекс.Директ</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Yandex Audiences */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.marketing?.yandexAudiences || false}
              onChange={() => handleMarketingToggle('yandexAudiences')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Яндекс Аудитории</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* VK Ads */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.marketing?.vkAds || false}
              onChange={() => handleMarketingToggle('vkAds')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">VK Реклама (myTarget)</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Odnoklassniki Ads */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.marketing?.okAds || false}
              onChange={() => handleMarketingToggle('okAds')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Одноклассники (myTarget)</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Telegram Ads */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.marketing?.telegramAds || false}
              onChange={() => handleMarketingToggle('telegramAds')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Telegram Ads</span>
            <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              РФ
            </span>
          </label>

          {/* Google Ads */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.marketing?.googleAds || false}
              onChange={() => handleMarketingToggle('googleAds')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Google Ads</span>
            <span className="ml-auto rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning">
              США
            </span>
          </label>

          {/* Facebook Ads */}
          <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 transition-all hover:border-border hover:bg-card/60">
            <input
              type="checkbox"
              checked={data.marketing?.facebookAds || false}
              onChange={() => handleMarketingToggle('facebookAds')}
              className="size-4 shrink-0 cursor-pointer rounded border-input text-primary transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <span className="text-[13px] font-medium text-foreground">Facebook Ads</span>
            <span className="ml-auto rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning">
              США
            </span>
          </label>
        </div>
      </div>

      {/* Bottom Info Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-muted/40 bg-muted/20 p-4">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/60">
          <svg className="size-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="space-y-1.5">
          <p className="text-[13px] font-medium text-foreground">
            Выбирайте только то, что действительно используется
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Указывайте в политике только те сервисы и функции, которые реально работают на вашем сайте. Это обеспечит юридическую точность документа.
          </p>
        </div>
      </div>
    </div>
  )
}
