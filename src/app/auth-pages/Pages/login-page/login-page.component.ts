import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loginResponse } from 'src/app/shared';
import * as fromService from '../../../shared/index';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  isSubmitting: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  //
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: fromService.AuthService,
    private sstorage: fromService.LocalStorageService
  ) {}

  ngOnInit(): void {}

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  login() {
    this.hasError = false;
    this.isSubmitting = true;
    this.authService
      .Login(this.username.value, this.password.value)
      .subscribe((response) => {
        if (response.isSuccess == true) {
          this.sstorage.clear();
          this.sstorage.set('companyID', response.companyID);
          this.sstorage.set('userID', response.userID);
          this.sstorage.set('userName', response.userName);
          this.sstorage.set('firstName', response.firstName);
          this.sstorage.set('lastName', response.lastName);
          this.sstorage.set('isCompanyOwner', response.isCompanyOwner);
          this.sstorage.set('jwtToken', response.jwtToken);
          this.sstorage.set('CompanyStateID', response.stateID);
          this.sstorage.set('FinYearStartMonth', response.finYearStartMonth);
          this.sstorage.set('ManageBilltoBill', response.manageBilltoBill);
          this.sstorage.set('SpoiledReturnDays', response.spoiledReturnDays);
          this.sstorage.set('GoodsReturnDays', response.goodsReturnDays);
          this.router.navigate(['/dashboard']);
        } else {
          this.hasError = true;
          this.errorMessage = response.returnMessage;
        }
      });
  }
}
