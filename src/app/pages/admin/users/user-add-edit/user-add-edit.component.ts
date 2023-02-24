import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss'],
})
export class UserAddEditComponent implements OnInit {
  PageTitle: string = 'Create User';
  buttonText: string = 'Add New User';
  constructor(private router: Router) {}

  ngOnInit(): void {}

  BacktoList() {
    this.router.navigate(['/admin/user/list']);
  }
}
