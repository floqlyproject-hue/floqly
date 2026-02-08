/**
 * Cookie Policy Template & Text Blocks
 *
 * This file contains the base template and all text blocks
 * for generating Cookie Policy documents.
 *
 * Supports conditional blocks based on user selections in Step 2.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CookiePolicyData {
  // Step 1: Company Info
  companyName: string
  siteUrl: string
  email: string
  inn?: string
  currentDate: string

  // Step 2: Technical Functions (BLOCK_SHOP)
  technicalFeatures: {
    cart: boolean
    auth: boolean
    payment: boolean
    preferences: boolean
    security: boolean
    externalServices: Array<{
      name: string
      owner?: string
      privacyUrl?: string
    }>
  }

  // Step 2: Analytics (BLOCK_ANALYTICS)
  analytics: {
    yandexMetrika: boolean
    liveInternet: boolean
    mailRu: boolean
    customAnalytics: boolean
    other: Array<{ name: string }>
  }

  // Step 2: Cross-Border Transfer (BLOCK_CROSS_BORDER)
  crossBorder: {
    googleServices: boolean
    facebookPixel: boolean
    other: Array<{ name: string }>
  }

  // Step 2: Marketing/Retargeting (BLOCK_MARKETING)
  marketing: {
    vkPixel: boolean
    myTarget: boolean
    yandexDirect: boolean
    partnerNetworks: Array<{ name: string }>
    other: Array<{ name: string }>
  }
}

// ============================================================================
// TEXT BLOCKS (Conditional Sections)
// ============================================================================

/**
 * 2.1. Technical (Strictly Necessary) Cookies
 * These texts are appended to section 2.1 based on selected features
 */
export const TECHNICAL_BLOCKS = {
  CART: `
**1. Обеспечение процесса заказа (Корзина)**
Мы используем файлы cookie для сохранения информации о товарах или услугах, которые вы добавили в корзину («Корзина покупок»). Эти файлы необходимы для того, чтобы ваш выбор сохранялся при переходе между страницами Сайта или при временном закрытии вкладки браузера. Без этих файлов невозможно заключение договора купли-продажи (оказания услуг) через интерфейс Сайта.
`,

  AUTH: `
**2. Авторизация и безопасность (Личный кабинет)**
Если вы регистрируетесь или входите в личный кабинет, мы используем файлы cookie для вашей аутентификации (распознавания). Это позволяет вам оставаться авторизованным при навигации по Сайту, получать доступ к истории заказов и закрытым разделам без необходимости повторного ввода пароля на каждой странице. Также эти файлы помогают предотвратить несанкционированный доступ к вашему аккаунту (защита от CSRF-атак).
`,

  PAYMENT: `
**3. Проведение платежей**
При осуществлении онлайн-оплаты мы можем использовать файлы cookie для взаимодействия с платежными шлюзами и банками-эквайерами. Эти файлы помогают отслеживать статус транзакции, предотвращать мошенничество (fraud-мониторинг) и обеспечивать безопасность ваших платежных данных. Данные файлы cookie не хранят полные реквизиты ваших банковских карт.
`,

  PREFERENCES: `
**4. Пользовательские настройки**
Мы используем файлы cookie для запоминания ваших предпочтений, чтобы сделать использование Сайта более удобным. Сюда относится:
* Список «Избранное» или «Сравнение товаров»;
* Выбранный вами регион или город (для корректного отображения цен и условий доставки);
* Индивидуальные настройки отображения товаров (списком, плиткой и т.д.).
`,

  SECURITY: `
**5. Защита от ботов и автоматизированных атак**
Для обеспечения безопасности Сайта и защиты от мошеннических действий мы используем файлы cookie в составе систем защиты от автоматизированного доступа (CAPTCHA, антибот). Эти файлы помогают:
* Отличать реальных пользователей от автоматизированных программ (ботов);
* Предотвращать спам-рассылки через формы обратной связи;
* Защищать от DDoS-атак и массового парсинга данных;
* Обнаруживать подозрительную активность (например, множественные попытки входа с неверным паролем).
`,

  CHAT: `
**6. Коммуникация (Онлайн-чат)**
Для работы виджета онлайн-консультанта на Сайте используются файлы cookie, которые позволяют сохранять историю вашей переписки с оператором, идентифицировать вас при повторном обращении и обеспечивать непрерывность диалога при переходе между страницами.
`,

  EXTERNAL_SERVICE: (serviceName: string, owner?: string) => `
**Сторонний коммуникационный сервис: ${serviceName}**
Для взаимодействия с посетителями на Сайте используется сервис **${serviceName}**${owner ? ` (правообладатель: ${owner})` : ''}. Этот сервис устанавливает собственные файлы cookie для идентификации сессии и сохранения истории взаимодействия. Мы рекомендуем ознакомиться с политикой конфиденциальности данного сервиса на его официальном сайте.
`,
}

