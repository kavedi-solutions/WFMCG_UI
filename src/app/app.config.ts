import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';

export class ApplicationConfig {
  APIURL?: string;
  SiteURL?: string;
}

export let APP_CONFIG = new InjectionToken<ApplicationConfig>('APP_CONFIG');

@Injectable()
export class AppConfig {
  config?: [];

  constructor(
    @Inject(APP_CONFIG) private appconfig: ApplicationConfig,
  ) {}

  /** Value of Settings.json */

  public GetCoreAPIURL() {
    return this.appconfig.APIURL;
  }

  public GetSiteURL() {
    return this.appconfig.SiteURL;
  }

  /** Value of Settings.json */
}
