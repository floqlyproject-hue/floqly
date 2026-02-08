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
  const [showCrossBorderOtherForm, setShowCrossBorderOtherForm] = useState(false)
  const [newCrossBorderService, setNewCrossBorderService] = useState('')
  const [showPartnerNetworksForm, setShowPartnerNetworksForm] = useState(false)
  const [newPartnerNetwork, setNewPartnerNetwork] = useState('')
  const [showMarketingOtherForm, setShowMarketingOtherForm] = useState(false)
  const [newMarketingService, setNewMarketingService] = useState('')

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

  const handleAddCrossBorderService = () => {
    if (!newCrossBorderService.trim()) return

    onChange({
      ...data,
      crossBorder: {
        ...data.crossBorder,
        googleServices: data.crossBorder?.googleServices || false,
        facebookPixel: data.crossBorder?.facebookPixel || false,
        other: [
          ...(data.crossBorder?.other || []),
          { name: newCrossBorderService.trim() },
        ],
      },
    })

    setNewCrossBorderService('')
  }

  const handleRemoveCrossBorderService = (index: number) => {
    onChange({
      ...data,
      crossBorder: {
        ...data.crossBorder,
        googleServices: data.crossBorder?.googleServices || false,
        facebookPixel: data.crossBorder?.facebookPixel || false,
        other: data.crossBorder?.other?.filter((_, i) => i !== index) || [],
      },
    })
  }

  const handleMarketingToggle = (tool: keyof CookiePolicyData['marketing']) => {
    if (tool === 'other' || tool === 'partnerNetworks') return // These are arrays

    onChange({
      ...data,
      marketing: {
        ...data.marketing,
        vkPixel: data.marketing?.vkPixel || false,
        myTarget: data.marketing?.myTarget || false,
        yandexDirect: data.marketing?.yandexDirect || false,
        partnerNetworks: data.marketing?.partnerNetworks || [],
        other: data.marketing?.other || [],
        [tool]: !data.marketing?.[tool],
      },
    })
  }

  const handleAddPartnerNetwork = () => {
    if (!newPartnerNetwork.trim()) return

    onChange({
      ...data,
      marketing: {
        ...data.marketing,
        vkPixel: data.marketing?.vkPixel || false,
        myTarget: data.marketing?.myTarget || false,
        yandexDirect: data.marketing?.yandexDirect || false,
        partnerNetworks: [
          ...(data.marketing?.partnerNetworks || []),
          { name: newPartnerNetwork.trim() },
        ],
        other: data.marketing?.other || [],
      },
    })

    setNewPartnerNetwork('')
  }

  const handleRemovePartnerNetwork = (index: number) => {
    onChange({
      ...data,
      marketing: {
        ...data.marketing,
        vkPixel: data.marketing?.vkPixel || false,
        myTarget: data.marketing?.myTarget || false,
        yandexDirect: data.marketing?.yandexDirect || false,
        partnerNetworks: data.marketing?.partnerNetworks?.filter((_, i) => i !== index) || [],
        other: data.marketing?.other || [],
      },
    })
  }

  const handleAddMarketingService = () => {
    if (!newMarketingService.trim()) return

    onChange({
      ...data,
      marketing: {
        ...data.marketing,
        vkPixel: data.marketing?.vkPixel || false,
        myTarget: data.marketing?.myTarget || false,
        yandexDirect: data.marketing?.yandexDirect || false,
        partnerNetworks: data.marketing?.partnerNetworks || [],
        other: [
          ...(data.marketing?.other || []),
          { name: newMarketingService.trim() },
        ],
      },
    })

    setNewMarketingService('')
  }

  const handleRemoveMarketingService = (index: number) => {
    onChange({
      ...data,
      marketing: {
        ...data.marketing,
        vkPixel: data.marketing?.vkPixel || false,
        myTarget: data.marketing?.myTarget || false,
        yandexDirect: data.marketing?.yandexDirect || false,
        partnerNetworks: data.marketing?.partnerNetworks || [],
        other: data.marketing?.other?.filter((_, i) => i !== index) || [],
      },
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
          Что использует ваш сайт?
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          Отметьте функции и сервисы, которые работают на вашем сайте
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
            Отметьте функции, которые есть на вашем сайте — это нужно для правильного оформления документа.
          </p>

          <div className="space-y-2">
            {/* Cart */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.cart || false}
                onChange={() => handleTechnicalFeatureToggle('cart')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Корзина покупок и товары
              </span>
            </label>

            {/* Auth */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.auth || false}
                onChange={() => handleTechnicalFeatureToggle('auth')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Авторизация и личный кабинет
              </span>
            </label>

            {/* Payment */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.payment || false}
                onChange={() => handleTechnicalFeatureToggle('payment')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Приём платежей на сайте
              </span>
            </label>

            {/* Preferences */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.preferences || false}
                onChange={() => handleTechnicalFeatureToggle('preferences')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex flex-1 items-center gap-1.5 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Избранное и пользовательские настройки
                <span className="group/tooltip relative inline-flex">
                  <svg
                    className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors duration-150 hover:text-foreground/60"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-label="Подробнее"
                  >
                    <circle cx="8" cy="8" r="8" opacity="0.12" />
                    <path d="M8 7.5v3M8 5.5h.01M15 8A7 7 0 111 8a7 7 0 0114 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-56 -translate-x-1/2 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-normal leading-relaxed text-foreground/80 opacity-0 transition-opacity duration-150 group-hover/tooltip:block group-hover/tooltip:opacity-100">
                    Добавление товаров в избранное, сравнение характеристик, выбор города или региона, сохранение предпочтений интерфейса
                    <span className="absolute left-1/2 top-full -mt-px size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-background" />
                  </span>
                </span>
              </span>
            </label>

            {/* Security */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.technicalFeatures?.security || false}
                onChange={() => handleTechnicalFeatureToggle('security')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex flex-1 items-center gap-1.5 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Защита от спама и ботов
                <span className="group/tooltip relative inline-flex">
                  <svg
                    className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors duration-150 hover:text-foreground/60"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-label="Подробнее"
                  >
                    <circle cx="8" cy="8" r="8" opacity="0.12" />
                    <path d="M8 7.5v3M8 5.5h.01M15 8A7 7 0 111 8a7 7 0 0114 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-56 -translate-x-1/2 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-normal leading-relaxed text-foreground/80 opacity-0 transition-opacity duration-150 group-hover/tooltip:block group-hover/tooltip:opacity-100">
                    CAPTCHA-системы (Google reCAPTCHA, Яндекс SmartCaptcha, hCaptcha) для защиты форм от автоматических отправок
                    <span className="absolute left-1/2 top-full -mt-px size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-background" />
                  </span>
                </span>
              </span>
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
                    Онлайн-чаты и виджеты связи
                  </span>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground/70">
                    Виджеты для общения с посетителями (чаты, мессенджеры, формы обратной связи)
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
            Сервисы для отслеживания посещаемости и поведения пользователей на сайте. Отметьте те, которые вы используете.
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
              <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  checked={showAnalyticsOtherForm || (data.analytics?.other?.length ?? 0) > 0}
                  onChange={() => setShowAnalyticsOtherForm(!showAnalyticsOtherForm)}
                  className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
                />
                <span className="flex flex-1 items-center gap-1.5 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                  Другие сервисы
                  <span className="group/tooltip relative inline-flex">
                    <svg
                      className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors duration-150 hover:text-foreground/60"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-label="Подробнее"
                    >
                      <circle cx="8" cy="8" r="8" opacity="0.12" />
                      <path d="M8 7.5v3M8 5.5h.01M15 8A7 7 0 111 8a7 7 0 0114 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-normal leading-relaxed text-foreground/80 opacity-0 transition-opacity duration-150 group-hover/tooltip:block group-hover/tooltip:opacity-100">
                      Инструменты сквозной аналитики (Roistat, Calltouch), коллтрекинг, системы A/B-тестирования (Google Optimize, VWO), карты кликов (Hotjar) и другие сервисы веб-аналитики
                      <span className="absolute left-1/2 top-full -mt-px size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-background" />
                    </span>
                  </span>
                </span>
              </label>

              {/* Other Analytics Form */}
              {showAnalyticsOtherForm && (
                <div className="ml-6.5 mt-3 space-y-3 border-l border-border pl-4">

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
              <span className="font-medium text-foreground">По закону о персональных данных (ФЗ-152)</span> нужно указать, что данные передаются за границу. Это защитит вас от штрафов и претензий.
            </p>
          </div>

          <div className="space-y-2">
            {/* Google */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.crossBorder?.googleServices || false}
                onChange={() => handleCrossBorderToggle('googleServices')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
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
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Facebook Pixel / Meta Ads
              </span>
            </label>

            {/* Other Cross-Border Services - Collapsible */}
            <div>
              <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  checked={showCrossBorderOtherForm || (data.crossBorder?.other?.length ?? 0) > 0}
                  onChange={() => setShowCrossBorderOtherForm(!showCrossBorderOtherForm)}
                  className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
                />
                <span className="flex flex-1 items-center gap-1.5 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                  Другие сервисы
                  <span className="group/tooltip relative inline-flex">
                    <svg
                      className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors duration-150 hover:text-foreground/60"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-label="Подробнее"
                    >
                      <circle cx="8" cy="8" r="8" opacity="0.12" />
                      <path d="M8 7.5v3M8 5.5h.01M15 8A7 7 0 111 8a7 7 0 0114 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-normal leading-relaxed text-foreground/80 opacity-0 transition-opacity duration-150 group-hover/tooltip:block group-hover/tooltip:opacity-100">
                      Другие зарубежные сервисы, которые передают данные за пределы России (например, Amazon AWS, Stripe, Mailchimp)
                      <span className="absolute left-1/2 top-full -mt-px size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-background" />
                    </span>
                  </span>
                </span>
              </label>

              {/* Other Cross-Border Form */}
              {showCrossBorderOtherForm && (
                <div className="ml-6.5 mt-3 space-y-3 border-l border-border pl-4">

                  {/* Added services list */}
                  {(data.crossBorder?.other?.length ?? 0) > 0 && (
                    <div className="space-y-1.5">
                      {data.crossBorder?.other?.map((service, index) => (
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
                            onClick={() => handleRemoveCrossBorderService(index)}
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
                      value={newCrossBorderService}
                      onChange={(e) => setNewCrossBorderService(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCrossBorderService()
                        }
                      }}
                      placeholder="Название зарубежного сервиса"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground transition-colors duration-150 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                    />
                    <button
                      type="button"
                      onClick={handleAddCrossBorderService}
                      disabled={!newCrossBorderService.trim()}
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
            BLOCK 4: MARKETING/RETARGETING (Маркетинговые и рекламные cookie)
            ======================================================================== */}
        <fieldset className="space-y-3">
          <legend className="text-[13px] font-medium text-foreground">
            Используете ли вы рекламные инструменты?
          </legend>
          <p className="text-[12px] leading-relaxed text-muted-foreground/70">
            Сервисы для показа рекламы и отслеживания её эффективности (ВКонтакте, Яндекс, партнёрские программы).
          </p>

          <div className="space-y-2">
            {/* VK Pixel */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.vkPixel || false}
                onChange={() => handleMarketingToggle('vkPixel')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                Пиксель ВКонтакте
              </span>
            </label>

            {/* MyTarget */}
            <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
              <input
                type="checkbox"
                checked={data.marketing?.myTarget || false}
                onChange={() => handleMarketingToggle('myTarget')}
                className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
              />
              <span className="flex-1 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                MyTarget (Одноклассники, Mail.ru)
              </span>
            </label>

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

            {/* Partner Networks - Collapsible */}
            <div>
              <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  checked={showPartnerNetworksForm || (data.marketing?.partnerNetworks?.length ?? 0) > 0}
                  onChange={() => setShowPartnerNetworksForm(!showPartnerNetworksForm)}
                  className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
                />
                <span className="flex flex-1 items-center gap-1.5 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                  Партнёрские программы
                  <span className="group/tooltip relative inline-flex">
                    <svg
                      className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors duration-150 hover:text-foreground/60"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-label="Подробнее"
                    >
                      <circle cx="8" cy="8" r="8" opacity="0.12" />
                      <path d="M8 7.5v3M8 5.5h.01M15 8A7 7 0 111 8a7 7 0 0114 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-normal leading-relaxed text-foreground/80 opacity-0 transition-opacity duration-150 group-hover/tooltip:block group-hover/tooltip:opacity-100">
                      Партнёрские и реферальные программы, которые отслеживают переходы с вашего сайта (например, Admitad, Actionpay, Где Слон, CPA и affiliate-сети)
                      <span className="absolute left-1/2 top-full -mt-px size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-background" />
                    </span>
                  </span>
                </span>
              </label>

              {/* Partner Networks Form */}
              {showPartnerNetworksForm && (
                <div className="ml-6.5 mt-3 space-y-3 border-l border-border pl-4">

                  {/* Added networks list */}
                  {(data.marketing?.partnerNetworks?.length ?? 0) > 0 && (
                    <div className="space-y-1.5">
                      {data.marketing?.partnerNetworks?.map((network, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
                        >
                          <svg className="size-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="flex-1 text-[13px] text-foreground">
                            {network.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePartnerNetwork(index)}
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

                  {/* Add new network */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPartnerNetwork}
                      onChange={(e) => setNewPartnerNetwork(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddPartnerNetwork()
                        }
                      }}
                      placeholder="Название партнёрской сети"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground transition-colors duration-150 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                    />
                    <button
                      type="button"
                      onClick={handleAddPartnerNetwork}
                      disabled={!newPartnerNetwork.trim()}
                      className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-opacity duration-150 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Other Marketing - Collapsible */}
            <div>
              <label className="group flex cursor-pointer items-center gap-2.5 py-1.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  checked={showMarketingOtherForm || (data.marketing?.other?.length ?? 0) > 0}
                  onChange={() => setShowMarketingOtherForm(!showMarketingOtherForm)}
                  className="size-4 shrink-0 cursor-pointer rounded border-border bg-background text-foreground transition-colors duration-150 focus-visible:outline-none"
                />
                <span className="flex flex-1 items-center gap-1.5 text-[13px] font-medium leading-[1.125rem] text-foreground/90 group-hover:text-foreground">
                  Другие сервисы
                  <span className="group/tooltip relative inline-flex">
                    <svg
                      className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors duration-150 hover:text-foreground/60"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-label="Подробнее"
                    >
                      <circle cx="8" cy="8" r="8" opacity="0.12" />
                      <path d="M8 7.5v3M8 5.5h.01M15 8A7 7 0 111 8a7 7 0 0114 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-normal leading-relaxed text-foreground/80 opacity-0 transition-opacity duration-150 group-hover/tooltip:block group-hover/tooltip:opacity-100">
                      Любые другие маркетинговые инструменты и системы ретаргетинга, не перечисленные выше
                      <span className="absolute left-1/2 top-full -mt-px size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-background" />
                    </span>
                  </span>
                </span>
              </label>

              {/* Other Marketing Form */}
              {showMarketingOtherForm && (
                <div className="ml-6.5 mt-3 space-y-3 border-l border-border pl-4">

                  {/* Added services list */}
                  {(data.marketing?.other?.length ?? 0) > 0 && (
                    <div className="space-y-1.5">
                      {data.marketing?.other?.map((service, index) => (
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
                            onClick={() => handleRemoveMarketingService(index)}
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
                      value={newMarketingService}
                      onChange={(e) => setNewMarketingService(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddMarketingService()
                        }
                      }}
                      placeholder="Название маркетингового сервиса"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground transition-colors duration-150 placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                    />
                    <button
                      type="button"
                      onClick={handleAddMarketingService}
                      disabled={!newMarketingService.trim()}
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
