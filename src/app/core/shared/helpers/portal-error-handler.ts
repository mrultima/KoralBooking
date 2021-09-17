import { Injectable, ErrorHandler } from '@angular/core';
import { LogService } from '../services/log.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PortalErrorHandler extends ErrorHandler {

  constructor(
    private logService: LogService,
  ) {
    super();
  }

  handleError(error: any): void {
    if (!this.logService) {
      alert('logService is undefined');
    }
    let data;
    let msg;
    if (error instanceof HttpErrorResponse) {
      data = error;
      msg = error.message;
    } else if (error instanceof Error) {
      data = error.stack;
      msg = error.message;
    } else {
      this.logService.log(error, 'handle error not expecting this', 'error');
    }
    this.logService.log(data, msg, 'error');

    super.handleError(error);
  }
}
