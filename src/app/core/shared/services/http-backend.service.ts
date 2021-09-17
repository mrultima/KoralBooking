import { Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class HttpBackendService extends HttpClient {

    constructor(
        backend: HttpBackend
    ) {
        super(backend);
    }
}