import { Inject, Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, } from 'rxjs/operators';
import { BlobStorageService } from '../azure-storage/blob-storage.service';
import { ISasToken } from '../azure-storage/azureStorage';
import { FileHolder, IUploadResponse } from './file-holder';
import { AllowedFileExtensions } from './allowed-file-extensions';
import { IAzureSettings, PortalEnvironment, PORTAL_ENV } from '../../services/portal-injection.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  readonly thumbnailPrefix = 't_';

  readonly blockSize = 1024 * 1024 * 4;

  projectAzureSettings: IAzureSettings = null;

  get azure(): IAzureSettings {
    return this.env.dmStorage;
  }

  constructor(
    private blobStorage: BlobStorageService,
    @Inject(PORTAL_ENV) private env: PortalEnvironment
  ) { }

  uuid(): string {
    const r = (new Date()).getTime().toString(16) + Math.random().toString(16).substring(2) + "0".repeat(16);
    return r.substr(0, 8) + '-' + r.substr(8, 4) + '-' + Math.round(Math.random() * 1e4) + '-8' + r.substr(12, 3) + '-' + r.substr(15, 12);
  }

  getExtension(filename: string): string {
    return Object.keys(AllowedFileExtensions).map(x => '.' + x.toLowerCase()).
      find(x => filename.toLowerCase().substr(-x.length) == x) || "";
  }

  getExtensionMime(mimetype: string): string {
    if (mimetype == null || mimetype == undefined) return;
    const m = mimetype.toLowerCase();
    const find = Object.entries(AllowedFileExtensions).find(x => x[1].toLowerCase() == m);
    if (find) return find[0];
    return '';
  }

  get container(): string {
    return this.projectAzureSettings?.container || this.azure?.container;
  }

  get token(): string {
    return this.projectAzureSettings?.token || this.azure?.token;
  }

  get storageUrl(): string {
    return this.projectAzureSettings?.storageUrl || this.azure?.storageUrl;
  }

  uploadImage(holder: FileHolder): Observable<IUploadResponse> {

    const uuid = this.uuid(),
      fileName = uuid + this.getExtension(holder.file.name);

    const accessToken: ISasToken = {
      container: this.container,
      filename: fileName,
      storageAccessToken: this.token,
      storageUri: this.storageUrl
    }

    if (holder.thumbnail && holder.thumbnail.file) {
      const tAccessToken = JSON.parse(JSON.stringify(accessToken));
      tAccessToken.filename = this.thumbnailPrefix + tAccessToken.filename;
      return combineLatest(
        [
          this.blobStorage
            .uploadToBlobStorage(accessToken, holder.file, this.blockSize),
          this.blobStorage
            .uploadToBlobStorage(tAccessToken, holder.thumbnail.file, this.blockSize)
        ]
      ).pipe(map(r => this.progress(holder.file.name, fileName, (r[0] + r[1]) / 2)))
    }

    return this.blobStorage
      .uploadToBlobStorage(accessToken, holder.file, this.blockSize)
      .pipe(map(progress => this.progress(holder.file.name, fileName, progress)))
  }

  progress(ofile: string, filename: string, progress: number): IUploadResponse {
    return {
      originalFilename: ofile,
      filename: filename,
      progress: progress,
      url: [this.storageUrl, this.container, filename].join('/'),
      thumbnailUrl: [this.storageUrl, this.container, this.thumbnailPrefix + filename].join('/'),
      container: this.container
    };
  }
}
