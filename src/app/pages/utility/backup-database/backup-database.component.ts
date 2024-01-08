import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from 'src/app/extensions/grid/grid.interface';
import * as defaultData from '../../../data/index';
import * as fromService from '../../../shared/index';
import {
  BackupLocationResponse,
  BackupLocationFilter,
} from '../../../shared/index';

@Component({
  selector: 'app-backup-database',
  templateUrl: './backup-database.component.html',
  styleUrls: ['./backup-database.component.scss'],
})
export class BackupDatabaseComponent implements OnInit {
  PageTitle: string = 'Backup Database';
  backupLocation!: BackupLocationResponse;
  columns: MtxGridColumn[] = [];
  ShowTakeBackup: boolean = true;

  constructor(private utilityService: fromService.UtilityService) {
    this.backupLocation = {
      backupFullPath: '',
      backupPath: '',
      backupZipFileName: '',
      backupFolder: '',
      pastBackups: [],
    };
    this.columns = defaultData.GetBackupDBColumns();
    this.GetBackupLocation();
  }

  ngOnInit(): void {}

  GetBackupLocation() {
    this.utilityService.GetBackupLocation().subscribe((response) => {
      this.backupLocation = response;
    });
  }

  TakeDatabaseBackup() {
    let filter: BackupLocationFilter = {
      backupFolder: this.backupLocation?.backupFolder!,
      backupFullPath: this.backupLocation?.backupFullPath!,
      backupPath: this.backupLocation?.backupPath!,
      backupZipFileName: this.backupLocation?.backupZipFileName!,
    };

    this.utilityService.TakeBackupDatabase(filter).subscribe((response) => {
      debugger;
      if (response == true) {
        this.ShowTakeBackup = false;
        this.GetBackupLocation();
      }
    });
  }
}
