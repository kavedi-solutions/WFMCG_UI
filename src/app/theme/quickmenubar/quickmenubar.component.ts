import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-quickmenubar',
  templateUrl: './quickmenubar.component.html',
  styleUrls: ['./quickmenubar.component.scss'],
})
export class QuickmenubarComponent implements OnInit {
  @Input() showToggle = true;
  @Input() showHeader = true;
  @Input() ripple = false;
  QuickmenuList: any[] = [];

  constructor() {
    this.FillQuickMenuItems();
  }

  ngOnInit(): void {}

  FillQuickMenuItems() {
    this.QuickmenuList.push({
      route: 'dashboard',
      name: 'Dashboard',
      type: 'link',
      icon: 'dashboard',
    });
    this.QuickmenuList.push({
      route: 'dashboard',
      name: 'Sales Invoice',
      type: 'link',
      icon: 'dashboard',
    });
    this.QuickmenuList.push({
      route: 'dashboard',
      name: 'Service Invoice',
      type: 'link',
      icon: 'dashboard',
    });
    this.QuickmenuList.push({
      route: 'dashboard',
      name: 'Receipt Voucher',
      type: 'link',
      icon: 'dashboard',
    });
  }
}
