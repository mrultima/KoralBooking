import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import {
  FileHolder,
  HolderStyle,
  ImageDimensionSettings,
  ImageSize,
  IUploadedFile,
  IUploadResponse,
  SupportedImageDimensions,
  UploadedFile
} from '../file-holder';
import { ImageUploadService } from '../image-upload.service';
import { ImageUploadMessage } from './image-upload-message';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, filter } from 'rxjs/operators';
import { AllowedFileExtensions } from '../allowed-file-extensions';
import { DialogService } from '../../../../shared/sharedDialogs/dialog.service';
import { SnapPhotoService } from '../../../../components/snap-photo/snap-photo.service';
import { TranslateService } from '../../../../shared/services/translate.service';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  providers: [Ng2ImgMaxService, ImageUploadService]
})
export class ImageUploadComponent implements OnInit, OnChanges {
  files: Array<FileHolder> = [];
  deletedFiles: Array<FileHolder> = [];
  acceptExtensions = null;

  @Input() selectButtonCaption = 'Select Photo';
  @Input() uploadButtonCaption = 'Upload';
  @Input() disabled = false;
  @Input('class') cssClass = 'img-ul';
  @Input() deleteAllButtonCaption = 'Delete all';
  @Input() saveButton = false;
  @Input() saveButtonCaption = "Save";
  @Input() dropBoxMessage = 'Drag photos here...';
  @Input() defaultImageTooltip = 'Default photo';
  @Input() max = 100;
  @Input() quality = 80; //sadece jpeg standardı için
  @Input() maxFileSize = 1e3;
  @Input() style: HolderStyle;
  @Input() deleteAllButton = true;
  @Input('extensions') supportedExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'];
  @Input() fileUpload = false;
  @Input() uploadedFiles: string[] | Array<IUploadedFile> = [];
  @Input() autoUpload = false;
  @Input() uploadButton = true;
  @Input() imageFileDimensions = false;
  @Input() imageDimensions: ImageDimensionSettings = null;
  @Input() supportedDimensions: SupportedImageDimensions = null;
  @Input() thumbnailDimensions: ImageDimensionSettings = null;
  @Input() appendFileMode: 'after' | 'before' = 'after';
  @Input() snapPhotoButton = true;
  @Output() removed = new EventEmitter<FileHolder>();
  @Output() uploadStateChanged = new EventEmitter<boolean>();
  @Output() processStateChanged = new EventEmitter<boolean>();
  @Output() uploadFinished = new EventEmitter<FileHolder>();
  @Output() uploadStarted = new EventEmitter<FileHolder>();
  @Output() uploadError = new EventEmitter<FileHolder>();
  @Output() previewClicked = new EventEmitter<FileHolder>();
  @Output() changeFile = new EventEmitter<FileHolder>();
  @Output() changedSorting = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  @ViewChild('input')
  private inputElement: ElementRef;
  public pendingFilesCounter = 0;

  private _processFilesCounter = 0;
  public get processFilesCounter(): number { return this._processFilesCounter; }
  public set processFilesCounter(val: number) {
    if (val < 0) val = 0;
    this._processFilesCounter = val;
    this.processFilesCounter$.next(val);
  }
  private processFilesCounter$ = new Subject<number>();

  get ng2ImgMax(): Ng2ImgMaxService {
    return this.inj.get(Ng2ImgMaxService);
  }

  constructor(
    private imageService: ImageUploadService,
    private dialog: DialogService,
    private renderer: Renderer2,
    private inj: Injector,
    public translateService: TranslateService,
    public snapPhotoService: SnapPhotoService,
    public cdr: ChangeDetectorRef,
  ) { }

  translate(v: string): string {
    return this.translateService.transform(v);
  }

  snapPhoto(): void {
    this.snapPhotoService.photo().pipe(filter(x => !!x)).subscribe(resp => {
      const base64 = resp.split(',')[1], bin = atob(base64), l = bin.length, dArr = [];
      for (let i = 0; i < l; i++) dArr.push(bin.charCodeAt(i));
      this.onFileChange(<any>[new File([new Blob([new Uint8Array(dArr)])], String.raw`${+Date.now()}.jpg`, {
        type: 'image/jpeg'
      })]);
    });
  }

