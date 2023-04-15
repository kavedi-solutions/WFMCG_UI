import { Component, Input, OnInit } from '@angular/core';
import * as fromService from '../../shared/index';
import { QuickMenuResponse } from '../../shared/index';

@Component({
  selector: 'app-quickmenubar',
  templateUrl: './quickmenubar.component.html',
  styleUrls: ['./quickmenubar.component.scss'],
})
export class QuickmenubarComponent implements OnInit {
  @Input() showToggle = true;
  @Input() showHeader = true;
  @Input() ripple = false;
  QuickmenuList: QuickMenuResponse[] = [];

  constructor(private authService: fromService.AuthService) {
    this.FillQuickMenuItems();
  }

  ngOnInit(): void {}

  FillQuickMenuItems() {
    this.authService.GetQuickMenu().subscribe((response) => {
      this.QuickmenuList.push({
        quickmenuroute: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'fa-solid fa-chart-line',
      });

      response.forEach((element: QuickMenuResponse) => {
        this.QuickmenuList.push(element);
      });
    });
  }
}