/**
 * 2.2. Analytics Cookies Section
 */
export const ANALYTICS_SECTION_INTRO = `
### 2.2. Аналитические и статистические cookie
Эти файлы помогают нам понять, как посетители взаимодействуют с Сайтом (какие страницы посещают чаще всего, сколько времени проводят на Сайте, возникают ли ошибки). Вся информация собирается в агрегированном (обезличенном) виде.

**Используемые сервисы:**
`

export const ANALYTICS_CUSTOM_SERVER = `
* **Собственная статистика сервера** — мы ведём внутренний учёт посещаемости на уровне веб-сервера (логи запросов). Эти данные не передаются третьим лицам и используются исключительно для технического анализа работы Сайта.
`

/**
 * 2.3. Marketing Cookies Section
 */
export const MARKETING_SECTION = `
### 2.3. Маркетинговые и рекламные cookie
Эти файлы используются для отслеживания действий пользователей на разных сайтах. Их цель — показывать вам рекламу, которая наиболее релевантна вашим интересам (таргетированная реклама), а также оценивать эффективность рекламных кампаний.

**Используемые инструменты:**
* Рекламные пиксели и счетчики рекламных сетей.
`

/**
 * Cross-Border Transfer Warning (for Google/Facebook)
 */
export const CROSS_BORDER_SECTION = `
**Иностранные сервисы (Трансграничная передача):**
Мы используем инструменты иностранных провайдеров. Ваши данные (файлы cookie, IP-адрес, данные браузера) могут передаваться на серверы, расположенные за пределами Российской Федерации.

* **Google Analytics / Google Ads.** Владелец: Google LLC (США).
    [Политика конфиденциальности Google](https://policies.google.com/privacy)

* **Facebook Pixel / Meta Ads.** Владелец: Meta Platforms, Inc. (США).
    [Политика конфиденциальности Meta](https://www.facebook.com/privacy/policy/)

> **Предупреждение о трансграничной передаче:**
> США и некоторые другие страны могут не обеспечивать уровень защиты прав субъектов персональных данных, признаваемый адекватным согласно законодательству РФ (США не входят в перечень стран, являющихся сторонами Конвенции Совета Европы).
>
> Продолжая пользоваться Сайтом, вы даете прямое согласие (в соответствии со ст. 12 ФЗ-152) на трансграничную передачу ваших данных, собираемых через cookie, на серверы указанных иностранных компаний для целей аналитики и маркетинга.
`

// ============================================================================
// MAIN TEMPLATE
// ============================================================================

