import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Language } from '../models/langauge';
import { AppService } from './app.service';
import { InjectionService } from './injection.service';
import { TranslateService } from './translate.service';

import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GlobalService } from '../global.service';

@Injectable()
export class AppStarterService {

    isBrowser: boolean;

    constructor(
        private globalService : GlobalService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public inj: Injector,
        public injService: InjectionService
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    async init(): Promise<void> {

        return new Promise<void>(async (resolve, reject) => {
            try {
                this.injService.appService = this.inj.get(AppService);
                await this.setLanguage();
                this.inj.get(ApiService).hotelConfig$.next(
                    await this.inj.get(ApiService).getHotelConfig().toPromise()
                );
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    private async setLanguage(): Promise<void | never> {

        ///////////// BURADA HATA ALIYORUM /////////////////

        if (isPlatformBrowser(this.platformId)) {
            let activeLang: Language = this.injService.appService.supportedLanguages.getValue()[0];

            const userLangs = [
                new URLSearchParams(window.location.search).get('language'),
                this.injService.appService.getCookie('language')
            ].filter(x => !!x);

            for (const lang of userLangs) {
                const f = this.injService.appService.getCookie(lang);
                if (f) {
                    activeLang.langKey = f;
                    break;
                }
            }

            this.injService.appService.setCookie('language', activeLang.langKey, {
                expires: 7,
                path: '/',
                secure: true
            });

            this.inj.get(TranslateService).use(activeLang.langKey);
            this.injService.appService.language.next(activeLang.langKey);
        }
        // let activeLang: Language = this.injService.appService.supportedLanguages.getValue()[0];

        // const userLangs = [
        //     new URLSearchParams(this.globalService.getLocation().search).get('language'),
        //     this.injService.appService.getCookie('language')
        // ].filter(x => !!x);

        // for (const lang of userLangs) {
        //     const f = this.injService.appService.getCookie(lang);
        //     if (f) {
        //         activeLang.langKey = f;
        //         break;
        //     }
        // }

        // this.injService.appService.setCookie('language', activeLang.langKey, {
        //     expires: 7,
        //     path: '/',
        //     secure: true
        // });

        // this.inj.get(TranslateService).use(activeLang.langKey);
        // this.injService.appService.language.next(activeLang.langKey);
    }

    async getConfig() {

        // const domain = this.getDomain(await this.reverseDomain(window.location.hostname)),

    }

}
