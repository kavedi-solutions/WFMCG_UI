import {
  Component,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
//import screenfull from 'screenfull';

import * as fromService from '../../shared/index';

@Component({
  selector: 'app-header',
  host: {
    class: 'matero-header',
  },
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  CompanyName: string = '';

  constructor(private sstorage: fromService.LocalStorageService) {
    this.CompanyName = this.sstorage.get("CompanyName");
  }

  @Input() showToggle = true;
  @Input() showBranding = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  // toggleFullscreen() {
  //   if (screenfull.isEnabled) {
  //     screenfull.toggle();
  //   }
  // }
}
