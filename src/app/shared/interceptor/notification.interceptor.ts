import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NotificationComponent } from '../components/notification/notification.component';
import { LocalStorageService } from '../services';
import { Router } from '@angular/router';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  constructor(
    public notification: NotificationComponent,
    private storage: LocalStorageService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.storage.has('jwtToken')) {
      const req = request.clone({
        headers: request.headers.set(
          'Authorization',
          `Bearer ${this.storage.get('jwtToken')}`
        ),
      });
      request = req;
    }

    return next.handle(request).pipe(
      retry(1),
      tap(
        (event) => {
          if (event instanceof HttpResponse && event.status !== 200) {
            const message = this.getSuccessMessage(event);
            this.notification.openSnackBar(message, 'Close', 'green-snackbar');
          }
        },
        (error) => {
          if (error.status === 401) {
            this.notification.openSnackBar(
              'Session expired',
              'Ok',
              'red-snackbar'
            );
            this.handleAuthError();
            return of(error);
          } else {
            const message = this.getErrorMessage(error);
            this.notification.openSnackBar(message, 'Ok', 'red-snackbar');
            error.message = message;
            return of(error);
          }
        }
      )
    );
  }

  getSuccessMessage(event: HttpResponse<any>) {
    if (event.status === 201) {
      return 'Created Successfully';
    } else if (event.status === 204) {
      return 'Updated Successfully';
    } else if (event.status === 202) {
      return 'Delete Successfully';
    }
    return '';
  }
  getErrorMessage(error: HttpErrorResponse) {
    const customErrorMessage =
      'An error has occurred. Please contact your system administrator.';
    if (error.status !== 405 && error.error) {
      return error.error.error ? error.error.error : customErrorMessage;
    }
    return customErrorMessage;
  }

  private handleAuthError() {
    this.storage.remove('jwtToken');
    this.router.parseUrl('/auth/login');
  }
}
