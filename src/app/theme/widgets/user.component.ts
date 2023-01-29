import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import * as fromService from '../../shared/index';

@Component({
  selector: 'app-user',
  template: `
    <button
      class="matero-toolbar-button matero-avatar-button"
      mat-button
      [matMenuTriggerFor]="menu"
    >
      <!-- <img class="matero-avatar" [src]="user.avatar" width="32" alt="avatar" /> -->
      <span class="matero-username" fxHide.lt-sm>Jigar</span>
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/overview" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>Profile</span>
      </button>
      <button routerLink="/profile/settings" mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
})
export class UserComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: fromService.AuthService,
    private cdr: ChangeDetectorRef,
    private sstorage: fromService.LocalStorageService
  ) {}

  ngOnInit(): void {
    // this.auth
    //   .user()
    //   .pipe(
    //     tap(user => (this.user = user)),
    //     debounceTime(10)
    //   )
    //   .subscribe(() => this.cdr.detectChanges());
  }

  logout() {
    this.sstorage.clear();
    this.router.navigate(['/auth/login']);
    //this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
  }
}
