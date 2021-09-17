import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PortalService } from './portal.service';

@Injectable({
  providedIn: 'root'
})
export class TawktoService {
  attrs: any | {};

  constructor(
    public api: ApiService,
    private portalService: PortalService
  ) { }

  init() {
    if (!this.portalService.portalConfig.TAWKTO) {
      return;
    }
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
      .tawkto-chat {
        position: fixed;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #40598e;
        right: 20px;
        bottom: 20px;
        z-index: 9999999999;
        cursor: pointer;
      }
        svg.tawkto-chat-icon {
          width: 34px;
          margin-left: 13px;
          height: 60px;
          fill: white;
        }
        .tawkto-chat-drag-handle {
          width: 16px;
          height: 16px;
          position: absolute;
          right: -8px;
          top: -2px;
        }
        svg.tawkto-drag-icon {
          width: 16px;
            cursor: move;
            color: #ccc;
        }

      </style>
      <div id="tawkto-chat" class="tawkto-chat" draggable="true">
  <div id="tawkto-chat-drag-handle" class="tawkto-chat-drag-handle">
    <svg width="24px" class="tawkto-drag-icon" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z">
      </path>
      <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>
  </div>
  <svg class="tawkto-chat-icon" id="tawkto-chat-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
    <path
      d="M400 26.2c-193.3 0-350 156.7-350 350 0 136.2 77.9 254.3 191.5 312.1 15.4 8.1 31.4 15.1 48.1 20.8l-16.5 63.5c-2 7.8 5.4 14.7 13 12.1l229.8-77.6c14.6-5.3 28.8-11.6 42.4-18.7C672 630.6 750 512.5 750 376.2c0-193.3-156.7-350-350-350zm211.1 510.7c-10.8 26.5-41.9 77.2-121.5 77.2-79.9 0-110.9-51-121.6-77.4-2.8-6.8 5-13.4 13.8-11.8 76.2 13.7 147.7 13 215.3.3 8.9-1.8 16.8 4.8 14 11.7z"
      fill-rule="evenodd" clip-rule="evenodd"></path>
  </svg>
</div>
    `;
    document.body.appendChild(el);
    window['tawkto-chat-icon-svg'].onclick = () => this.openTawkToPopup();
    const dEl = window['tawkto-chat-drag-handle'], tEl = window['tawkto-chat'];
    let isDown = false;
    let offset = [0, 0];
    ['mousedown', 'touchstart'].forEach(x => {
      if (dEl) {
        dEl.addEventListener(x, (e: any) => {
          isDown = true;
          offset = [
            tEl.offsetLeft - e.clientX,
            tEl.offsetTop - e.clientY
          ];
        }, true);
      }
    });
    ['mouseup', 'touchend'].forEach(x => {
      document.addEventListener(x, () => {
        isDown = false;
      }, true);
    });
    ['mousemove', 'touchmove'].forEach(x => {
      document.addEventListener(x, (event: any) => {
        if (isDown) {
          event.preventDefault();
          const mousePosition = {
            x: event.clientX,
            y: event.clientY
          };
          tEl.style.left = (mousePosition.x + offset[0]) + 'px';
          tEl.style.top = (mousePosition.y + offset[1]) + 'px';
        }
      }, true);
    });
    this.refreshUser();
  }


  refreshUser() {
    let attr: any | {} = {};
    const localCache = this.portalService.getLocalCache();
    if (localCache && localCache.length > 0) {
      let lCache = localCache[0];
      attr = {
        "h": lCache.h,
        "s": lCache.s,
        "o": lCache.o,
        "l": lCache.l,
        "v": lCache.v,
        "c": lCache.c
      };
    }

    this.attrs = attr;
    /* this.setAttributes(attr); */
  }

  // tslint:disable-next-line:member-ordering
  winRef: Window;
  openTawkToPopup() {
    if (this.winRef && !this.winRef.closed) {
      this.winRef.focus();
      return;
    }
    let src: string;
    src = 'https://embed.tawk.to/' + this.portalService.portalConfig.TAWKTO;
    const url = new URL(window.location.protocol + '//' + window.location.host);
    try {
      url.pathname = document.querySelector('base').getAttribute('href');
    } catch (e) { }
    if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }
    url.pathname += 'assets/tawkto.html';
    url.searchParams.append('title', 'online booking');
    url.searchParams.append('src', src);
    url.searchParams.append('_r', Math.random().toString());
    if (this.attrs && typeof this.attrs === 'object') {
      for (const k of Object.keys(this.attrs)) {
        url.searchParams.append(k, this.attrs[k]);
      }
    }
    const w = 360, h = 565;
    this.winRef = window.open(
      url.toString(),
      '_blank',
      `width=${w},height=${h},left=${window.innerWidth - w - 50},top=${window.innerHeight - h - 50},resizable=yes,scrollbars=yes`
    );
  }
}