  detectChanges() {
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    if (this.fileUpload) {
      this.acceptExtensions = Object.values(AllowedFileExtensions).join(',');
      this.supportedExtensions = Object.keys(AllowedFileExtensions);
    } else {
      this.acceptExtensions = this.supportedExtensions ?
        this.supportedExtensions.map((ext) => 'image/' + ext).join(',') : 'image/*';
    }

    this.processFilesCounter$.next(0);
    this.processFilesCounter$.pipe(
      map(x => x != 0),
      distinctUntilChanged()
    ).subscribe(t => {
      this.processStateChanged.emit(t);
    })
  }

  saveEvent(): void {
    this.save.emit();
  }

  deleteAll(): void {
    this.files.filter(x => x.uploaded).forEach(x => {
      this.deletedFiles.push(x);
    })
    this.files.forEach(f => this.removed.emit(f));
    this.files = [];
    if (this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }
  }

  sorting(): void {
    this.changedSorting.emit();
  }

  deleteFile(file: FileHolder): void {
    const index = this.files.indexOf(file);
    if (file.uploaded) {
      this.deletedFiles.push(file);
    }
    this.files.splice(index, 1);
    if (this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }
    this.removed.emit(file);
  }

  previewFileClicked(file: FileHolder): void {
    this.previewClicked.emit(file);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uploadedFiles && Array.isArray(changes.uploadedFiles.currentValue)) {
      this.processUploadedFiles();
    }
  }

  getRemainingSlots(): number {
    return this.max - this.files.length;
  }

  onFileChange(files: FileList): void {

    if (this.disabled) return;
    if (this.getRemainingSlots() - files.length >= 0) {
      this.uploadFiles(files);
    } else {
      this.dialog.openAlertMessagesDialog('LBL_ERROR', `${this.translate(ImageUploadMessage.LIMIT)} (${this.max})`);
    }
  }

  private onResponse(response: IUploadResponse, fileHolder: FileHolder): void {
    fileHolder.progress = response.progress;
    if (response.progress != 100) {
      return;
    }
    fileHolder.src = response.url;
    if (fileHolder.thumbnail) {
      fileHolder.thumbnail.src = response.thumbnailUrl;
    }
    fileHolder.pending = false;
    fileHolder.uploaded = true;
    this.uploadFinished.emit(fileHolder);
    if (--this.pendingFilesCounter === 0) {
      this.uploadStateChanged.emit(false);
    }
  }

  private processUploadedFiles(): void {
    //this.files = this.files.filter(x => x.existing).map(x => null);
    //this.files = this.files.filter(x => x);
    this.files = [];
    this.uploadedFiles = this.uploadedFiles.slice(0, this.max);
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      const data: any = this.uploadedFiles[i];

      let fileBlob: Blob,
        file: File,
        fileUrl: string;

      if (data instanceof Object) {
        fileUrl = data.url;
        fileBlob = (data.blob) ? data.blob : new Blob([data]);
        file = new File([fileBlob], data.filename);
      } else {
        fileUrl = data;
        fileBlob = new Blob([fileUrl]);
        file = new File([fileBlob], fileUrl);
      }

      const holder = new FileHolder(fileUrl, file, true);

      holder.type = data.type || null;
      holder.filesize = data.filesize || null;
      holder.size = {
        width: data.size && data.size.width || null,
        height: data.size && data.size.height || null
      }
      holder.extension = data.extension || this.imageService.getExtension(file.name).substr(1) || this.imageService.getExtensionMime(data.type);
      if (data.thumbnail) {
        holder.thumbnail = {
          src: data.thumbnail.url,
          size: {
            width: data.thumbnail.size && data.thumbnail.size.width || null,
            height: data.thumbnail.height && data.thumbnail.size.height || null
          }
        }
      }
      holder.params = data.params;
      holder.existing = true;
      holder.default = data.default;
      holder.caption = data.caption;

      if (this.imageFileDimensions) {
        if (!holder.size) holder.size = new ImageSize();
        this.setImageDimensions(holder.src, holder.size);
        if (holder.thumbnail && holder.thumbnail.size) {
          if (!holder.thumbnail.size) holder.thumbnail.size = new ImageSize();
          this.setImageDimensions(holder.thumbnail.src, holder.thumbnail.size);
        }
      }

      this.files.push(holder);
    }
  }

  private setImageDimensions(src: string, s: ImageSize) {
    const img = new Image();
    img.onload = (): void => {
      s.width = img.width || null;
      s.height = img.height || null;
    }
    img.src = src;
  }

  private checkDimensions(size: ImageSize) {
    if (!this.supportedDimensions) {
      return true;
    }
    return (this.supportedDimensions.maxHeight ? this.supportedDimensions.maxHeight >= size.height : true) &&
      (this.supportedDimensions.minHeight ? this.supportedDimensions.minHeight <= size.height : true) &&
      (this.supportedDimensions.maxWidth ? this.supportedDimensions.maxWidth >= size.width : true) &&
      (this.supportedDimensions.minWidth ? this.supportedDimensions.minWidth <= size.width : true);
  }

  private dimensionMsg(): string[] {
    let r = [];
    if (this.supportedDimensions.maxHeight && this.supportedDimensions.minHeight)
      r.push(`${this.translate(ImageUploadMessage.DIMENSIONS_HEIGHT)} [${this.supportedDimensions.minHeight}-${this.supportedDimensions.maxHeight}]px`);
    else if (this.supportedDimensions.minHeight) r.push(`${this.translate(ImageUploadMessage.DIMENSIONS_MINHEIGHT)} ${this.supportedDimensions.minHeight}px`);
    else if (this.supportedDimensions.maxHeight) r.push(`${this.translate(ImageUploadMessage.DIMENSIONS_MAXHEIGHT)} ${this.supportedDimensions.maxHeight}px`);

    if (this.supportedDimensions.maxWidth && this.supportedDimensions.minWidth)
      r.push(`${this.translate(ImageUploadMessage.DIMENSIONS_WIDTH)} [${this.supportedDimensions.minWidth}-${this.supportedDimensions.maxWidth}]px`);
    else if (this.supportedDimensions.minWidth) r.push(`${this.translate(ImageUploadMessage.DIMENSIONS_MINWIDTH)} ${this.supportedDimensions.minWidth}px`);
    else if (this.supportedDimensions.maxWidth) r.push(`${this.translate(ImageUploadMessage.DIMENSIONS_MAXWIDTH)} ${this.supportedDimensions.maxWidth}px`);
    return r;
  }

  checkExtension(fileName: string): boolean {
    const exts = this.supportedExtensions.map(x => "." + x.toLowerCase());
    return !!exts.find(x => fileName.toLowerCase().substr(-x.length) == x);
  }

  private async getImageDimensions(data: string): Promise<ImageSize> {
    return new Promise(resolve => {
      let i = new Image();
      i.onload = () => { resolve({ width: i.width, height: i.height }) };
      i.onerror = () => { resolve(null); };
      i.src = data
    })
  }

  private async resize(file: File, settings: ImageDimensionSettings): Promise<File | null> {
    return new Promise((resolve) => {
      this.ng2ImgMax.resizeImage(file, settings.maxWidth, settings.maxHeight).subscribe(r => {
        resolve(r);
      }, () => {
        resolve(null);
      })
    })
  }

  private applyQuality(data: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = data;
      img.onload = () => {
        const c = this.renderer.createElement('canvas') as HTMLCanvasElement,
          ctx = c.getContext('2d');
        if (!ctx) {
          resolve(data);
          return;
        }
        this.renderer.setStyle(c, 'display', 'none');
        this.renderer.appendChild(document.body, c);
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const resp = c.toDataURL('image/jpeg', this.quality / 100);
        this.renderer.removeChild(document.body, c);
        resolve(resp);
      }
    })
  }

  private async uploadFiles(files: FileList) {

    const errors = [];
    let dErr = false;

    for (let i = 0; i < files.length; i++) {

      const file = files[i], isImage = /image\//i.test(file.type);

      if (this.files.find(x => !x.existing && x.file.name == file.name && x.file.size == file.size) ||
        (!this.fileUpload && !isImage)
      ) { continue }

      if (this.maxFileSize && file.size > (this.maxFileSize * 1 << 10)) {
        errors.push({
          file: file.name,
          message: `${this.translate(ImageUploadMessage.TOO_LARGE)}  (${(this.maxFileSize / 1e3).toFixed(2)} MB)`
        });
      }

      if (this.supportedExtensions.length && !this.checkExtension(file.name)) {
        errors.push({
          file: file.name,
          message: this.translate(ImageUploadMessage.EXTENSION)
        });
      }

      if (errors.length) {
        continue;
      }

      const fileHolder: FileHolder = new FileHolder(null, file, false);

      if (this.appendFileMode == 'before') {
        this.files.unshift(fileHolder)
      } else {
        this.files.push(fileHolder);
      }

      this.processFilesCounter++;

      let ofile = null;
      if (isImage && this.imageDimensions) {
        ofile = await this.resize(file, this.imageDimensions);
        if (!ofile) {
          this.deleteFile(fileHolder);
          this.processFilesCounter--;
          continue;
        }
      }

      if (isImage && this.thumbnailDimensions) {
        const tfile = await this.resize(ofile || file, this.thumbnailDimensions);
        if (!tfile) {
          this.deleteFile(fileHolder);
          this.processFilesCounter--;
          continue;
        }
        fileHolder.thumbnail = {
          file: new File([tfile], file.name)
        }
        const thumbReader = new FileReader();
        thumbReader.addEventListener('loadend', async (event: any) => {
          fileHolder.thumbnail.src = event.target.result;
          fileHolder.thumbnail.size = await this.getImageDimensions(event.target.result);
        }, false);
        thumbReader.readAsDataURL(fileHolder.thumbnail.file);
      }

      const reader = new FileReader();
      reader.addEventListener('loadend', async (event: any) => {

        if (isImage) {
          fileHolder.size = await this.getImageDimensions(event.target.result);

          this.processFilesCounter--;

          if (!this.checkDimensions(fileHolder.size) || !fileHolder.size) {
            if (!dErr) {
              this.dialog.openAlertMessagesDialog('LBL_ERROR', this.dimensionMsg());
            }
            this.deleteFile(fileHolder);
            dErr = true;
            return;
          }

          if (file.type == 'image/jpeg') {
            window.URL.revokeObjectURL(event.target.result);
            fileHolder.src = await this.applyQuality(event.target.result);
          } else {
            fileHolder.src = event.target.result;
          }
        } else {
          this.processFilesCounter--;
          fileHolder.src = event.target.result;
        }

        fileHolder.file = file;
        fileHolder.uploaded = false;
        fileHolder.filesize = file.size;
        fileHolder.type = file.type;
        fileHolder.extension = this.imageService.getExtension(file.name).substr(1);
        this.changeFile.emit(fileHolder);
        if (this.autoUpload) {
          this.uploadSingleFile(fileHolder);
        }
      }, false);
      reader.readAsDataURL(ofile || file);
    }

    if (errors.length) {
      this.showErrors(errors);
    }
  }

  private showErrors(errors: Array<any>) {
    const msg = [];
    errors.forEach(x => {
      msg.push(`${x.file} => ${x.message}`);
    })
    this.dialog.openAlertMessagesDialog('LBL_ERROR', msg);
  }

  private uploadSingleFile(fileHolder: FileHolder) {
    this.pendingFilesCounter++;
    fileHolder.pending = true;
    this.uploadStateChanged.emit(true);
    this.uploadStarted.emit(fileHolder);
    this.imageService.uploadImage(fileHolder).subscribe(
      response => this.onResponse(response, fileHolder),
      error => this.onResponseError(error, fileHolder)
    );
  }

  waitForUploadFiles() {
    return this.files.filter(x => !x.uploaded && !x.pending && x.src);
  }

  waitForUploadFilesCount() {
    return this.waitForUploadFiles().length;
  }

  upload() {
    const files = this.waitForUploadFiles();
    if (!files.length) {
      this.uploadStateChanged.emit(false);
      return;
    }
    this.waitForUploadFiles().forEach(x => {
      this.uploadSingleFile(x);
    })
  }

  private uploadedFile(x: FileHolder): UploadedFile {
    let thumb = {};
    if (x.thumbnail) {
      thumb = {
        url: x.thumbnail.src,
        size: x.thumbnail.size
      }
    }
    return {
      url: x.src,
      filename: x.file.name,
      type: x.type,
      filesize: x.filesize,
      size: x.size,
      thumbnail: thumb,
      params: x.params,
      default: x.default,
      caption: x.caption
    } as UploadedFile
  }

  getFiles(): Array<UploadedFile> {
    return this.files.filter(x => x.uploaded).map(this.uploadedFile.bind(this));
  }

  getDeletedFiles(): Array<UploadedFile> {
    return this.deletedFiles.map(this.uploadedFile.bind(this));
  }

  flushDeletedFiles() {
    this.deletedFiles = [];
  }

  getNewFiles(): Array<UploadedFile> {
    return this.files.filter(x => !x.existing && x.uploaded).map(this.uploadedFile.bind(this));
  }

  setDefaultHolder(holder: FileHolder) {
    if (!holder.uploaded) return;
    this.files.map(x => { x.default = false });
    holder.default = true;
  }

  private onResponseError(response: any, fileHolder: FileHolder) {
    console.warn(response);
    fileHolder.pending = false;
    fileHolder.uploaded = false;
    this.uploadError.emit(fileHolder);
    this.deleteFile(fileHolder);
    if (--this.pendingFilesCounter === 0) {
      this.uploadStateChanged.emit(false);
    }
  }
}
