import { Injectable, Injector } from '@angular/core';
import { ApiService, PortalService, PortalInjectionService, LoginService, AppService, PORTAL_ENV } from '@travelaps/core/shared';
import { HotelService } from '@travelaps/hotel/shared';
import { OnlineService } from '@travelaps/pages/online/online.service';

@Injectable()
export class AppStarterService {

  constructor(
    private api: ApiService,
    private inj: Injector
  ) {
  }

  TLDs = ["ac", "ad", "ae", "aero", "af", "ag", "ai", "al", "am", "an", "ao", "aq", "ar", "arpa", "as", "asia", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "biz", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cat", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "com", "coop", "cr", "cu", "cv", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "edu", "ee", "eg", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gov", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "info", "int", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jobs", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mil", "mk", "ml", "mm", "mn", "mo", "mobi", "mp", "mq", "mr", "ms", "mt", "mu", "museum", "mv", "mw", "mx", "my", "mz", "na", "name", "nc", "ne", "net", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "org", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "pro", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "st", "su", "sv", "sy", "sz", "tc", "td", "tel", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "travel", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "xn--0zwm56d", "xn--11b5bs3a9aj6g", "xn--3e0b707e", "xn--45brj9c", "xn--80akhbyknj4f", "xn--90a3ac", "xn--9t4b11yi5a", "xn--clchc0ea0b2g2a9gcd", "xn--deba0ad", "xn--fiqs8s", "xn--fiqz9s", "xn--fpcrj9c3d", "xn--fzc2c9e2c", "xn--g6w251d", "xn--gecrj9c", "xn--h2brj9c", "xn--hgbk6aj7f53bba", "xn--hlcj6aya9esc7a", "xn--j6w193g", "xn--jxalpdlp", "xn--kgbechtv", "xn--kprw13d", "xn--kpry57d", "xn--lgbbat1ad8j", "xn--mgbaam7a8h", "xn--mgbayh7gpa", "xn--mgbbh1a71e", "xn--mgbc0a9azcg", "xn--mgberp4a5d4ar", "xn--o3cw4h", "xn--ogbpf8fl", "xn--p1ai", "xn--pgbs0dh", "xn--s9brj9c", "xn--wgbh1c", "xn--wgbl6a", "xn--xkc2al3hye2a", "xn--xkc2dl3a5ee0h", "xn--yfro4i67o", "xn--ygbi2ammx", "xn--zckzah", "xxx", "ye", "yt", "za", "zm", "zw"];


  dmHost = [
    'canandurukal.com',
    'urrorder.utopiahotels.com',
    'ubcorder.utopiahotels.com'
  ];

  dmAppHost = [
    'yenimenu.com',
    'bisiparis.com',
    ...this.dmHost
  ];

  host = [
    'elektrabulut.com',
    'elektraweb.net',
    'hoteladvisor.net',
    'rezervasyonal.com',
    'oteldensatinal.com',
    'easyonlinebooking.com',
    'meroddihotels.com',
    'corendonhotels.com.tr',
    'hotelsofturkey.com',
    'www.hotelsofturkey.com',
    'hotelsofmacedonia.com',
    'www.hotelsofmacedonia.com',
    'reservation.az',
    'www.reservation.az',
    'utopiahotels.com',
    ...this.dmAppHost
  ];

  menuSubdomain = [
    'paket',
    'package',
    'menu',
    'siparis'
  ];