export const COOKIE_POLICY_TEMPLATE = `
# Политика использования файлов cookie

**Дата вступления в силу:** {{CURRENT_DATE}}

Настоящая Политика использования файлов cookie (далее — «Политика») определяет порядок и условия использования файлов cookie при посещении веб-сайта **{{SITE_URL}}** (далее — «Сайт»).

Сайт администрируется **{{COMPANY_NAME}}**{{INN}} (далее — «Оператор» или «Мы»).

Мы уделяем большое внимание защите ваших данных. Нажимая кнопку «Принять» на баннере уведомления о файлах cookie или продолжая использование Сайта, вы даете свое согласие на использование файлов cookie в соответствии с настоящей Политикой.

## 1. Что такое файлы cookie?

Файлы cookie (куки) — это небольшие текстовые файлы, которые сохраняются на вашем устройстве (персональном компьютере, ноутбуке, планшете, смартфоне и т.д.), когда вы посещаете сайты в сети Интернет.

Они позволяют Сайту:
* Запоминать ваши настройки и предпочтения (например, выбранный регион, размер шрифта, язык);
* Авторизовывать вас в личных кабинетах;
* Собирать аналитическую информацию о посещаемости для улучшения работы Сайта.

Файлы cookie обычно не содержат информации, позволяющей прямо идентифицировать вашу личность, однако в сочетании с другими данными (например, IP-адресом) они могут рассматриваться как персональные данные согласно законодательству РФ.

## 2. Какие типы файлов cookie мы используем и для чего?

Мы используем различные типы файлов cookie для обеспечения корректной работы Сайта и повышения удобства его использования.

### 2.1. Технические (строго необходимые) cookie
Эти файлы критически важны для функционирования Сайта. Без них вы не сможете использовать базовые возможности, такие как навигация между страницами или доступ к защищенным разделам.

**Цель использования:** Обеспечение технической доступности Сайта, безопасности и предотвращение мошенничества.

*Правовое основание:* Обработка необходима для выполнения договора, стороной которого является пользователь (пользовательское соглашение), или для осуществления прав и законных интересов Оператора (ст. 6 ФЗ-152).

{{BLOCK_SHOP}}

{{BLOCK_ANALYTICS}}

{{BLOCK_MARKETING}}

## 3. Сторонние сервисы и передача данных

На Сайте используются сторонние интернет-сервисы, осуществляющие независимый от нас сбор информации. Мы не несем ответственности за локальные акты этих сервисов, однако тщательно подходим к их выбору.

Ниже приведен список основных партнеров, чьи технологии могут использоваться на Сайте:

**Российские сервисы:**
* **Яндекс.Метрика / Яндекс.Директ.** Владелец: ООО «ЯНДЕКС» (Россия).
    [Политика конфиденциальности Яндекс](https://yandex.ru/legal/confidential/)

{{BLOCK_CROSS_BORDER}}

## 4. Срок хранения файлов cookie

* **Сессионные cookie:** Хранятся только во время вашего пребывания на Сайте и удаляются автоматически после закрытия браузера.
* **Постоянные cookie:** Хранятся на вашем устройстве в течение периода, установленного в параметрах каждого файла cookie, или до момента их ручного удаления вами. Срок хранения маркетинговых cookie, как правило, не превышает 1 года.

## 5. Управление файлами cookie (Как отказаться?)

Вы имеете право в любой момент отказаться от использования файлов cookie. Однако обращаем ваше внимание, что отключение **технических** cookie может привести к тому, что некоторые функции Сайта станут недоступны (например, вы не сможете оформить заказ или войти в личный кабинет).

Вы можете управлять настройками cookie через меню вашего браузера. Инструкции для популярных браузеров:
* [Яндекс.Браузер](https://browser.yandex.ru/help/personal-data-protection/cookies.html)
* [Google Chrome](https://support.google.com/chrome/answer/95647?hl=ru)
* [Safari](https://support.apple.com/ru-ru/guide/safari/sfri11471/mac)
* [Mozilla Firefox](https://support.mozilla.org/ru/kb/uluchshennaya-zashitu-ot-otslezhivaniya-v-firefox-dlya-kompyutera)

## 6. Изменение Политики

Оператор имеет право вносить изменения в настоящую Политику по своему усмотрению. Новая редакция Политики вступает в силу с момента ее размещения на Сайте. Мы рекомендуем пользователям регулярно проверять данную страницу на наличие изменений.

**Контактные данные:**
По всем вопросам, связанным с использованием файлов cookie, вы можете связаться с нами по электронной почте: **{{EMAIL}}**.
`

// ============================================================================
// DOCUMENT GENERATION LOGIC
// ============================================================================

/**
 * Generate Cookie Policy document based on user selections
 */
