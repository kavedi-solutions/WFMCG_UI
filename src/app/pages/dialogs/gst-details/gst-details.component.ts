import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GstDetails } from 'src/app/shared';

@Component({
  selector: 'app-gst-details',
  templateUrl: './gst-details.component.html',
  styleUrls: ['./gst-details.component.scss'],
})
export class GstDetailsComponent implements OnInit {
  DialogTitle: string = '';
  DataResponse?: GstDetails;

  constructor(public dialogRef: MatDialogRef<GstDetailsComponent>) {}

  ngOnInit(): void {}

  onClickClose() {
    this.dialogRef.close();
  }
}
