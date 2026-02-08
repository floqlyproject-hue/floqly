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
  const [showAnalyticsOtherForm, setShowAnalyticsOtherForm] = useState(false)
  const [newAnalyticService, setNewAnalyticService] = useState('')

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
        security: data.technicalFeatures?.security || false,
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
        security: data.technicalFeatures?.security || false,
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
        security: data.technicalFeatures?.security || false,
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
        liveInternet: data.analytics?.liveInternet || false,
        mailRu: data.analytics?.mailRu || false,
        customAnalytics: data.analytics?.customAnalytics || false,
        other: data.analytics?.other || [],
        [tool]: !data.analytics?.[tool],
      },
    })
  }

  const handleAddAnalyticService = () => {
    if (!newAnalyticService.trim()) return

    onChange({
      ...data,
      analytics: {
        ...data.analytics,
        yandexMetrika: data.analytics?.yandexMetrika || false,
        liveInternet: data.analytics?.liveInternet || false,
        mailRu: data.analytics?.mailRu || false,
        customAnalytics: data.analytics?.customAnalytics || false,
        other: [
          ...(data.analytics?.other || []),
          { name: newAnalyticService.trim() },
        ],
      },
    })

    setNewAnalyticService('')
  }

  const handleRemoveAnalyticService = (index: number) => {
    onChange({
      ...data,
      analytics: {
        ...data.analytics,
        yandexMetrika: data.analytics?.yandexMetrika || false,
        liveInternet: data.analytics?.liveInternet || false,
        mailRu: data.analytics?.mailRu || false,
        customAnalytics: data.analytics?.customAnalytics || false,
        other: data.analytics?.other?.filter((_, i) => i !== index) || [],
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
    <div className="space-y-7">
      {/* Section Header - SAME STYLE AS STEP 1 */}
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
          Настройки сайта
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          Расскажите о функциях и сервисах, которые используются на вашем сайте
        </p>
      </div>

      {/* Form Blocks */}
      <div className="space-y-6">
        {/* ========================================================================
            BLOCK 1: TECHNICAL FEATURES (Технические функции сайта)
            ======================================================================== */}
        <fieldset className="space-y-3">
          <legend className="text-[13px] font-medium text-foreground">
            Какие функции доступны на вашем сайте?
          </legend>
          <p className="text-[12px] leading-relaxed text-muted-foreground/70">
            Выберите функции, которые используются на вашем сайте. Это поможет корректно составить политику.
          </p>

          <div className="space-y-2">
            {/* Cart */}
            <label className="group flex cursor-pointer gap-2.5 py-1.5 transition-colors duration-150 hover:text-foreground">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.cart || false}
                onChange={() => handleTechnicalFeatureToggle('cart')}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <div className="flex-1">
                <span className="block text-[13px] font-medium text-foreground/90 group-hover:text-foreground">
                  Корзина заказов
                </span>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                  Возможность добавлять товары или услуги в корзину покупок
                </p>
              </div>
            </label>

            {/* Auth */}
            <label className="group flex cursor-pointer gap-2.5 py-1.5 transition-colors duration-150 hover:text-foreground">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.auth || false}
                onChange={() => handleTechnicalFeatureToggle('auth')}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <div className="flex-1">
                <span className="block text-[13px] font-medium text-foreground/90 group-hover:text-foreground">
                  Личный кабинет / Регистрация
                </span>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                  Авторизация пользователей (вход по логину-паролю или SMS)
                </p>
              </div>
            </label>

            {/* Payment */}
            <label className="group flex cursor-pointer gap-2.5 py-1.5 transition-colors duration-150 hover:text-foreground">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.payment || false}
                onChange={() => handleTechnicalFeatureToggle('payment')}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <div className="flex-1">
                <span className="block text-[13px] font-medium text-foreground/90 group-hover:text-foreground">
                  Онлайн-оплата
                </span>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                  Эквайринг, ввод данных карты, переход на платежный шлюз
                </p>
              </div>
            </label>

            {/* Preferences */}
            <label className="group flex cursor-pointer gap-2.5 py-1.5 transition-colors duration-150 hover:text-foreground">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.preferences || false}
                onChange={() => handleTechnicalFeatureToggle('preferences')}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <div className="flex-1">
                <span className="block text-[13px] font-medium text-foreground/90 group-hover:text-foreground">
                  Избранное / Сравнение / Выбор города
                </span>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                  Сохранение пользовательских настроек и предпочтений
                </p>
              </div>
            </label>

            {/* Security */}
            <label className="group flex cursor-pointer gap-2.5 py-1.5 transition-colors duration-150 hover:text-foreground">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.security || false}
                onChange={() => handleTechnicalFeatureToggle('security')}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <div className="flex-1">
                <span className="block text-[13px] font-medium text-foreground/90 group-hover:text-foreground">
                  Защита от ботов (CAPTCHA)
                </span>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                  Системы защиты от автоматизированных атак и спама
                </p>
              </div>
            </label>

            {/* External Services (Chat widgets, etc.) - Collapsible */}
            <div>
              <label className="group flex cursor-pointer gap-2.5 py-1.5 transition-colors duration-150 hover:text-foreground">
                <input
                  type="checkbox"
                  checked={showExternalServicesForm || (data.technicalFeatures?.externalServices?.length ?? 0) > 0}
                  onChange={() => setShowExternalServicesForm(!showExternalServicesForm)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
                />
                <div className="flex-1">
                  <span className="block text-[13px] font-medium text-foreground/90 group-hover:text-foreground">
                    Средства взаимодействия с посетителями
                  </span>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                    Виджеты онлайн-чатов, системы связи, коммуникационные сервисы
                  </p>
                </div>
              </label>

              {/* External Services Form */}
              {showExternalServicesForm && (
                <div className="ml-6.5 mt-3 space-y-3 border-l border-border pl-4">
                  <p className="text-[12px] leading-relaxed text-muted-foreground/70">
                    Укажите названия сервисов, которые используются на вашем сайте для общения с посетителями (например, JivoSite, Битрикс24, Carrot Quest)
                  </p>

                  {/* Added services list */}
                  {(data.technicalFeatures?.externalServices?.length ?? 0) > 0 && (
                    <div className="space-y-1.5">
                      {data.technicalFeatures?.externalServices?.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
                        >
                          <svg className="size-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="flex-1 text-[13px] text-foreground">
                            {service.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExternalService(index)}
                            className="shrink-0 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                          >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground transition-colors duration-150 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                    />
                    <button
                      type="button"
                      onClick={handleAddExternalService}
                      disabled={!newExternalService.trim()}
                      className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity duration-150 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* ========================================================================
            BLOCK 2: ANALYTICS (Аналитика)
            ======================================================================== */}
        <fieldset className="space-y-3">
          <legend className="text-[13px] font-medium text-foreground">
            Используете ли вы инструменты аналитики?
          </legend>
          <p className="text-[12px] leading-relaxed text-muted-foreground/70">
            Системы веб-аналитики помогают отслеживать посещаемость сайта. Укажите, какие инструменты вы используете.
          </p>

          <div className="space-y-2">
            {/* Yandex Metrika */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.analytics?.yandexMetrika || false}
                onChange={() => handleAnalyticsToggle('yandexMetrika')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Яндекс.Метрика
              </span>
            </label>

            {/* LiveInternet */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.analytics?.liveInternet || false}
                onChange={() => handleAnalyticsToggle('liveInternet')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                LiveInternet
              </span>
            </label>

            {/* Рейтинг Mail.ru */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.analytics?.mailRu || false}
                onChange={() => handleAnalyticsToggle('mailRu')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Рейтинг Mail.ru
              </span>
            </label>

            {/* Custom Analytics (Server-side) */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.analytics?.customAnalytics || false}
                onChange={() => handleAnalyticsToggle('customAnalytics')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Собственная статистика сервера
              </span>
            </label>

            {/* Other Analytics - Collapsible */}
            <div>
              <label className="group flex cursor-pointer gap-2.5 py-1.5 transition-colors duration-150 hover:text-foreground">
                <input
                  type="checkbox"
                  checked={showAnalyticsOtherForm || (data.analytics?.other?.length ?? 0) > 0}
                  onChange={() => setShowAnalyticsOtherForm(!showAnalyticsOtherForm)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
                />
                <div className="flex-1">
                  <span className="block text-[13px] font-medium text-foreground/90 group-hover:text-foreground">
                    Другое
                  </span>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                    Укажите другие системы аналитики, если используете
                  </p>
                </div>
              </label>

              {/* Other Analytics Form */}
              {showAnalyticsOtherForm && (
                <div className="ml-6.5 mt-3 space-y-3 border-l border-border pl-4">
                  <p className="text-[12px] leading-relaxed text-muted-foreground/70">
                    Укажите названия других систем аналитики, которые используются на вашем сайте
                  </p>

                  {/* Added services list */}
                  {(data.analytics?.other?.length ?? 0) > 0 && (
                    <div className="space-y-1.5">
                      {data.analytics?.other?.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
                        >
                          <svg className="size-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="flex-1 text-[13px] text-foreground">
                            {service.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAnalyticService(index)}
                            className="shrink-0 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                          >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                      value={newAnalyticService}
                      onChange={(e) => setNewAnalyticService(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddAnalyticService()
                        }
                      }}
                      placeholder="Название сервиса аналитики"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground transition-colors duration-150 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                    />
                    <button
                      type="button"
                      onClick={handleAddAnalyticService}
                      disabled={!newAnalyticService.trim()}
                      className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity duration-150 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* ========================================================================
            BLOCK 3: CROSS-BORDER TRANSFER (Трансграничная передача)
            ======================================================================== */}
        <fieldset className="space-y-3">
          <legend className="text-[13px] font-medium text-foreground">
            Используете ли вы иностранные сервисы?
          </legend>
          <p className="text-[12px] leading-relaxed text-muted-foreground/70">
            Некоторые сервисы (Google, Facebook) передают данные на серверы за пределами РФ. Это требует специального указания в политике.
          </p>

          {/* Simplified warning */}
          <div className="flex items-start gap-2.5 rounded-lg border border-border bg-background px-3.5 py-3">
            <svg aria-hidden="true" className="mt-px size-4 shrink-0 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <p className="text-[12px] leading-relaxed text-foreground/70">
              <span className="font-medium text-foreground">Согласно ФЗ-152,</span> при использовании иностранных сервисов необходимо указать факт трансграничной передачи данных. Это защитит вас от претензий регуляторов.
            </p>
          </div>

          <div className="space-y-2">
            {/* Google */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.crossBorder?.googleServices || false}
                onChange={() => handleCrossBorderToggle('googleServices')}
                disabled={data.marketing?.googleAds}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Google Analytics / Google Ads
              </span>
            </label>

            {/* Facebook */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.crossBorder?.facebookPixel || false}
                onChange={() => handleCrossBorderToggle('facebookPixel')}
                disabled={data.marketing?.facebookAds}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Facebook Pixel / Meta Ads
              </span>
            </label>
          </div>
        </fieldset>

        {/* ========================================================================
            BLOCK 4: MARKETING/RETARGETING (Реклама и ретаргетинг)
            ======================================================================== */}
        <fieldset className="space-y-3">
          <legend className="text-[13px] font-medium text-foreground">
            Показываете ли вы рекламу на сайте?
          </legend>
          <p className="text-[12px] leading-relaxed text-muted-foreground/70">
            Если вы используете рекламные системы или пиксели для ретаргетинга, это нужно указать в политике.
          </p>

          <div className="space-y-2">
            {/* Yandex Direct */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.yandexDirect || false}
                onChange={() => handleMarketingToggle('yandexDirect')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Яндекс.Директ
              </span>
            </label>

            {/* Yandex Audiences */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.yandexAudiences || false}
                onChange={() => handleMarketingToggle('yandexAudiences')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Яндекс Аудитории
              </span>
            </label>

            {/* VK Ads */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.vkAds || false}
                onChange={() => handleMarketingToggle('vkAds')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                VK Реклама (myTarget)
              </span>
            </label>

            {/* Odnoklassniki Ads */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.okAds || false}
                onChange={() => handleMarketingToggle('okAds')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Одноклассники (myTarget)
              </span>
            </label>

            {/* Telegram Ads */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.telegramAds || false}
                onChange={() => handleMarketingToggle('telegramAds')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Telegram Ads
              </span>
            </label>

            {/* Google Ads */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.googleAds || false}
                onChange={() => handleMarketingToggle('googleAds')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Google Ads
              </span>
            </label>

            {/* Facebook Ads */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.facebookAds || false}
                onChange={() => handleMarketingToggle('facebookAds')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Facebook Ads
              </span>
            </label>
          </div>
        </fieldset>

        {/* Bottom Info Notice - Simplified */}
        <div className="flex items-start gap-2.5 rounded-lg border border-border bg-background px-3.5 py-3">
          <svg aria-hidden="true" className="mt-px size-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-[12px] font-medium leading-relaxed text-foreground/90">
              Выбирайте только то, что действительно используется
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
              Указывайте в политике только те сервисы и функции, которые реально работают на вашем сайте. Это обеспечит юридическую точность документа.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