  getDomain(url: string) {
    let parts = url.split('.'), _parts = url.split('.');
    if (parts[0] === 'www' && parts[1] !== 'com') {
      parts.shift();
    }
    let ln = parts.length
      , i = ln
      , minLength = parts[parts.length - 1].length
      , part;
    while (part = parts[--i]) {
      if (i === 0                    // 'asia.com' (last remaining must be the SLD)
        || i < ln - 2                // TLDs only span 2 levels
        || part.length < minLength // 'www.cn.com' (valid TLD as second-level domain)
        || this.TLDs.indexOf(part) < 0  // officialy not a TLD
      ) {
        const
          SUBDOMAIN = _parts.slice(0, i + ((parts.length !== _parts.length) ? 1 : 0)).join('.'),
          HOSTNAME = parts.slice(i).join('.'),
          DOMAINNAME = part,
          EXTENSION = parts.slice(i + 1).join('.'),
          HOST = `${SUBDOMAIN}${SUBDOMAIN.length > 0 ? '.' : ''}${HOSTNAME}`,
          URL = `${location.protocol}//${HOST}/`,
          SUBDOMAINNAME = (subdomainName?: string) => {
            return `${typeof subdomainName === 'string' && subdomainName.length > 0 ? subdomainName + '.' : ''}${HOSTNAME}`
          },
          SUBDOMAINURL = (subdomainName?: string) => {
            return `${location.protocol}//${SUBDOMAINNAME(subdomainName)}/`;
          };
        return {
          SUBDOMAIN,
          HOSTNAME,
          DOMAINNAME,
          EXTENSION,
          HOST,
          URL,
          SUBDOMAINNAME,
          SUBDOMAINURL
        };
      }
    }
  }

  // async reverseDomain(domain) {
  //   const result = await this.api.execSP({
  //     Object: 'SP_HOTELBOOKING_REVERSEDOMAIN',
  //     Parameters: {
  //       'DOMAIN': domain
  //     }
  //   });
  //   if (result && result[0].length >= 1) {
  //     return result[0][0]['SUBDOMAIN'];
  //   }
  //   return domain;
  // }

