import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Language } from '../models/langauge';
import { AppService } from './app.service';
import { InjectionService } from './injection.service';
import { TranslateService } from './translate.service';


@Injectable()
export class AppStarterService {

    constructor(
        public inj: Injector,
        public injService: InjectionService
    ) { }

    async init(): Promise<void> {

        return new Promise<void>(async (resolve, reject) => {
            this.injService.appService = this.inj.get(AppService);
            await this.setLanguage();
            this.inj.get(ApiService).hotelConfig$.next(
                await this.inj.get(ApiService).getHotelConfig().toPromise()
            );
            try {
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    private async setLanguage(): Promise<void | never> {

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

    async getConfig() {

        // const domain = this.getDomain(await this.reverseDomain(window.location.hostname)),

    }

}
