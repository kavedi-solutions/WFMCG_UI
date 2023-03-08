import { Directionality } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import * as fromService from '../../shared/index';

const MOBILE_MEDIAQUERY = 'screen and (max-width: 599px)';
const TABLET_MEDIAQUERY =
  'screen and (min-width: 600px) and (max-width: 959px)';
const MONITOR_MEDIAQUERY = 'screen and (min-width: 960px)';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('quickmenusidenav', { static: true }) sidenav!: MatSidenav;
  @ViewChild('sidenavMenu', { static: true }) sidenavmenu!: MatSidenav;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;

  options = this.settings.getOptions();

  private isContentWidthFixed = false;
  private isCollapsedWidthFixed = false;
  private isMobileScreen = false;
  private layoutChangesSubscription: Subscription;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  @HostBinding('class.matero-content-width-fix') get contentWidthFix() {
    return (
      this.isContentWidthFixed &&
      this.options.navPos === 'side' &&
      this.options.sidenavOpened &&
      !this.isOver
    );
  }

  @HostBinding('class.matero-sidenav-collapsed-fix') get collapsedWidthFix() {
    return (
      this.isCollapsedWidthFixed &&
      (this.options.navPos === 'top' ||
        (this.options.sidenavOpened && this.isOver))
    );
  }

  constructor(
    private sstorage: fromService.LocalStorageService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private settings: fromService.SettingsService,
    @Optional() @Inject(DOCUMENT) private document: Document,
    @Inject(Directionality) public dir: fromService.AppDirectionality
  ) {
    this.dir.value = this.options.dir!;
    this.document.body.dir = this.dir.value;

    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_MEDIAQUERY, TABLET_MEDIAQUERY, MONITOR_MEDIAQUERY])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;

        this.isMobileScreen = state.breakpoints[MOBILE_MEDIAQUERY];
        this.options.sidenavCollapsed = state.breakpoints[TABLET_MEDIAQUERY];
        this.isContentWidthFixed = state.breakpoints[MONITOR_MEDIAQUERY];
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        if (this.isOver) {
          this.sidenav.close();
        }
        this.sidenavmenu.close();

        this.content.scrollTo({ top: 0 });
      });
    this.options.sidenavCollapsed = true;
    this.resetCollapsedState();
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    //this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.options.sidenavCollapsed = true;
    this.resetCollapsedState();
  }

  // TODO: Trigger when transition end
  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }
}
