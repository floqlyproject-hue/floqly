/**
 * Генерация самодостаточного embed-кода для cookie-баннера.
 * Код — vanilla JS (ES5-совместимый), все стили inline, без внешних зависимостей.
 */

import type { BannerCustomization } from '../components/liquid-glass-island'
import type { CookieConfig } from '../types'
import {
  BG_COLORS,
  BTN_COLORS,
  type ShadowLabel,
} from '../components/island-panels'

/* ── Color resolution ── */

const BG_COLOR_MAP = Object.fromEntries(BG_COLORS.map((c) => [c.id, c.color]))
const BTN_COLOR_MAP = Object.fromEntries(BTN_COLORS.map((c) => [c.id, c.color]))

function resolveBgColor(bgColor: string, bgCustom: string): string {
  if (bgColor === 'custom') return bgCustom
  return BG_COLOR_MAP[bgColor] ?? '#FFFFFF'
}

function resolveBtnColor(btnColor: string, btnCustom: string): string {
  if (btnColor === 'custom') return btnCustom
  return BTN_COLOR_MAP[btnColor] ?? '#000000'
}

const SHADOW_CSS: Record<ShadowLabel, string> = {
  'Нет': 'none',
  'Мягкая': '0 -1px 3px rgba(0,0,0,0.04), 0 -1px 2px rgba(0,0,0,0.02)',
  'Сильная': '0 -4px 16px rgba(0,0,0,0.08), 0 -1px 3px rgba(0,0,0,0.04)',
}

/* ── Perceived brightness for auto text color ── */

function perceivedBrightness(hex: string): number {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000
}

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/* ── CSS animation keyframes ── */

function getAnimKeyframes(
  anim: string,
  vert: string,
): { name: string; keyframes: string; initial: string } {
  const isBottom = vert === 'Снизу'
  const isTop = vert === 'Сверху'

  switch (anim) {
    case 'slide': {
      const dir = isTop ? '-40px' : isBottom ? '40px' : '0'
      return {
        name: 'floqly-slide-in',
        keyframes: `@keyframes floqly-slide-in{from{opacity:0;transform:translateY(${dir})}to{opacity:1;transform:translateY(0)}}`,
        initial: `opacity:0;transform:translateY(${dir})`,
      }
    }
    case 'fade':
      return {
        name: 'floqly-fade-in',
        keyframes:
          '@keyframes floqly-fade-in{from{opacity:0}to{opacity:1}}',
        initial: 'opacity:0',
      }
    case 'bounce': {
      const dir = isTop ? '-50px' : isBottom ? '50px' : '0'
      return {
        name: 'floqly-bounce-in',
        keyframes: `@keyframes floqly-bounce-in{0%{opacity:0;transform:translateY(${dir}) scale(0.9)}60%{opacity:1;transform:translateY(-4px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}`,
        initial: `opacity:0;transform:translateY(${dir}) scale(0.9)`,
      }
    }
    case 'scale':
      return {
        name: 'floqly-scale-in',
        keyframes:
          '@keyframes floqly-scale-in{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}',
        initial: 'opacity:0;transform:scale(0.85)',
      }
    default:
      return { name: '', keyframes: '', initial: '' }
  }
}

/* ── Position → inline CSS ── */

function getPositionCSS(pos: BannerCustomization['position']): string {
  const parts: string[] = ['position:fixed', 'z-index:2147483647']

  // Vertical
  if (pos.vert === 'Сверху') {
    parts.push(`top:${pos.offsetY}px`, 'bottom:auto')
  } else if (pos.vert === 'Центр') {
    parts.push('top:50%', 'bottom:auto', 'transform:translateY(-50%)')
  } else {
    parts.push(`bottom:${pos.offsetY}px`, 'top:auto')
  }

  // Width & Horizontal
  if (pos.width === 'Вытянутый') {
    parts.push(`left:${pos.offsetX}px`, `right:${pos.offsetX}px`)
  } else if (pos.width === 'Обычный') {
    parts.push('max-width:75%')
    if (pos.horiz === 'Слева') {
      parts.push(`left:${pos.offsetX}px`, 'right:auto')
    } else if (pos.horiz === 'Справа') {
      parts.push(`right:${pos.offsetX}px`, 'left:auto')
    } else {
      parts.push('left:50%', 'right:auto', 'margin-left:-37.5%')
    }
  } else {
    // Компакт
    parts.push('max-width:420px')
    if (pos.horiz === 'Слева') {
      parts.push(`left:${pos.offsetX}px`, 'right:auto')
    } else if (pos.horiz === 'Справа') {
      parts.push(`right:${pos.offsetX}px`, 'left:auto')
    } else {
      parts.push('left:50%', 'right:auto', 'transform:translateX(-50%)')
    }
  }

  return parts.join(';')
}

