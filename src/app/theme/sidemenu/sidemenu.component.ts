import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as fromService from '../../shared/index';
import { MenuResponse } from '../../shared/index';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent implements OnInit {
  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = false;
  menu: MenuResponse[] = [];

  constructor(private authService: fromService.AuthService) {
    this.GetMenus();
  }

  ngOnInit(): void {}

  GetMenus() {
    this.authService.GetMenu().subscribe((response) => {
      this.menu = response;
    });
  }
}
