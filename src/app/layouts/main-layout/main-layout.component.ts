import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fromService from '../../shared/index';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  constructor(
    private sstorage: fromService.LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logOut() {
    this.sstorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
