import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  private count = 0;

  constructor(private spinnerService: SpinnerService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.count === 0) {
      this.spinnerService.setHttpProgressStatus(true);
    }
    this.count++;
    return next.handle(req).pipe(
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          this.spinnerService.setHttpProgressStatus(false);
        }
      })
    );
  }
}
