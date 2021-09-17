import { AfterViewInit, Component, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-barcode-reader',
  templateUrl: './barcode-reader.component.html',
  styleUrls: ['./barcode-reader.component.scss']
})
export class BarcodeReaderComponent implements OnInit, AfterViewInit, OnDestroy {

  Quagga: any;

  @Output() code = new EventEmitter();

  constructor(
    @Optional() public matDialogRef: MatDialogRef<BarcodeReaderComponent>
  ) { }

  async ngAfterViewInit(): Promise<void> {
    this.Quagga = await import('quagga').then(x => x.default);

    this.Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        facingMode: "environment",
        target: document.querySelector('#quaggaEl'),
        width: Math.max(Math.min(screen.width - 10, 640), 320),
        height: screen.height-100,
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
          "i2of5_reader",
          "2of5_reader",
          "code_93_reader"]
      }
    }, (err) => {
      if (err) {
        console.log(err);
        return
      }
      this.Quagga.start();
      this.Quagga.onDetected(resp => {
        if (resp?.codeResult?.code) {
          this.code.emit(resp.codeResult.code);
          this.matDialogRef?.close(resp.codeResult.code);
        }
      })
    });
  }

  async ngOnInit(): Promise<void> {

  }

  ngOnDestroy(): void {
    this.Quagga?.stop();
  }

}
