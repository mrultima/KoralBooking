import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

export interface PortalSeo {
  title: string;
  description: string;
  keywords: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  defaultTags = new BehaviorSubject<{ args: PortalSeo, default: string }>(undefined);

  constructor(
    private meta: Meta,
    private title: Title
  ) {
  }

  createTags(args: PortalSeo, defaultContent: string) {
    const fullUrl = window.location.href;
    const splittedHost = window.location.host.split('.');
    const siteName = splittedHost[1] + '.' + splittedHost[2];

    this.title.setTitle(args.title || defaultContent || siteName);
    this.meta.addTag({property: 'og:title', content: args.title || defaultContent || siteName});
    this.meta.addTag({name: 'description', content: args.description || defaultContent || siteName});
    this.meta.addTag({name: 'keywords', content: args.keywords || defaultContent || siteName});
    this.meta.addTag({property: 'og:description', content: args.description || defaultContent || siteName});
    this.meta.addTag({property: 'og:keywords', content: args.keywords || defaultContent || siteName});
    this.meta.addTag({property: 'og:image', content: args.url || defaultContent});
    this.meta.addTag({
      property: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.addTag({
      property: 'twitter:domain',
      content: siteName,
    });
    this.meta.addTag({
      property: 'twitter:url',
      content: fullUrl,
    });
    this.meta.addTag({
      property: 'twitter:url',
      content: fullUrl,
    });
    this.meta.addTag({
      property: 'twitter:title',
      content: args.title || defaultContent,
    });
    this.meta.addTag({
      property: 'twitter:description',
      content: args.description || defaultContent,
    });
    this.meta.addTag({
      property: 'twitter:image',
      content: args.url || '',
    });
  }

  updateTags(args: PortalSeo, defaultContent: string, isReset = false) {
    const def = defaultContent || this.defaultTags.getValue().default || '';
    let title = args.title || this.defaultTags.getValue().args.title || def;
    const description = args.description || this.defaultTags.getValue().args.description || def;
    const keywords = args.keywords || this.defaultTags.getValue().args.keywords || def;

    if (!isReset) {
      let rightSide = this.defaultTags.getValue().args.title || def;
      if (title === rightSide) {
        rightSide = '';
      }
      this.title.setTitle(title + (rightSide ? ' | ' + rightSide : ''));
    } else {
      this.title.setTitle(title);
    }
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({name: 'keywords', content: keywords});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({property: 'og:keywords', content: keywords});
  }

  clearTagsToDefaults() {
    const tags = this.defaultTags.getValue();
    this.updateTags(tags.args, tags.default, true);
  }
}
