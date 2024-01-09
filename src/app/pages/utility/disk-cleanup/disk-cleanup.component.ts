import { Component, OnInit } from '@angular/core';
import * as fromService from '../../../shared/index';

@Component({
  selector: 'app-disk-cleanup',
  templateUrl: './disk-cleanup.component.html',
  styleUrls: ['./disk-cleanup.component.scss'],
})
export class DiskCleanupComponent implements OnInit {
  PageTitle: string = 'Disk Cleanup Process';
  ShowStatus: boolean = false;
  constructor(private utilityService: fromService.UtilityService) {}

  ngOnInit(): void {}

  DiskCleanup() {
    this.utilityService.DiskCleanUp().subscribe((response) => {
      if (response == true) {
        this.ShowStatus = true;
      }
    });
  }
}
