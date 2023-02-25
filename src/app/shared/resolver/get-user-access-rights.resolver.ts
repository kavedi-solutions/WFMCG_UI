import { Injectable } from '@angular/core';
import * as fromService from '../services/index';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AccessRights } from '../models';

@Injectable({
  providedIn: 'root',
})
export class GetUserAccessRightsResolver implements Resolve<AccessRights> {
  constructor(private authService: fromService.AuthService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<AccessRights> {
    let MenuID: string = route.data['MenuID'];
    return of(this.authService.getUserAccessRights(MenuID));
  }
}
