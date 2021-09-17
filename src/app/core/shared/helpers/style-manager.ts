import { Injectable } from '@angular/core';
import { PortalPaletteHueColors } from '../services/style-variables.service';


/**
 * Class for managing stylesheets. Stylesheets are loaded into named slots so that they can be
 * removed or changed later.
 */
@Injectable()
export class StyleManager {
  /**
   * Set the stylesheet with the specified key.
   */
  setStyle(key: string, href: string, type?: string) {
    getLinkElementForKey(key, type).setAttribute('href', href);
  }

  setScript(key: string) {
    createScriptElementWithKey(key);
  }

  /**
   * Remove the stylesheet with the specified key.
   */
  removeStyle(key: string) {
    const existingLinkElement = getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  removeDefault(key: string) {
    const defaultTheme = document.head.querySelector(`link[rel="stylesheet"][href="${getClassNameForKey(key)}.css"]`);
    if (defaultTheme) {
      document.head.removeChild(defaultTheme);
    }
  }

  // type : p : primary | a: accent | w: warn | s: secondary
  setColor(color: PortalPaletteHueColors, type: 'p' | 'a' | 'w' | 's') {
    const root = document.documentElement;
    root.style.setProperty(`--${type}-c-1`, color.lighter.hex);
    root.style.setProperty(`--${type}-c-1-rgb`, hexToRgb(color.lighter.hex));
    root.style.setProperty(`--${type}-c-5`, color.default.hex);
    root.style.setProperty(`--${type}-c-5-rgb`, hexToRgb(color.default.hex));
    root.style.setProperty(`--${type}-c-7`, color.darker.hex);
    root.style.setProperty(`--${type}-c-7-rgb`, hexToRgb(color.darker.hex));
    root.style.setProperty(`--${type}-c-1-contrast`, color.lighter.contrast);
    root.style.setProperty(`--${type}-c-5-contrast`, color.default.contrast);
    root.style.setProperty(`--${type}-c-7-contrast`, color.darker.contrast);
    if (color.secondary) {
      root.style.setProperty(`--${type}-s-5`, color.secondary.hex);
      root.style.setProperty(`--${type}-s-5-rgb`, hexToRgb(color.secondary.hex));
      root.style.setProperty(`--${type}-s-5-contrast`, color.secondary.contrast);
    }
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ].join(', ') : null;
}

function getLinkElementForKey(key: string, type?: string) {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key, type);
}

function getExistingLinkElementByKey(key: string) {
  return document.head.querySelector(`link[rel="stylesheet"].${getClassNameForKey(key)}`);
}

function createLinkElementWithKey(key: string, type?: string) {
  const linkEl = document.createElement('link');

  if (type != null && type !== '') {
    linkEl.setAttribute('rel', key);

    if (type !== 'icon') {
      linkEl.setAttribute('type', type);
    }
  } else {
    linkEl.setAttribute('rel', 'stylesheet');
  }

  // linkEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(linkEl);
  return linkEl;
}

function createScriptElementWithKey(key: string) {
  const scriptEl = document.createElement('script');
  scriptEl.setAttribute('type', 'text/javascript');
  scriptEl.setAttribute('src', key);
  // scriptEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(scriptEl);
  return scriptEl;
}

function getClassNameForKey(key: string) {
  return `style-manager-${key}`;
}
