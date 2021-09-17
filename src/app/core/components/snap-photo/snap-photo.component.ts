import { Component, OnInit, Optional, ElementRef, AfterViewInit, ViewChild, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Subject, BehaviorSubject, MonoTypeOperatorFunction, Observable } from "rxjs";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { filter, first, skip, delay } from "rxjs/operators";
import { TranslateService } from '../../shared';

@Component({
  selector: 'ta-core-snap-photo',
  templateUrl: './snap-photo.component.html',
  styleUrls: ['./snap-photo.component.scss']
})

export class SnapPhotoComponent implements OnInit, AfterViewInit, OnDestroy {

  videoEl$ = new BehaviorSubject<HTMLVideoElement>(null);

  videoInputs: MediaDeviceInfo[] = null;

  device: MediaDeviceInfo = null;

  @ViewChild('videoElm') set _v(v: ElementRef) {
      this.videoEl$.next(v ? v.nativeElement : null);
  }

  canvasEl: HTMLCanvasElement;
  @ViewChild('canvasElm', { read: ElementRef }) set _c(c: ElementRef) {
      this.canvasEl = c.nativeElement;
  }

  get videoEl(): HTMLVideoElement { return this.videoEl$.getValue(); }

  state$ = new Subject<'idle' | 'stream' | 'confirm' | 'error'>();

  isDialog = false;

  dataURI: string = null;

  @Output() screenshot = new EventEmitter<string>();

  constructor(
      @Optional() public matDialogRef: MatDialogRef<any>,
      private angDialog: MatDialog,
      public translate: TranslateService,

  ) {
      this.isDialog = !!matDialogRef;
  }

  ngOnDestroy() {
      this.stopStream();
  }

  wait<T>(): MonoTypeOperatorFunction<T> {
      return (o$: Observable<any>) => o$.pipe(skip(1), filter(x => !!x), first(), delay(10));
  }

  changeDevice(dev: MediaDeviceInfo) {
      if (this.device === dev) {
          return;
      }
      this.stopStream();
      this.device = dev;
      this.state$.next('idle');
  }

  async startStream() {

      if (!navigator.mediaDevices) {
          setTimeout(() => {
              this.state$.next('error');
          }, 1e3);
          return;
      }

      if (this.videoInputs === null) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          this.videoInputs = devices.filter(x => x.kind === 'videoinput');
      }

      if (!this.videoInputs || this.videoInputs.length === 0) {
          this.state$.next('error');
          return;
      }

      if (!this.device) {
          this.device = this.videoInputs[0];
      }

      navigator.mediaDevices.getUserMedia({
          video: {
              deviceId: this.device.deviceId
          },
          audio: false
      })
          .then((stream: MediaStream) => {
              this.videoEl$.asObservable().pipe(this.wait()).subscribe(player => {
                  player.srcObject = stream;
                  player.setAttribute('playsinline', 'true');
                  player.play();
              });
              this.state$.next('stream');
          })
          .catch(err => {
              this.state$.next('error');
              this.angDialog.open(err);
          });
  }

  stopStream() {
      if (!this.videoEl) {
          return;
      }
      try {
          (<MediaStream>this.videoEl.srcObject)
              .getVideoTracks().
              forEach((t: MediaStreamTrack) => {
                  t.stop()
              });
          this.videoEl.pause();
          this.videoEl.srcObject = undefined;
      } catch (e) {
          console.warn(e);
      }
  }

  ngAfterViewInit() {
      setTimeout(() => {
          this.state$.next('idle');
      }, 50);
  }

  ngOnInit() {
      this.state$.subscribe(state => {
          if (state == 'idle') {
              this.startStream();
          }

          if (state != 'confirm') {
              this.dataURI = null;
          }
      })
  }

  submit() {
      if (!this.videoEl) {
          this.state$.next('idle');
          return;
      }
      if (this.videoEl.readyState < 2) {
          setTimeout(() => {
              this.submit();
          }, 50);
          return;
      }
      const [width, height] = [this.videoEl.videoWidth, this.videoEl.videoHeight];
      this.canvasEl.width = width;
      this.canvasEl.height = height;
      const ctx = this.canvasEl.getContext('2d');
      ctx.drawImage(this.videoEl, 0, 0, width, height);
      this.dataURI = this.canvasEl.toDataURL('image/jpeg');
      this.stopStream();
      this.state$.next('confirm');
  }

  confirm(status: boolean) {
      if (!status) {
          this.state$.next('idle');
          return;
      }
      this.screenshot.next(this.dataURI);
      if (this.isDialog) {
          this.matDialogRef.close(this.dataURI);
          return;
      }
      this.state$.next('idle');
  }
}
