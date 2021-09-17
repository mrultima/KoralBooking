import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AgreementDialogComponent } from './agreement-dialog/agreement-dialog.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { HtmlDialogComponent } from './html-dialog/html-dialog.component';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { ConfirmationDialogComponent, ConfirmationDialogComponentData } from './confirmation-dialog/confirmation-dialog.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { timer, Subject } from 'rxjs';
import * as _ from 'lodash';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '../services/translate.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  isMobile: boolean;

  constructor(private dialog: MatDialog, private overlay: Overlay, private matSnackbar: MatSnackBar,
    public breakpointObserver: BreakpointObserver, private translateService: TranslateService) {
    breakpointObserver.observe('(max-width: 959px)').subscribe(value => {
      this.isMobile = value.matches;
    }
    );
  }

  loadingRef: OverlayRef;
  lodingRefList: any[] = [];

  openAgreement(contentInfo: string) {
    this.dialog.open(AgreementDialogComponent, {
      maxWidth: '90%',
      maxHeight: '90%',
      data: {
        content: contentInfo
      }
    });
  }

  openShowErrors(errors: Array<any>) {
    const dialogRef = this.dialog.open(ShowErrorsComponent, {
      maxWidth: '50%',
      maxHeight: '50%',
      data: errors
    });
    return dialogRef;
  }

  openAlertMessagesDialog(type, msg, desc?: string) {
    // type: info, error, warn
    const dialogRef = this.dialog.open(AlertMessagesComponent, {
      maxWidth: '50%',
      maxHeight: '50%',
      data: {
        type: type,
        message: msg,
        description: desc
      }
    });
    return dialogRef;
  }

  openPopUpBanner(content) {
    const dialogRef = this.dialog.open(HtmlDialogComponent, {
      minWidth: '300px',
      minHeight: '200px',
      maxHeight: '95vh',
      // Kemal bey dışarı tıklandığında kapansın istemiş. disableClose: true, //
      panelClass: 'dialog-without-paddingAndOverflow'
    });
    dialogRef.componentInstance.html(content);
    return dialogRef;
  }

  openHtml(content, options?: Partial<MatDialogConfig>) {
    let config: Partial<MatDialogConfig> = {
      minWidth: '300px',
      // minHeight: '200px',
      maxHeight: '95vh'
    };
    /* if (_.get(options, 'maxWidth')) {
      config['maxWidth'] = options.maxWidth;
    } */
    if (options) {
      config = { ...config, ...options }
    }
    const dialogRef = this.dialog.open(HtmlDialogComponent, config);
    dialogRef.componentInstance.html(content);
    return dialogRef;
  }

  openCCfromHtml(content) {
    const dialogRef = this.dialog.open(HtmlDialogComponent, {
      minWidth: '300px',
      minHeight: '200px',
      disableClose: true
    });
    dialogRef.componentInstance.openCC(content);
  }

  async openFullscreenLoading(msg: string = 'notDefined', cancelSubject?: Subject<void>): Promise<OverlayRef> {
    await timer(100).toPromise();
    if (this.lodingRefList.length > 1) {
      this.lodingRefList.slice(0, this.lodingRefList.length - 1).forEach(x => {
        x.detach();
      });
      this.lodingRefList = [this.lodingRefList[this.lodingRefList.length - 1]];
    }
    this.loadingRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      panelClass: msg
    });
    const loadingPortal = new ComponentPortal<LoadingOverlayComponent>(LoadingOverlayComponent);
    const compRef = this.loadingRef.attach(loadingPortal);
    if (cancelSubject) {
      compRef.instance.cancel = cancelSubject;
      const s = cancelSubject.subscribe(() => {
        s.unsubscribe();
        this.loadingRef.detach();
      });
    }
    this.lodingRefList.push(this.loadingRef);
    return this.loadingRef;
  }

  openConfirmationDialog(config?: ConfirmationDialogComponentData) {
    return this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: this.isMobile ? '100%' : '50%',
      maxHeight: this.isMobile ? '80%' : '50%',
      data: config
    });
  }

  snackbar(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {
    return this.matSnackbar.open(this.translateService.transform(message), this.translateService.transform(action), config);
  }

}
