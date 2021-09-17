import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { HotelService } from '@travelaps/hotel/shared';


export interface LightBoxComponentData {
  images: Array<any>;
  resize: boolean;
  index: number;
  mode: string;
}

@Component({
  selector: 'ta-core-light-box',
  templateUrl: './light-box.component.html',
  styleUrls: ['./light-box.component.scss']
})

export class LightBoxComponent implements OnInit {
  _mode: string;
  _resize = true;
  bigImageUrl: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  ltsm: boolean;
  ltmd: boolean;
  lastClickedButton: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  constructor(
    public dialogRef: MatDialogRef<LightBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LightBoxComponentData,
    private breakpointObserver: BreakpointObserver,
    private hotelService: HotelService
  ) {
    this.breakpointObserver.observe(['(max-width: 599px)', '(max-width: 959px)']).subscribe(value => {
      this.ltsm = value.breakpoints['(max-width: 599px)'];
      this.ltmd = value.breakpoints['(max-width: 959px)'];
    });
  }

  ngOnInit() {
    this._mode = this.data.mode;
    this.bigImageUrl.next(this.data.images[this.data.index].URL);
    this._resize = this.data.resize != null ? this.data.resize : true;
  }

  updatePanelSize(img: HTMLImageElement) {
    setTimeout(() => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        if (this._resize) {
          const currentImageWidth = img.naturalWidth.toString() + 'px';
          const currentImageHeight = img.naturalHeight.toString() + 'px';
          this.dialogRef.updateSize(currentImageWidth, currentImageHeight);

          if (img.naturalWidth < 600 && (!this.ltmd && !this.ltsm)) {
            this.dialogRef.updateSize('600px', '400px');
          }
        }
      } else {
        this.dialogRef.close();
      }
    }, 0);
  }

  onCloseButton(): void {
    this.dialogRef.close();
  }

  prevImage(): void {
    this.lastClickedButton.next('prev');
    if (this.data.index === 0) {
      this.data.index = this.data.images.length - 1;
    } else {
      this.data.index -= 1;
    }

    this.bigImageUrl.next(this.data.images[this.data.index].URL);
  }

  async nextImage() {
    this.lastClickedButton.next('next');
    if (this.data.index >= this.data.images.length - 1) {
      if (this._mode === 'Hotel') {
        await this.onGoImage(this.data.index);
        if (this.data.index >= this.data.images.length - 1) {
          this.data.index = 0;
        } else {
          this.data.index += 1;
        }
      } else {
        this.data.index = 0;
      }
    } else {
      this.data.index += 1;
    }

    this.bigImageUrl.next(this.data.images[this.data.index].URL);
  }

  async onGoImage(index: number) {
    const mod = Math.floor(index / 9); // TalepNo : 318597  neden böyle bir hesaplamaya ihtiyaç duyulmuş anlayamadım sadede düzeltme
    if (mod > 0) {
      let htImag = this.data.images;
      const page = 1 + parseInt((index / 9).toString());
      const image = await this.hotelService.getHotelImage(this.hotelService.selectedHotelConfig.getValue(), page);
      if (image && image.length > 0) {
        const ekMap = image.map(x => {
          return {URL: x.URL};
        });
        htImag = htImag.concat(ekMap);
        this.data.images = htImag;
      }
    }
  }

  onImageError() {
    if (this.lastClickedButton.getValue()) {
      if (this.lastClickedButton.getValue() === 'next') {
        this.nextImage();
      }

      if (this.lastClickedButton.getValue() === 'prev') {
        this.prevImage();
      }
    } else {
      this.nextImage();
    }
  }
}
