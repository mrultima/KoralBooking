//Global objeleri inject etmek için kullanılabilir ama şu an kullanılmıyor.

import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({providedIn : 'root'})
export class GlobalService {
  constructor(@Inject(DOCUMENT) private _doc: Document) {}

  getWindow(): Window | null {
    return this._doc.defaultView;
  }

  getLocation(): Location {
    return this._doc.location;
  }

  createElement(tag: string): HTMLElement {
    return this._doc.createElement(tag);
  }
  getDocumentCookie(): string | null {
      return this._doc.cookie;
  }
  setDocumentCookie(string : string ): void {
     this._doc.cookie = string;
  }
  getDocument(): Document | null {
      return this._doc;
  }
}