import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss'],
})
export class CommonDialogComponent implements OnInit {
  DialogTitle: string = '';
  DialogContent: string = '';
  constructor(public dialogRef: MatDialogRef<CommonDialogComponent>) {}

  ngOnInit(): void {}

  onClickClose() {
    this.dialogRef.close();
  }
}
