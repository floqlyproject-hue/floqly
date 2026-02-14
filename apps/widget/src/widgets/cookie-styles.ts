/**
 * Cookie Banner CSS Styles
 *
 * Injected into Shadow DOM for complete style isolation.
 * All styles are self-contained — no external dependencies.
 */

export interface CookieBannerStyleConfig {
  backgroundColor: string
  textColor: string
  buttonColor: string
  buttonTextColor: string
  borderRadius: number
  shadow: boolean
  opacity: number
  width: 'stretched' | 'normal' | 'compact'
  vertical: 'top' | 'center' | 'bottom'
  horizontal: 'left' | 'center' | 'right'
  offsetX: number
  offsetY: number
  animationType: 'slide' | 'fade' | 'bounce' | 'scale' | 'none'
  animationSpeed: number
  backdrop: boolean
  backdropBlur: number
  backdropOpacity: number
}

export function getCookieBannerStyles(config: CookieBannerStyleConfig): string {
  const {
    backgroundColor,
    textColor,
    buttonColor,
    buttonTextColor,
    borderRadius,
    shadow,
    opacity,
    width,
    vertical,
    horizontal,
    offsetX,
    offsetY,
    animationType,
    animationSpeed,
    backdrop,
    backdropBlur,
    backdropOpacity,
  } = config

  // Width mapping
  const widthMap = {
    stretched: '100%',
    normal: '480px',
    compact: '360px',
  }
  const maxWidth = widthMap[width] || '480px'

  // Position mapping
  let positionCSS = ''
  if (vertical === 'top') positionCSS += `top: ${offsetY}px;`
  else if (vertical === 'center') positionCSS += 'top: 50%; transform: translateY(-50%);'
  else positionCSS += `bottom: ${offsetY}px;`

  if (horizontal === 'left') positionCSS += `left: ${offsetX}px;`
  else if (horizontal === 'center') positionCSS += 'left: 50%; transform: translateX(-50%);'
  else positionCSS += `right: ${offsetX}px;`

  // Center both axes
  if (vertical === 'center' && horizontal === 'center') {
    positionCSS = 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
  }

  // Stretched positioning
  if (width === 'stretched') {
    positionCSS = vertical === 'top'
      ? `top: 0; left: 0; right: 0;`
      : `bottom: 0; left: 0; right: 0;`
  }

  // Animation keyframes
  const animKeyframes = getAnimationKeyframes(animationType, vertical)
  const animDuration = `${animationSpeed}s`

  return `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .flc-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      ${backdrop ? `background: rgba(0,0,0,${backdropOpacity});` : 'pointer-events: none;'}
      ${backdrop && backdropBlur > 0 ? `backdrop-filter: blur(${backdropBlur}px); -webkit-backdrop-filter: blur(${backdropBlur}px);` : ''}
      opacity: 0;
      transition: opacity ${animDuration} ease;
    }

    .flc-backdrop.flc-visible {
      opacity: 1;
    }

    .flc-banner {
      position: fixed;
      ${positionCSS}
      z-index: 2147483647;
      max-width: ${maxWidth};
      ${width === 'stretched' ? 'width: 100%;' : `width: calc(100% - ${offsetX * 2}px);`}
      background: ${backgroundColor};
      color: ${textColor};
      border-radius: ${width === 'stretched' ? '0' : `${borderRadius}px`};
      ${shadow ? 'box-shadow: 0 8px 32px rgba(0,0,0,0.12);' : ''}
      opacity: ${opacity};
      padding: 20px 24px;
      font-size: 14px;
      line-height: 1.5;
      /* Animation */
      animation: flc-enter ${animDuration} ease forwards;
    }

    .flc-banner.flc-exiting {
      animation: flc-exit ${animDuration} ease forwards;
    }

    .flc-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${textColor};
    }

    .flc-description {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
      color: ${textColor};
      opacity: 0.85;
    }

    .flc-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .flc-btn {
      padding: 10px 20px;
      border: none;
      border-radius: ${Math.max(borderRadius - 4, 4)}px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      font-family: inherit;
    }

    .flc-btn:hover {
      opacity: 0.9;
    }

    .flc-btn:active {
      transform: scale(0.97);
    }

    .flc-btn-accept {
      background: ${buttonColor};
      color: ${buttonTextColor};
    }

    .flc-btn-decline {
      background: transparent;
      color: ${textColor};
      border: 1px solid ${textColor}33;
    }

    .flc-btn-decline:hover {
      background: ${textColor}0a;
    }

    .flc-btn-settings {
      background: transparent;
      color: ${textColor};
      opacity: 0.7;
      font-size: 13px;
      padding: 10px 12px;
    }

    .flc-btn-settings:hover {
      opacity: 1;
    }

    .flc-branding {
      margin-top: 12px;
      font-size: 11px;
      opacity: 0.4;
      text-align: right;
    }

    .flc-branding a {
      color: inherit;
      text-decoration: none;
    }

    .flc-branding a:hover {
      opacity: 0.8;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .flc-banner {
        ${width !== 'stretched' ? 'left: 8px; right: 8px; width: auto; max-width: none;' : ''}
        padding: 16px;
      }

      .flc-buttons {
        flex-direction: column;
      }

      .flc-btn {
        width: 100%;
        text-align: center;
      }
    }

    /* Animations */
    ${animKeyframes}
  `
}

function getAnimationKeyframes(type: string, vertical: string): string {
  const fromBottom = vertical !== 'top'
  const slideOffset = fromBottom ? '30px' : '-30px'

  switch (type) {
    case 'slide':
      return `
        @keyframes flc-enter {
          from { opacity: 0; transform: translateY(${slideOffset}); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes flc-exit {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(${slideOffset}); }
        }
      `
    case 'fade':
      return `
        @keyframes flc-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes flc-exit {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `
    case 'bounce':
      return `
        @keyframes flc-enter {
          0% { opacity: 0; transform: translateY(${slideOffset}) scale(0.95); }
          60% { opacity: 1; transform: translateY(${fromBottom ? '-5px' : '5px'}) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes flc-exit {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(${slideOffset}); }
        }
      `
    case 'scale':
      return `
        @keyframes flc-enter {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes flc-exit {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.9); }
        }
      `
    default: // 'none'
      return `
        @keyframes flc-enter {
          from { opacity: 1; }
          to { opacity: 1; }
        }
        @keyframes flc-exit {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `
  }
}
