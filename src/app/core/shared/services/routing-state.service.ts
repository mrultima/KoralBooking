import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NavigateEndUrl } from '../models/navigation-end-url';

@Injectable({
    providedIn: 'root'
})
export class RoutingStateService {
    public history = new BehaviorSubject([]);

    constructor(
        private router: Router
    ) { }

    public loadRouting(): void {

        let historyValue = this.history.getValue();
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd)
          ).subscribe(e => {
            const url = (e as NavigationEnd).url;

              const urlTree = this.router.parseUrl(url);
              if (urlTree.root.children['primary'] && urlTree.root.children['primary'].segments
               && urlTree.root.children['primary'].segments.length > 0 ) {
                const navigationEndObj: NavigateEndUrl = {
                    Url: urlTree.root.children['primary'].segments[0].path,
                    UrlName: urlTree.root.children['primary'].segments[1]
                    ? urlTree.root.children['primary'].segments[1].path : ''
                };
                const isFound = historyValue.filter(item => {
                    return item.Url === urlTree.root.children['primary'].segments[0].path;
                });
                if (isFound.length === 0) {
                    historyValue = [...historyValue, navigationEndObj];
                } else {
                    const updateHistoryValue = isFound[0];
                    updateHistoryValue.Url = urlTree.root.children['primary'].segments[0].path;
                    updateHistoryValue.UrlName =  urlTree.root.children['primary'].segments[1]
                                                ? urlTree.root.children['primary'].segments[1].path
                                                : urlTree.root.children['primary'].segments[0].path;
                    historyValue = historyValue.slice(0, historyValue.indexOf(isFound));
                }
                this.history.next(historyValue);
            }
        });

    }

    public getHistory(): string[] {
        return this.history.getValue();
    }

    public getPreviousUrl(): string {
        //return this.history[this.history.length - 2] || '/index';
        return null;
    }
}