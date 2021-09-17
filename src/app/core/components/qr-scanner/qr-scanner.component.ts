import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, Optional, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ang-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit, OnDestroy, OnChanges {

  @Output() qrCodeCapture = new EventEmitter<string>();
  @ViewChild('scanCanvas', { static: true }) scanCanvas: ElementRef;
  @Input() class: string;
  @Input() width: string;
  @Input() height: string;

  canvasElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  video: HTMLVideoElement;
  detectedQrCode: string;

  constructor(
    @Optional() public matDialogRef: MatDialogRef<any>
  ) { }

  ngOnChanges(s: SimpleChanges) {
    if (s.width) {
      if (this.canvasElement) {
        this.canvasElement.setAttribute('width', s.width.currentValue);
      }
      if (this.video) {
        this.video.setAttribute('width', s.width.currentValue);
      }
    }
    if (s.height) {
      if (this.canvasElement) {
        this.canvasElement.setAttribute('height', s.height.currentValue);
      }
      if (this.video) {
        this.video.setAttribute('height', s.height.currentValue);
      }
    }
  }

  jsQR: any;
  async ngOnInit() {
    this.jsQR = await import('jsqr').then(x => x.default);
    this.canvasElement = <HTMLCanvasElement>this.scanCanvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.canvasElement.style.width = '100%';
    this.canvasElement.style.height = '100%';
    this.canvasElement.width = this.canvasElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.offsetHeight;

    this.video = <HTMLVideoElement>document.createElement('video');
    this.video.style.width = '100%';
    this.video.style.height = '100%';
    this.video.width = this.canvasElement.width;
    this.video.height = this.canvasElement.height;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(async (stream: MediaStream) => {
      this.video.srcObject = stream;
      this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
      await this.video.play();
      requestAnimationFrame(this.tick.bind(this));
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  drawLine(begin, end, color): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(begin.x, begin.y);
    this.canvasContext.lineTo(end.x, end.y);
    this.canvasContext.lineWidth = 4;
    this.canvasContext.strokeStyle = color;
    this.canvasContext.stroke();
  }

  tick(): void {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvasElement.hidden = false;

      this.canvasElement.height = this.video.videoHeight;
      this.canvasElement.width = this.video.videoWidth;
      this.canvasContext.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData: ImageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
      const code: any = this.jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        this.drawLine(code.location.topLeftCorner, code.location.topRightCorner, 'rgba(255,59,88,0.5)');
        this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, 'rgba(255,59,88,0.5)');
        this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, 'rgba(255,59,88,0.5)');
        this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, 'rgba(255,59,88,0.51)');
        this.detectedQrCode = code.data;
        this.afterCapture();
      } else {
        requestAnimationFrame(this.tick.bind(this));
      }
    }
  }

  afterCapture() {
    this.stopCamera();
    this.qrCodeCapture.emit(this.detectedQrCode);
    if (this.matDialogRef) {
      this.matDialogRef.close(this.detectedQrCode);
    }
  }

  stopCamera() {
    try {
      (this.video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      this.video.pause();
    } catch (e) {
      console.warn(e);
    }
  }
}
