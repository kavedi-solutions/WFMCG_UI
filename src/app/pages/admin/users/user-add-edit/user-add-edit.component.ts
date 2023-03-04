import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import * as fromService from '../../../../shared/index';
import {
  roleDownDownResponse,
  stateDownDownResponse,
  User,
  UserPostRequest,
  UserPutRequest,
} from '../../../../shared/index';

@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss'],
})
export class UserAddEditComponent implements OnInit {
  PageTitle: string = 'Create User';
  buttonText: string = 'Add New User';
  RoleDownDown: roleDownDownResponse[];
  StateDropDown: stateDownDownResponse[];
  isEditMode: boolean = false;
  selectedUserId: string;
  editUser?: User;
  UserNameExists: Subject<any> = new Subject();
  UserName: string = '';
  isUserNameValid: boolean = false;
  isReadonly: boolean = true;
  userPostRequest?: UserPostRequest;
  userPutRequest?: UserPutRequest;
  userForm = this.fb.group({
    firstName: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    userName: ['', [Validators.required, Validators.email]],
    email: [''],
    password: [''],
    roleID: ['', [Validators.required]],
    isActive: true,
    address: ['', [Validators.pattern('[A-Za-z0-9,.,#@%&/\\- ]*')]],
    city: ['', [Validators.pattern('[A-Za-z0-9 ]*')]],
    stateID: [''],
    pinCode: ['', [Validators.pattern('[0-9]*')]],
    mobile_Work: [
      '',
      [
        Validators.required,
        Validators.pattern('^([0-9()/+ -]*)$'),
        Validators.minLength(10),
        Validators.maxLength(15),
      ],
    ],
    mobile_Personal: [
      '',
      [Validators.pattern('^([0-9()/+ -]*)$'), Validators.maxLength(15)],
    ],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private roleService: fromService.RoleService,
    private commonService: fromService.CommonService,
    private userService: fromService.UserService,
    private fb: FormBuilder
  ) {
    this.RoleDownDown = [];
    this.StateDropDown = [];
    this.GetRoleDropDown();
    this.GetStateDropDown();
    this.isEditMode = false;
    this.selectedUserId = '';
  }

  ngOnInit(): void {
    this.PageTitle = 'Create User';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedUserId = params['userid'] || '';
        })
      )
      .subscribe();
    if (this.selectedUserId != '') {
      this.isEditMode = true;
      this.PageTitle = 'Update User';
      this.getUserByID();
    } else {
      this.isEditMode = false;
      this.passwordControl.setValidators([Validators.required]);
      this.passwordControl.updateValueAndValidity();
    }
    this.UserNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckUserNameExists(this.UserName);
    });
  }

  BacktoList() {
    this.router.navigate(['/admin/user/list']);
  }

  GetRoleDropDown() {
    this.roleService.RoleDropDown().subscribe((response) => {
      this.RoleDownDown = response;
    });
  }

  GetStateDropDown() {
    this.commonService.StateDropDown().subscribe((response) => {
      this.StateDropDown = response;
    });
  }

  getUserByID() {
    this.userService.GetUserbyID(this.selectedUserId).subscribe((response) => {
      this.editUser = response;
      this.userForm.patchValue({
        firstName: this.editUser!.firstName,
        lastName: this.editUser!.lastName,
        userName: this.editUser!.userName,
        email: this.editUser!.email,
        roleID: this.editUser!.roleID.toString(),
        isActive: this.editUser!.isActive,
        address: this.editUser!.address,
        city: this.editUser!.city,
        stateID: this.editUser!.stateID.toString(),
        pinCode: this.editUser!.pinCode,
        mobile_Work: this.editUser!.mobile_Work,
        mobile_Personal: this.editUser!.mobile_Personal,
      });
    });
  }

  get firstNameControl() {
    return this.userForm.get('firstName') as FormControl;
  }

  get firstNameControlRequired() {
    return (
      this.firstNameControl.hasError('required') &&
      this.firstNameControl.touched
    );
  }

  get firstNameControlInvalid() {
    return (
      this.firstNameControl.hasError('pattern') && this.firstNameControl.touched
    );
  }

  get lastNameControl() {
    return this.userForm.get('lastName') as FormControl;
  }

  get lastNameControlRequired() {
    return (
      this.lastNameControl.hasError('required') && this.lastNameControl.touched
    );
  }

  get lastNameControlInvalid() {
    return (
      this.lastNameControl.hasError('pattern') && this.lastNameControl.touched
    );
  }

  get userNameControl() {
    return this.userForm.get('userName') as FormControl;
  }

  get userNameControlRequired() {
    return (
      this.userNameControl.hasError('required') && this.userNameControl.touched
    );
  }

  get userNameControlInvalid() {
    return (
      this.userNameControl.hasError('pattern') && this.userNameControl.touched
    );
  }

  get emailControl() {
    return this.userForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.userForm.get('password') as FormControl;
  }

  get passwordControlRequired() {
    return (
      this.passwordControl.hasError('required') && this.passwordControl.touched
    );
  }

  get roleControl() {
    return this.userForm.get('roleID') as FormControl;
  }

  get roleControlRequired() {
    return this.roleControl.hasError('required') && this.roleControl.touched;
  }

  get addressControl() {
    return this.userForm.get('address') as FormControl;
  }

  get addressControlInvalid() {
    return (
      this.addressControl.hasError('pattern') && this.addressControl.touched
    );
  }

  get cityControl() {
    return this.userForm.get('city') as FormControl;
  }

  get cityControlInvalid() {
    return this.cityControl.hasError('pattern') && this.cityControl.touched;
  }

  get pinCodeControl() {
    return this.userForm.get('pinCode') as FormControl;
  }

  get pinCodeControlInvalid() {
    return (
      this.pinCodeControl.hasError('pattern') && this.pinCodeControl.touched
    );
  }

  get mobile_WorkControl() {
    return this.userForm.get('mobile_Work') as FormControl;
  }

  get mobile_WorkControlRequired() {
    return (
      this.mobile_WorkControl.hasError('required') &&
      this.mobile_WorkControl.touched
    );
  }

  get mobile_WorkControlInvalid() {
    return (
      this.mobile_WorkControl.hasError('pattern') &&
      this.mobile_WorkControl.touched
    );
  }

  get mobile_PersonalControl() {
    return this.userForm.get('mobile_Personal') as FormControl;
  }

  get mobile_PersonalControlInvalid() {
    return (
      this.mobile_PersonalControl.hasError('pattern') &&
      this.mobile_PersonalControl.touched
    );
  }

  CheckUserNameExists(UserName: string) {
    if (UserName != '') {
      this.userService
        .CheckUserNameExists(this.selectedUserId, UserName)
        .subscribe((response) => {
          this.isUserNameValid = response;
        });
    }
  }

  onUserNameKeyUp($event: any) {
    this.UserName = $event.target.value.trim();
    this.UserNameExists.next(this.UserName);
  }

  getUserNameValidation() {
    if (this.isUserNameValid) {
      this.userForm.controls.userName.setErrors({ isUserNameValid: true });
    } else {
      this.userForm.controls.userName.updateValueAndValidity();
      this.userForm.controls.email.setValue(
        this.userForm.controls.userName.value
      );
    }
    return this.isUserNameValid;
  }

  SaveUpdateRole(userForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateUser(userForm);
    } else {
      this.SaveUser(userForm);
    }
  }

  SaveUser(userForm: FormGroup) {
    this.userPostRequest = {
      firstName: userForm.value.firstName.toString(),
      lastName: userForm.value.lastName.toString(),
      userName: userForm.value.userName.toString(),
      password: userForm.value.password.toString(),
      email: userForm.value.email.toString(),
      address: userForm.value.address.toString(),
      city: userForm.value.city.toString(),
      stateID: userForm.value.stateID,
      pinCode: userForm.value.pinCode.toString(),
      mobile_Work: userForm.value.mobile_Work.toString(),
      mobile_Personal: userForm.value.mobile_Personal.toString(),
      isCompanyOwner: false,
      roleID: userForm.value.roleID,
      isActive: userForm.value.isActive,
    };

    this.userService.createUser(this.userPostRequest).subscribe((response) => {
      this.BacktoList();
    });
  }

  UpdateUser(userForm: FormGroup) {
    this.userPutRequest = {
      firstName: userForm.value.firstName.toString(),
      lastName: userForm.value.lastName.toString(),
      userName: userForm.value.userName.toString(),
      email: userForm.value.email.toString(),
      address: userForm.value.address.toString(),
      city: userForm.value.city.toString(),
      stateID: userForm.value.stateID,
      pinCode: userForm.value.pinCode.toString(),
      mobile_Work: userForm.value.mobile_Work.toString(),
      mobile_Personal: userForm.value.mobile_Personal.toString(),
      isCompanyOwner: false,
      roleID: userForm.value.roleID,
      isActive: userForm.value.isActive,
    };
    this.userService
      .updateUser(this.selectedUserId, this.userPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
