export interface BackupLocationResponse {
  backupFullPath: string;
  backupPath: string;
  backupFolder: string;
  backupZipFileName: string;
  pastBackups: PastBackupDetails[];
}
export interface PastBackupDetails {
  autoID: number;
  backupDate: string;
  backupFileName: string;
  backupLocation: string;
  backupStatus: boolean;
  zipStatus: boolean;
}
