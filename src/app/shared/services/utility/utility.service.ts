import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { BackupLocationFilter, BackupLocationResponse } from '../../models';
import { LocalStorageService } from '../common/storage.service';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  APIURL?: string = '';
  version: string = '1';
  CompanyID: string = this.storage.get('companyID');
  UserID: string = this.storage.get('userID');

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private appconfig: AppConfig
  ) {
    this.APIURL = this.appconfig.GetCoreAPIURL() + `api/v${this.version}`;
  }

  GetBackupLocation(): Observable<BackupLocationResponse> {
    const url = `${this.APIURL}/utility/getbackuplocation`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  TakeBackupDatabase(filter: BackupLocationFilter): Observable<boolean> {
    let params = new HttpParams()
    .set('BackupFullPath', `${filter.backupFullPath}`)
    .set('BackupPath', `${filter.backupPath}`)
    .set('BackupFolder', `${filter.backupFolder}`)
    .set('BackupZipFileName', `${filter.backupZipFileName}`);

    const url = `${this.APIURL}/utility/backupdatabase`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }

  DiskCleanUp(): Observable<boolean>
  {
    const url = `${this.APIURL}/company/${this.CompanyID}/utility/diskcleanup`;
    return this.http
      .get<any>(encodeURI(url), {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}
