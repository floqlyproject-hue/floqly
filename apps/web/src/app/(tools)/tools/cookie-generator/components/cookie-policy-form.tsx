'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Shield, BarChart3, Globe, Megaphone, Info, Lightbulb } from 'lucide-react'
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
  // SECTION COUNTS
  // ============================================================================
  const techCount = useMemo(() => {
    let c = 0
    if (data.technicalFeatures?.cart) c++
    if (data.technicalFeatures?.auth) c++
    if (data.technicalFeatures?.payment) c++
    if (data.technicalFeatures?.preferences) c++
    if (data.technicalFeatures?.security) c++
    c += data.technicalFeatures?.externalServices?.length ?? 0
    return c
  }, [data.technicalFeatures])

  const analyticsCount = useMemo(() => {
    let c = 0
    if (data.analytics?.yandexMetrika) c++
    if (data.analytics?.liveInternet) c++
    if (data.analytics?.mailRu) c++
    if (data.analytics?.customAnalytics) c++
    c += data.analytics?.other?.length ?? 0
    return c
  }, [data.analytics])

  const crossBorderCount = useMemo(() => {
    let c = 0
    if (data.crossBorder?.googleServices) c++
    if (data.crossBorder?.facebookPixel) c++
    c += data.crossBorder?.other?.length ?? 0
    return c
  }, [data.crossBorder])

  const marketingCount = useMemo(() => {
    let c = 0
    if (data.marketing?.vkPixel) c++
    if (data.marketing?.myTarget) c++
    if (data.marketing?.yandexDirect) c++
    c += data.marketing?.partnerNetworks?.length ?? 0
    c += data.marketing?.other?.length ?? 0
    return c
  }, [data.marketing])

  const totalCount = techCount + analyticsCount + crossBorderCount + marketingCount

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
    <div>
      {/* Section Header — matches Step 1 */}
      <div className="mb-10 max-w-lg">
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">
          Что использует ваш сайт?
        </h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground/70">
          Отметьте функции и сервисы, которые работают на вашем сайте
        </p>
        {totalCount > 0 && (
          <div className="mt-4 text-[12px] tabular-nums text-muted-foreground/50">
            Выбрано: {totalCount}
          </div>
        )}
      </div>

      {/* Form Blocks */}
      <div className="max-w-2xl space-y-10">
        {/* ========================================================================
            BLOCK 1: TECHNICAL FEATURES
            ======================================================================== */}
        <fieldset className="space-y-4 rounded-xl border border-border/50 p-5">
          <legend className="flex items-center gap-2 px-1 text-[15px] font-semibold text-foreground">
            <Shield className="size-4 text-muted-foreground/60" strokeWidth={1.5} />
            Функции сайта
            {techCount > 0 && (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-foreground/60">
                {techCount}
              </span>
            )}
          </legend>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Отметьте функции, которые есть на вашем сайте — это нужно для правильного оформления документа
          </p>

          <div className="space-y-1">
            <CheckboxItem
              checked={data.technicalFeatures?.cart || false}
              onChange={() => handleTechnicalFeatureToggle('cart')}
              label="Корзина покупок и товары"
            />
            <CheckboxItem
              checked={data.technicalFeatures?.auth || false}
              onChange={() => handleTechnicalFeatureToggle('auth')}
              label="Авторизация и личный кабинет"
            />
            <CheckboxItem
              checked={data.technicalFeatures?.payment || false}
              onChange={() => handleTechnicalFeatureToggle('payment')}
              label="Приём платежей на сайте"
            />
            <CheckboxItem
              checked={data.technicalFeatures?.preferences || false}
              onChange={() => handleTechnicalFeatureToggle('preferences')}
              label="Избранное и пользовательские настройки"
              hint="Добавление товаров в избранное, сравнение характеристик, выбор города или региона, сохранение предпочтений интерфейса"
            />
            <CheckboxItem
              checked={data.technicalFeatures?.security || false}
              onChange={() => handleTechnicalFeatureToggle('security')}
              label="Защита от спама и ботов"
              hint="CAPTCHA-системы (Google reCAPTCHA, Яндекс SmartCaptcha, hCaptcha) для защиты форм от автоматических отправок"
            />

            {/* External Services (Chat widgets, etc.) - Collapsible */}
            <div>
              <label className="group flex cursor-pointer gap-3 py-2.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  className="cb mt-0.5"
                  checked={showExternalServicesForm || (data.technicalFeatures?.externalServices?.length ?? 0) > 0}
                  onChange={() => setShowExternalServicesForm(!showExternalServicesForm)}
                />
                <div className="flex-1">
                  <span className="block text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
                    Онлайн-чаты и виджеты связи
                  </span>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                    Виджеты для общения с посетителями (чаты, мессенджеры, формы обратной связи)
                  </p>
                </div>
              </label>

              {/* External Services Form */}
              {showExternalServicesForm && (
                <div className="expand-enter ml-[1.875rem] mt-1 space-y-3 border-l-2 border-border pl-4">
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    Укажите названия сервисов (например, JivoSite, Битрикс24, Carrot Quest)
                  </p>
                  <ServiceList
                    items={data.technicalFeatures?.externalServices}
                    onRemove={handleRemoveExternalService}
                  />
                  <AddServiceInput
                    value={newExternalService}
                    onChange={setNewExternalService}
                    onAdd={handleAddExternalService}
                    placeholder="Название сервиса"
                  />
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* ========================================================================
            BLOCK 2: ANALYTICS
            ======================================================================== */}
        <fieldset className="space-y-4 rounded-xl border border-border/50 p-5">
          <legend className="flex items-center gap-2 px-1 text-[15px] font-semibold text-foreground">
            <BarChart3 className="size-4 text-muted-foreground/60" strokeWidth={1.5} />
            Аналитика
            {analyticsCount > 0 && (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-foreground/60">
                {analyticsCount}
              </span>
            )}
          </legend>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Сервисы для отслеживания посещаемости и поведения пользователей на сайте
          </p>

          <div className="space-y-1">
            <CheckboxItem
              checked={data.analytics?.yandexMetrika || false}
              onChange={() => handleAnalyticsToggle('yandexMetrika')}
              label="Яндекс.Метрика"
            />
            <CheckboxItem
              checked={data.analytics?.liveInternet || false}
              onChange={() => handleAnalyticsToggle('liveInternet')}
              label="LiveInternet"
            />
            <CheckboxItem
              checked={data.analytics?.mailRu || false}
              onChange={() => handleAnalyticsToggle('mailRu')}
              label="Рейтинг Mail.ru"
            />
            <CheckboxItem
              checked={data.analytics?.customAnalytics || false}
              onChange={() => handleAnalyticsToggle('customAnalytics')}
              label="Собственная статистика сервера"
            />

            {/* Other Analytics - Collapsible */}
            <div>
              <label className="group flex cursor-pointer items-center gap-3 py-2.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  className="cb"
                  checked={showAnalyticsOtherForm || (data.analytics?.other?.length ?? 0) > 0}
                  onChange={() => setShowAnalyticsOtherForm(!showAnalyticsOtherForm)}
                />
                <span className="flex items-center gap-1.5 text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
                  Другие сервисы
                  <Tooltip text="Инструменты сквозной аналитики (Roistat, Calltouch), коллтрекинг, системы A/B-тестирования, карты кликов (Hotjar) и другие" />
                </span>
              </label>

              {showAnalyticsOtherForm && (
                <div className="expand-enter ml-[1.875rem] mt-1 space-y-3 border-l-2 border-border pl-4">
                  <ServiceList
                    items={data.analytics?.other}
                    onRemove={handleRemoveAnalyticService}
                  />
                  <AddServiceInput
                    value={newAnalyticService}
                    onChange={setNewAnalyticService}
                    onAdd={handleAddAnalyticService}
                    placeholder="Название сервиса аналитики"
                  />
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* ========================================================================
            BLOCK 3: CROSS-BORDER TRANSFER
            ======================================================================== */}
        <fieldset className="space-y-4 rounded-xl border border-border/50 p-5">
          <legend className="flex items-center gap-2 px-1 text-[15px] font-semibold text-foreground">
            <Globe className="size-4 text-muted-foreground/60" strokeWidth={1.5} />
            Иностранные сервисы
            {crossBorderCount > 0 && (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-foreground/60">
                {crossBorderCount}
              </span>
            )}
          </legend>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Некоторые сервисы передают данные на серверы за пределами РФ — это требует указания в политике
          </p>

          {/* Legal notice — borderless */}
          <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-3.5 py-3">
            <Info className="mt-px size-4 shrink-0 text-foreground/50" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/80">ФЗ-152</span> требует указать передачу данных за границу для защиты от штрафов и претензий
            </p>
          </div>

          <div className="space-y-1">
            <CheckboxItem
              checked={data.crossBorder?.googleServices || false}
              onChange={() => handleCrossBorderToggle('googleServices')}
              label="Google Analytics / Google Ads"
            />
            <CheckboxItem
              checked={data.crossBorder?.facebookPixel || false}
              onChange={() => handleCrossBorderToggle('facebookPixel')}
              label="Facebook Pixel / Meta Ads"
            />

            {/* Other Cross-Border Services - Collapsible */}
            <div>
              <label className="group flex cursor-pointer items-center gap-3 py-2.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  className="cb"
                  checked={showCrossBorderOtherForm || (data.crossBorder?.other?.length ?? 0) > 0}
                  onChange={() => setShowCrossBorderOtherForm(!showCrossBorderOtherForm)}
                />
                <span className="flex items-center gap-1.5 text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
                  Другие сервисы
                  <Tooltip text="Другие зарубежные сервисы, передающие данные за пределы России (например, Amazon AWS, Stripe, Mailchimp)" />
                </span>
              </label>

              {showCrossBorderOtherForm && (
                <div className="expand-enter ml-[1.875rem] mt-1 space-y-3 border-l-2 border-border pl-4">
                  <ServiceList
                    items={data.crossBorder?.other}
                    onRemove={handleRemoveCrossBorderService}
                  />
                  <AddServiceInput
                    value={newCrossBorderService}
                    onChange={setNewCrossBorderService}
                    onAdd={handleAddCrossBorderService}
                    placeholder="Название зарубежного сервиса"
                  />
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* ========================================================================
            BLOCK 4: MARKETING/RETARGETING
            ======================================================================== */}
        <fieldset className="space-y-4 rounded-xl border border-border/50 p-5">
          <legend className="flex items-center gap-2 px-1 text-[15px] font-semibold text-foreground">
            <Megaphone className="size-4 text-muted-foreground/60" strokeWidth={1.5} />
            Реклама и маркетинг
            {marketingCount > 0 && (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-foreground/60">
                {marketingCount}
              </span>
            )}
          </legend>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Сервисы для показа рекламы и отслеживания её эффективности
          </p>

          <div className="space-y-1">
            <CheckboxItem
              checked={data.marketing?.vkPixel || false}
              onChange={() => handleMarketingToggle('vkPixel')}
              label="Пиксель ВКонтакте"
            />
            <CheckboxItem
              checked={data.marketing?.myTarget || false}
              onChange={() => handleMarketingToggle('myTarget')}
              label="MyTarget (Одноклассники, Mail.ru)"
            />
            <CheckboxItem
              checked={data.marketing?.yandexDirect || false}
              onChange={() => handleMarketingToggle('yandexDirect')}
              label="Яндекс.Директ"
            />

            {/* Partner Networks - Collapsible */}
            <div>
              <label className="group flex cursor-pointer items-center gap-3 py-2.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  className="cb"
                  checked={showPartnerNetworksForm || (data.marketing?.partnerNetworks?.length ?? 0) > 0}
                  onChange={() => setShowPartnerNetworksForm(!showPartnerNetworksForm)}
                />
                <span className="flex items-center gap-1.5 text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
                  Партнёрские программы
                  <Tooltip text="Партнёрские и реферальные программы (Admitad, Actionpay, Где Слон, CPA и affiliate-сети)" />
                </span>
              </label>

              {showPartnerNetworksForm && (
                <div className="expand-enter ml-[1.875rem] mt-1 space-y-3 border-l-2 border-border pl-4">
                  <ServiceList
                    items={data.marketing?.partnerNetworks}
                    onRemove={handleRemovePartnerNetwork}
                  />
                  <AddServiceInput
                    value={newPartnerNetwork}
                    onChange={setNewPartnerNetwork}
                    onAdd={handleAddPartnerNetwork}
                    placeholder="Название партнёрской сети"
                  />
                </div>
              )}
            </div>

            {/* Other Marketing - Collapsible */}
            <div>
              <label className="group flex cursor-pointer items-center gap-3 py-2.5 transition-colors duration-150">
                <input
                  type="checkbox"
                  className="cb"
                  checked={showMarketingOtherForm || (data.marketing?.other?.length ?? 0) > 0}
                  onChange={() => setShowMarketingOtherForm(!showMarketingOtherForm)}
                />
                <span className="flex items-center gap-1.5 text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
                  Другие сервисы
                  <Tooltip text="Любые другие маркетинговые инструменты и системы ретаргетинга, не перечисленные выше" />
                </span>
              </label>

              {showMarketingOtherForm && (
                <div className="expand-enter ml-[1.875rem] mt-1 space-y-3 border-l-2 border-border pl-4">
                  <ServiceList
                    items={data.marketing?.other}
                    onRemove={handleRemoveMarketingService}
                  />
                  <AddServiceInput
                    value={newMarketingService}
                    onChange={setNewMarketingService}
                    onAdd={handleAddMarketingService}
                    placeholder="Название маркетингового сервиса"
                  />
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Bottom hint — borderless */}
        <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 px-3.5 py-3">
          <Lightbulb className="mt-px size-4 shrink-0 text-muted-foreground/60" strokeWidth={1.5} aria-hidden="true" />
          <div>
            <p className="text-[13px] font-medium leading-relaxed text-foreground/80">
              Выбирайте только то, что действительно используется
            </p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
              Указывайте в политике только те сервисы, которые реально работают на вашем сайте
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function CheckboxItem({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: () => void
  label: string
  hint?: string
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-2.5 transition-colors duration-150">
      <input
        type="checkbox"
        className="cb"
        checked={checked}
        onChange={onChange}
      />
      <span className="flex items-center gap-1.5 text-[14px] font-medium text-foreground/90 group-hover:text-foreground">
        {label}
        {hint && <Tooltip text={hint} />}
      </span>
    </label>
  )
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="tooltip-trigger relative inline-flex">
      <svg
        className="size-4 shrink-0 text-muted-foreground/45 transition-colors duration-200 hover:text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Подробнее"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
      <span className="tooltip-content mb-2.5 w-60 rounded-lg bg-foreground px-3.5 py-2.5 text-[12px] font-normal leading-relaxed text-background shadow-lg dark:bg-[oklch(25%_0.025_260)] dark:text-[oklch(90%_0.01_264)]">
        {text}
      </span>
    </span>
  )
}

function ServiceList({
  items,
  onRemove,
}: {
  items?: { name: string }[]
  onRemove: (index: number) => void
}) {
  if (!items?.length) return null

  return (
    <div className="space-y-1.5">
      {items.map((service, index) => (
        <div
          key={`${service.name}-${index}`}
          className="expand-enter flex items-center gap-2 rounded-md bg-muted/60 px-3 py-2"
        >
          <svg className="size-3.5 shrink-0 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="flex-1 text-[13px] text-foreground">
            {service.name}
          </span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="shrink-0 text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

function AddServiceInput({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string
  onChange: (val: string) => void
  onAdd: () => void
  placeholder: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Автофокус при появлении
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleAdd = () => {
    onAdd()
    // Рефокус после добавления
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleAdd()
          }
        }}
        placeholder={placeholder}
        className="flex-1 border-b border-border bg-transparent px-0 py-2 text-[13px] text-foreground transition-colors duration-150 placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!value.trim()}
        className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-[13px] font-medium text-background transition-all duration-200 hover:opacity-80 disabled:opacity-20 disabled:pointer-events-none"
      >
        Добавить
      </button>
    </div>
  )
}
