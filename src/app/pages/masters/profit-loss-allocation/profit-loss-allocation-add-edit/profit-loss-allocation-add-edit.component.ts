import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profit-loss-allocation-add-edit',
  templateUrl: './profit-loss-allocation-add-edit.component.html',
  styleUrls: ['./profit-loss-allocation-add-edit.component.scss']
})
export class ProfitLossAllocationAddEditComponent implements OnInit {
  PageTitle: string = 'Create Profit & Loss Allocation';
  buttonText: string = 'Add New Profit & Loss Allocation';
  constructor(
    private router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  BacktoList() {
    this.router.navigate(['/master/plallocation/list']);
  }


}