export function generateCookiePolicy(data: CookiePolicyData): string {
  let document = COOKIE_POLICY_TEMPLATE

  // Replace simple variables
  document = document.replace(/{{CURRENT_DATE}}/g, data.currentDate)
  document = document.replace(/{{SITE_URL}}/g, data.siteUrl)
  document = document.replace(/{{COMPANY_NAME}}/g, data.companyName)
  document = document.replace(/{{EMAIL}}/g, data.email)

  // INN is optional (for now)
  const innText = data.inn ? ` (ИНН: ${data.inn})` : ''
  document = document.replace(/{{INN}}/g, innText)

  // Build BLOCK_SHOP (Technical Features)
  let blockShop = ''
  const { technicalFeatures } = data
  const hasAnyTechnicalFeature =
    technicalFeatures.cart ||
    technicalFeatures.auth ||
    technicalFeatures.payment ||
    technicalFeatures.preferences ||
    technicalFeatures.security ||
    technicalFeatures.externalServices.length > 0

  if (hasAnyTechnicalFeature) {
    blockShop += '\n### Дополнительная информация о функциональных файлах cookie\n'
    blockShop += '\nВ зависимости от используемых вами функций Сайта, мы применяем следующие категории технических файлов cookie:\n'

    if (technicalFeatures.cart) blockShop += TECHNICAL_BLOCKS.CART
    if (technicalFeatures.auth) blockShop += TECHNICAL_BLOCKS.AUTH
    if (technicalFeatures.payment) blockShop += TECHNICAL_BLOCKS.PAYMENT
    if (technicalFeatures.preferences) blockShop += TECHNICAL_BLOCKS.PREFERENCES
    if (technicalFeatures.security) blockShop += TECHNICAL_BLOCKS.SECURITY

    // External services (chat widgets, communication tools, etc.)
    if (technicalFeatures.externalServices.length > 0) {
      technicalFeatures.externalServices.forEach((service) => {
        blockShop += TECHNICAL_BLOCKS.EXTERNAL_SERVICE(service.name, service.owner)
      })
    }
  }

  document = document.replace('{{BLOCK_SHOP}}', blockShop)

  // Build BLOCK_ANALYTICS
  const { analytics } = data
  const hasAnalytics =
    analytics.yandexMetrika ||
    analytics.liveInternet ||
    analytics.mailRu ||
    analytics.customAnalytics ||
    analytics.other.length > 0

  let blockAnalytics = ''
  if (hasAnalytics) {
    blockAnalytics = ANALYTICS_SECTION_INTRO

    // Custom server analytics
    if (analytics.customAnalytics) {
      blockAnalytics += ANALYTICS_CUSTOM_SERVER
    }

    // Third-party analytics services
    const thirdPartyServices: string[] = []
    if (analytics.yandexMetrika) thirdPartyServices.push('Яндекс.Метрика')
    if (analytics.liveInternet) thirdPartyServices.push('LiveInternet')
    if (analytics.mailRu) thirdPartyServices.push('Рейтинг Mail.ru')

    // Add "other" custom analytics
    analytics.other.forEach((service) => {
      thirdPartyServices.push(service.name)
    })

    if (thirdPartyServices.length > 0) {
      blockAnalytics += '\n* **Сторонние системы веб-аналитики:** '
      blockAnalytics += thirdPartyServices.join(', ')
      blockAnalytics += '.\n'
    }
  }

  document = document.replace('{{BLOCK_ANALYTICS}}', blockAnalytics)

  // Build BLOCK_MARKETING
  const { marketing } = data
  const hasMarketing =
    marketing.vkPixel ||
    marketing.myTarget ||
    marketing.yandexDirect ||
    marketing.partnerNetworks.length > 0 ||
    marketing.other.length > 0

  document = document.replace(
    '{{BLOCK_MARKETING}}',
    hasMarketing ? MARKETING_SECTION : ''
  )

  // Build BLOCK_CROSS_BORDER (Dynamic)
  const { crossBorder } = data
  const hasCrossBorder =
    crossBorder.googleServices ||
    crossBorder.facebookPixel ||
    crossBorder.other.length > 0

  let crossBorderContent = ''
  if (hasCrossBorder) {
    const services: string[] = []

    // Add Google if selected
    if (crossBorder.googleServices) {
      services.push(
        '* **Google Analytics / Google Ads.** Владелец: Google LLC (США).\n    [Политика конфиденциальности Google](https://policies.google.com/privacy)'
      )
    }

    // Add Facebook if selected
    if (crossBorder.facebookPixel) {
      services.push(
        '* **Facebook Pixel / Meta Ads.** Владелец: Meta Platforms, Inc. (США).\n    [Политика конфиденциальности Meta](https://www.facebook.com/privacy/policy/)'
      )
    }

    // Add other services
    if (crossBorder.other && crossBorder.other.length > 0) {
      crossBorder.other.forEach((service) => {
        services.push(`* **${service.name}**`)
      })
    }

    crossBorderContent = `
**Иностранные сервисы (Трансграничная передача):**
Мы используем инструменты иностранных провайдеров. Ваши данные (файлы cookie, IP-адрес, данные браузера) могут передаваться на серверы, расположенные за пределами Российской Федерации.

${services.join('\n\n')}

> **Предупреждение о трансграничной передаче:**
> США и некоторые другие страны могут не обеспечивать уровень защиты прав субъектов персональных данных, признаваемый адекватным согласно законодательству РФ (США не входят в перечень стран, являющихся сторонами Конвенции Совета Европы).
>
> Продолжая пользоваться Сайтом, вы даете прямое согласие (в соответствии со ст. 12 ФЗ-152) на трансграничную передачу ваших данных, собираемых через cookie, на серверы указанных иностранных компаний для целей аналитики и маркетинга.
`
  }

  document = document.replace('{{BLOCK_CROSS_BORDER}}', crossBorderContent)

  return document
}

/**
 * Helper: Check if cross-border transfer should be auto-enabled
 * (currently not used as we removed foreign ad services from marketing)
 */
export function shouldEnableCrossBorder(data: CookiePolicyData): boolean {
  return false // No auto-enable, user must manually select cross-border services
}
