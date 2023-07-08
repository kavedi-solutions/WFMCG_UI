import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: action === 'Close' ? 2000 : undefined,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [className],
    });
  }

  openStockErrorBar(message: string, action: string, className: string) {
    this.snackBar.open(message, "ok", {
      duration: 1500,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [className],
    });
  }

}
