import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  DialogTitle: string = 'Confirm';
  DialogMessage1: string = '';
  DialogMessage2: string = '';
  DialogMessage3: string = '';
  DialogMessage4: string = '';
  DialogMessage5: string = '';
  DialogType: number = 1;

  //1 - Confirm
  //2 - Information
  //3 - Alert

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  _onYesClick() {}
  _onNoClick() {}
  _onOkClick() {}
}
