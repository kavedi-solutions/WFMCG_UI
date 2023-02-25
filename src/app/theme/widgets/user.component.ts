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
      <span class="matero-username" fxHide.lt-sm>{{userName}}</span>
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
  userName: string = '';
  constructor(
    private router: Router,
    private auth: fromService.AuthService,
    private cdr: ChangeDetectorRef,
    private sstorage: fromService.LocalStorageService
  ) {}

  ngOnInit(): void {
    this.userName = this.sstorage.get("firstName");
  }

  logout() {
    this.sstorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
