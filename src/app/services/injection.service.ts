import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';


@Injectable({
    providedIn: 'root'
})
export class InjectionService {
    appService: AppService;

    constructor(
    ) { }
}