/* ── Escape for inline HTML ── */

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/* ── Main generator ── */

export interface EmbedCodeInput {
  config: CookieConfig
  customization: BannerCustomization
}

export function generateEmbedCode({ config, customization }: EmbedCodeInput): string {
  const { text, design, position, animation } = customization

  // Resolve actual colors from preset IDs
  const bgColor = resolveBgColor(design.bgColor, design.bgCustom)
  const btnColor = resolveBtnColor(design.btnColor, design.btnCustom)
  const bgDark = perceivedBrightness(bgColor) < 128
  const btnDark = perceivedBrightness(btnColor) < 128

  // Adaptive text colors
  const titleColor = bgDark ? '#F9FAFB' : '#111111'
  const descColor = bgDark ? 'rgba(249,250,251,0.6)' : 'rgba(17,17,17,0.5)'
  const btnText = btnDark ? '#FFFFFF' : '#111111'
  const borderColor = bgDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const ghostColor = bgDark ? 'rgba(249,250,251,0.45)' : 'rgba(17,17,17,0.4)'
  const outlinedBorder = bgDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,17,17,0.12)'
  const outlinedText = bgDark ? '#E5E7EB' : 'rgba(17,17,17,0.75)'

  // Animation
  const anim = getAnimKeyframes(animation.anim, position.vert)
  const speed = animation.speed || 0.3
  const delay = animation.trigger === 'time' ? (animation.delay || 2) * 1000 : 0
  const shadow = SHADOW_CSS[design.shadow] || 'none'
  const radius = design.radius
  const btnRadius = Math.min(radius, 10)

  // Backdrop
  const backdropAlpha =
    animation.backdrop === 'Лёгкое' ? 0.2 : animation.backdrop === 'Сильное' ? 0.5 : 0

  // Position CSS
  const posCSS = getPositionCSS(position)

  // Build banner inner HTML
  const showDecline = config.banner.showDeclineButton
  const showSettings = config.banner.showSettingsButton

  const declineBtn = showDecline
    ? `<button data-floqly-decline style="background:none;border:none;cursor:pointer;padding:5px 10px;font-size:11px;font-weight:500;color:${ghostColor};border-radius:${btnRadius}px;font-family:inherit">${esc(text.decline)}</button>`
    : ''

  const settingsBtn = showSettings
    ? `<button data-floqly-settings style="background:transparent;border:1px solid ${outlinedBorder};cursor:pointer;padding:5px 12px;font-size:11px;font-weight:500;color:${outlinedText};border-radius:${btnRadius}px;font-family:inherit">${esc(config.buttonText.settings)}</button>`
    : ''

  const bannerHTML = `<div style="padding:10px 16px;display:flex;align-items:center;gap:12px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif"><div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0"><div style="width:28px;height:28px;border-radius:8px;background:${hexToRgba(btnColor, 0.08)};display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.34-.018-.675-.052-1.005a3 3 0 0 1-2.948-2.948A10.014 10.014 0 0 0 12 2Z" fill="${hexToRgba(btnColor, 0.12)}" stroke="${btnColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8.5" cy="9.5" r="1.25" fill="${btnColor}"/><circle cx="14" cy="8" r="1" fill="${btnColor}"/><circle cx="10" cy="14.5" r="1" fill="${btnColor}"/><circle cx="15.5" cy="13.5" r="1.25" fill="${btnColor}"/></svg></div><div style="min-width:0;flex:1"><p style="margin:0;font-size:12px;font-weight:600;line-height:1.3;letter-spacing:-0.01em;color:${titleColor}">${esc(text.title)}</p><p style="margin:1px 0 0;font-size:10.5px;line-height:1.4;color:${descColor}">${esc(text.desc)}</p></div></div><div style="display:flex;align-items:center;gap:6px;flex-shrink:0">${declineBtn}${settingsBtn}<button data-floqly-accept style="background:${btnColor};color:${btnText};border:none;cursor:pointer;padding:5px 16px;font-size:11px;font-weight:600;border-radius:${btnRadius}px;box-shadow:0 1px 2px ${hexToRgba(btnColor, 0.15)};font-family:inherit">${esc(text.accept)}</button></div></div>`

  // Backdrop HTML
  const backdropHTML = backdropAlpha > 0
    ? `var bk=document.createElement('div');bk.id='floqly-backdrop';bk.style.cssText='position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,${backdropAlpha});transition:opacity ${speed}s';document.body.appendChild(bk);`
    : ''

  const removeBackdrop = backdropAlpha > 0
    ? `var bk=document.getElementById('floqly-backdrop');if(bk)bk.remove();`
    : ''

  // Scroll trigger logic
  const scrollTrigger = animation.trigger === 'scroll'
    ? `
    // Триггер по прокрутке (${animation.scrollPx}px)
    var scrollTriggered = false;
    function onScroll() {
      if (!scrollTriggered && window.scrollY >= ${animation.scrollPx}) {
        scrollTriggered = true;
        window.removeEventListener('scroll', onScroll);
        showBanner();
      }
    }
    window.addEventListener('scroll', onScroll);`
    : ''

  const timeTrigger = animation.trigger === 'time'
    ? `
    // Показ через ${animation.delay} сек.
    setTimeout(showBanner, ${delay});`
    : ''

  // Hide days
  const hideDays = config.banner.hideAfterDays || 365

  const code = `<!-- Floqly Cookie Banner — floqly.ru -->
<script>
(function() {
  'use strict';

  // Ключ хранения согласия
  var STORAGE_KEY = 'floqly_cookie_consent';
  var HIDE_DAYS = ${hideDays};

  // Проверяем, давал ли пользователь согласие ранее
  function getConsent() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!data || !data.timestamp) return null;
      var elapsed = Date.now() - data.timestamp;
      var maxAge = HIDE_DAYS * 24 * 60 * 60 * 1000;
      return elapsed < maxAge ? data.value : null;
    } catch (e) { return null; }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        value: value,
        timestamp: Date.now()
      }));
    } catch (e) {}
  }

  // Если согласие уже дано — не показываем баннер
  if (getConsent() !== null) return;

  // CSS-анимация${anim.name ? ` (${animation.anim})` : ''}
  var style = document.createElement('style');
  style.textContent = '${anim.keyframes}${anim.name ? `#floqly-cookie-banner{${anim.initial}}` : ''}';
  document.head.appendChild(style);

  // Создаём баннер
  var banner = document.createElement('div');
  banner.id = 'floqly-cookie-banner';
  banner.style.cssText = '${posCSS};background:${hexToRgba(bgColor, bgDark ? 0.95 : 0.97)};border-radius:${radius}px;border:1px solid ${borderColor};box-shadow:${shadow};backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:opacity ${speed}s,transform ${speed}s';
  banner.innerHTML = '${bannerHTML.replace(/'/g, "\\'")}';

  // Обработчики кнопок
  function closeBanner(value) {
    setConsent(value);
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(${position.vert === 'Сверху' ? '-20px' : '20px'})';
    setTimeout(function() {
      banner.remove();
      style.remove();
      ${removeBackdrop}
    }, ${Math.round(speed * 1000)});
    // Событие для сайта
    try {
      document.dispatchEvent(new CustomEvent('floqly:consent', {
        detail: { accepted: value === 'accepted' }
      }));
    } catch (e) {}
  }

  banner.querySelector('[data-floqly-accept]').onclick = function() {
    closeBanner('accepted');
  };

  var declineBtn = banner.querySelector('[data-floqly-decline]');
  if (declineBtn) {
    declineBtn.onclick = function() {
      closeBanner('declined');
    };
  }

  // Функция показа баннера
  function showBanner() {
    ${backdropHTML}
    document.body.appendChild(banner);${anim.name ? `
    // Запускаем анимацию появления
    requestAnimationFrame(function() {
      banner.style.animation = '${anim.name} ${speed}s cubic-bezier(0.0,0.0,0.2,1) forwards';
    });` : ''}
  }
${timeTrigger}${scrollTrigger}
  // Ожидаем загрузку DOM${animation.trigger === 'time' ? `
  // (таймер уже запущен выше)` : ''}${animation.trigger === 'scroll' ? `
  // (скролл-слушатель уже установлен)` : ''}
})();
</script>`

  return code
}

/**
 * Считает примерное количество строк в сгенерированном коде.
 */
export function countCodeLines(code: string): number {
  return code.split('\n').length
}
