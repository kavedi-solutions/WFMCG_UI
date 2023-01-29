import { Direction } from "@angular/cdk/bidi";

export interface AppSettings {
  navPos: string;
  theme: string;
  dir: Direction;
  showHeader: boolean;
  headerPos: 'fixed' | 'static' | 'above';
  showUserPanel: boolean;
  sidenavOpened: boolean;
  sidenavCollapsed: boolean;
  language: string;
}

export const defaults: AppSettings = {
  navPos: 'side',
  theme: 'light',
  dir: 'ltr',
  showHeader: true,
  headerPos: 'fixed',
  showUserPanel: true,
  sidenavOpened: true,
  sidenavCollapsed: true,
  language: 'en-US',
};