  async getConfig() {

    // const domain = this.getDomain(await this.reverseDomain(window.location.hostname)),
    const domain = this.getDomain(window.location.hostname),
      url = new URL(window.location.href);

    let SUBDOMAIN = domain.SUBDOMAIN,
      GROUPHOTELID = null,
      GROUPHOTELSUBDOMAIN = null;

    if (SUBDOMAIN === 'www') {
      SUBDOMAIN = '';
    }

    let HOTELID: number = null;
    if (url.searchParams.has('HOTELID')) {
      const _hotelID = +url.searchParams.get('HOTELID');
      if (!isNaN(_hotelID) && _hotelID) {
        HOTELID = _hotelID;
      }
    }

    let SEOURL = null, CNAMEWEB = null,
      CNAMEWEBSUB = null;
    const path = url.pathname;
    if (path && path !== '/' && !HOTELID) {
      let t: any;
      if (t = /\/Hotel\/[a-z0-9_-]+[-_](\d+)\/?$/i.exec(path)) {
        HOTELID = t[1];
      } else if (t = /\/Hotel\/(\d+)\/?$/i.exec(path)) {
        HOTELID = t[1];
      } else if (t = /\/Hotel\/([a-z0-9_-]+)\/?$/i.exec(path)) {
        SEOURL = t[1];
      }
    }
    const portalService = this.inj.get(PortalService);
    /* if (!SUBDOMAIN && !SEOURL && !HOTELID) {
      const lhid = localStorage.getItem(portalService.lcHId);
      if (lhid && !isNaN(+lhid)) {
        HOTELID = +lhid;
      }
    } */

    let RESTAURANT = false;
    const LOCAL = domain.HOST.startsWith('192.168.1.');
    if (this.dmAppHost.indexOf(domain.HOSTNAME) !== -1 || this.dmAppHost.indexOf(domain.HOST) !== -1 || LOCAL || (
      this.host.indexOf(domain.HOSTNAME) === -1 && SUBDOMAIN !== null && SUBDOMAIN.length > 0 && this.menuSubdomain.find(x => x.startsWith(SUBDOMAIN))
    )) {
      HOTELID = null;
      RESTAURANT = true;
      if (this.dmHost.indexOf(domain.HOSTNAME) !== -1) {
        CNAMEWEB = domain.HOSTNAME;
        CNAMEWEBSUB = [domain.SUBDOMAIN, domain.HOSTNAME].join('.');
      } else if (this.dmAppHost.indexOf(domain.HOST) !== -1) {
        CNAMEWEB = CNAMEWEBSUB = [domain.SUBDOMAIN, domain.HOSTNAME].join('.');
      }
    }

    if (url.host === 'elektrabooking.z16.web.core.windows.net') {
      SEOURL = null;
      SUBDOMAIN = null;
      HOTELID = 18892;
    } else if (this.host.indexOf(domain.HOSTNAME) === -1) {
      HOTELID = null;
      SEOURL = null;
      SUBDOMAIN = null;
      CNAMEWEB = domain.HOSTNAME;
      CNAMEWEBSUB = [domain.SUBDOMAIN, domain.HOSTNAME].join('.');
    } else {
      if (SUBDOMAIN) {
        const groupOtelPathSubdomain = SUBDOMAIN.match(/^portal-([a-z0-9-_]+)$/i);
        if (groupOtelPathSubdomain) {
          GROUPHOTELSUBDOMAIN = groupOtelPathSubdomain[1];
        }
      } else if (domain.HOSTNAME === 'hotelsofturkey.com' || domain.HOSTNAME === 'hotelsofmacedonia.com' || domain.HOSTNAME === 'reservation.az') {
        GROUPHOTELSUBDOMAIN = domain.HOSTNAME;
        SUBDOMAIN = 'www';
      }

      if (!GROUPHOTELID && !GROUPHOTELSUBDOMAIN && url.pathname.startsWith('/GroupHotel')) {
        const path = url.pathname.split('/').filter(x => !!x);
        if (path.length == 2) {
          const p = path[1];
          if (!isNaN(+p)) {
            GROUPHOTELID = +p;
          } else if (/[a-z0-9-_]+/i.test(p)) {
            GROUPHOTELSUBDOMAIN = p;
          }
        }
      }
    }

    if (!SUBDOMAIN && !SEOURL && !HOTELID && !RESTAURANT && !GROUPHOTELSUBDOMAIN && !GROUPHOTELID && !CNAMEWEB) {
      window.location.href = 'https://www.elektraotel.com/';
      // window.location.href = '/home.html';
      return false;
    }

    return new Promise<void | never>(async (resolve, reject) => {
      await this.api.getEndPoint(!RESTAURANT);
      portalService.appInitialized$.subscribe(async s => {
        if (s && RESTAURANT) {
          if (SUBDOMAIN && SUBDOMAIN === 'app') {
            return resolve();
          }
          if (LOCAL) {
            SUBDOMAIN = 'myhotel';
            this.inj.get(PORTAL_ENV).local = true;
            this.api.loginToken = this.inj.get(PORTAL_ENV)?.localLoginToken;
          }
          if (SUBDOMAIN && !(await this.inj.get(RestaurantService).init({ SUBDOMAIN, APP: true }))) {
            reject();
          } else if (CNAMEWEB && !(await this.inj.get(RestaurantService).init({ CNAMEWEB, CNAMEWEBSUB, APP: true }))) {
            reject();
          }
          resolve();
          return;
        }
        if (s) {
          this.inj.get(HotelService).hotelsofturkey = domain.HOSTNAME === 'hotelsofturkey.com' || domain.HOSTNAME === 'hotelsofmacedonia.com' || domain.HOSTNAME === 'reservation.az';
          await this.inj.get(HotelService).initConfig(portalService.initParams);
          resolve();
        }
      });
      const portalInjectionService = this.inj.get(PortalInjectionService);
      portalInjectionService.APP_SERVICE = this.inj.get(AppService);
      portalInjectionService.APP_SERVICE.domain = domain;
      try {
        await portalService.initConfig({
          SUBDOMAIN,
          HOTELID,
          SEOURL,
          RESTAURANT,
          GROUPHOTELID,
          GROUPHOTELSUBDOMAIN,
          CNAMEWEB,
          CNAMEWEBSUB
        });
      } catch (e) {
        alert(e.error || e.message || e);
        reject();
      }
      portalInjectionService.PORTAL_SERVICE = portalService;
      portalInjectionService.LOGIN_SERVICE = this.inj.get(LoginService);
      portalInjectionService.RESTAURANT_SERVICE = this.inj.get(RestaurantService);
      portalInjectionService.RESTAURANT_ORDER_SERVICE = this.inj.get(RestaurantOrderService);
      portalInjectionService.ONLINE_SERVICE = this.inj.get(OnlineService);
      await portalInjectionService.LOGIN_SERVICE.checkLogin();
      portalInjectionService.STARTER_PORTAL_CONFIG.next(JSON.parse(JSON.stringify(
        portalService.portalConfig$.getValue()
      )));
      portalInjectionService.app$.next(true);

    });
  }
}
