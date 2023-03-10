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
  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['jigar2284.patel@gmail.com', [Validators.required]],
    password: ['Kavedi@1116', [Validators.required]],
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
    this.isSubmitting = true;

    this.authService
      .Login(this.username.value, this.password.value)
      .subscribe((response: loginResponse) => {
        if (response.isSuccess == true) {
          this.sstorage.clear();
          this.sstorage.set('companyID', response.companyID);
          this.sstorage.set('userID', response.userID);
          this.sstorage.set('userName', response.userName);
          this.sstorage.set('firstName', response.firstName);
          this.sstorage.set('lastName', response.lastName);
          this.sstorage.set('isCompanyOwner', response.isCompanyOwner);
          this.sstorage.set('jwtToken', response.jwtToken);

          this.router.navigate(['/dashboard']);
        }
      });
  }
}
