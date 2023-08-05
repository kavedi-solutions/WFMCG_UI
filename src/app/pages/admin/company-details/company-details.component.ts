import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CompanyPutRequest,
  CompanyResponse,
  stateDownDownResponse,
} from 'src/app/shared';
import * as fromService from '../../../shared/services/index';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit {
  PageTitle: string = 'Company Details';

  stateDropDown: stateDownDownResponse[] = [];
  editCompany?: CompanyResponse;
  isEditMode: boolean = false;
  companyPutRequest?: CompanyPutRequest;

  companyForm = this.fb.group({
    CompanyName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()&-.,/]+[\s]*)+$/i),
      ],
    ],
    Address: ['', [Validators.required]],
    City: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i),
      ],
    ],
    PinCode: ['', [Validators.required, Validators.pattern(/^([0-9])+$/i)]],
    StateID: ['', [Validators.required]],
    GSTNo: [
      '',
      [
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i
        ),
      ],
    ],
    PAN: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)]],
    FSSINO: ['', [Validators.required]],
    ContactNo: [
      '',
      [Validators.required, Validators.pattern(/^([0-9,-/+])+$/i)],
    ],
    EmailAddress: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private commonService: fromService.CommonService,
    private companyService: fromService.CompanyDetailService
  ) {
    this.FillStateDropDown();
    this.GetCompanyDetails();
  }

  ngOnInit(): void {}

  FillStateDropDown() {
    this.stateDropDown = [];
    this.commonService.StateDropDown().subscribe((response) => {
      this.stateDropDown = response;
    });
  }

  GetCompanyDetails() {
    this.companyService.GetCompanyDetailbyID().subscribe((response) => {
      this.editCompany = response;
      this.companyForm.patchValue({
        CompanyName: this.editCompany?.companyName,
        Address: this.editCompany?.address,
        City: this.editCompany?.city,
        PinCode: this.editCompany?.pinCode,
        StateID: this.editCompany?.stateID.toString(),
        GSTNo: this.editCompany?.gstNo,
        PAN: this.editCompany?.pan,
        FSSINO: this.editCompany?.fssino,
        ContactNo: this.editCompany?.contactNo,
        EmailAddress: this.editCompany?.emailAddress,
      });
    });
  }

  EditRecord() {
    this.isEditMode = true;
  }

  CancelClick() {
    this.isEditMode = false;
    this.GetCompanyDetails();
  }

  UpdateCompanyDetail(companyForm: FormGroup) {
    this.companyPutRequest = {
      companyName: companyForm.value.CompanyName,
      address: companyForm.value.Address,
      city: companyForm.value.City,
      pinCode: companyForm.value.PinCode,
      stateID: companyForm.value.StateID,
      gstNo: companyForm.value.GSTNo,
      pan: companyForm.value.PAN,
      fssino: companyForm.value.FSSINO,
      contactNo: companyForm.value.ContactNo,
      emailAddress: companyForm.value.EmailAddress,
    };
    this.companyService
      .updateCompany(this.companyPutRequest)
      .subscribe((response) => {
        this.CancelClick();
      });
  }

  //Controls

  get companyNameControl() {
    return this.companyForm.get('CompanyName') as FormControl;
  }

  get companyNameControlRequired() {
    return (
      this.companyNameControl.hasError('required') &&
      this.companyNameControl.touched
    );
  }

  get companyNameControlInvalid() {
    return (
      this.companyNameControl.hasError('pattern') &&
      this.companyNameControl.touched
    );
  }

  get addressControl() {
    return this.companyForm.get('Address') as FormControl;
  }

  get addressControlRequired() {
    return (
      this.addressControl.hasError('required') && this.addressControl.touched
    );
  }

  get cityControl() {
    return this.companyForm.get('City') as FormControl;
  }
  get cityControlRequired() {
    return this.cityControl.hasError('required') && this.cityControl.touched;
  }

  get cityControlInvalid() {
    return this.cityControl.hasError('pattern') && this.cityControl.touched;
  }

  get pinCodeControl() {
    return this.companyForm.get('PinCode') as FormControl;
  }

  get pinCodeControlRequired() {
    return (
      this.pinCodeControl.hasError('required') && this.pinCodeControl.touched
    );
  }

  get pinCodeControlInvalid() {
    return (
      this.pinCodeControl.hasError('pattern') && this.pinCodeControl.touched
    );
  }

  get pinCodeControlMinLength() {
    return (
      this.pinCodeControl.hasError('minLength') && this.pinCodeControl.touched
    );
  }

  get pinCodeControlMaxLength() {
    return (
      this.pinCodeControl.hasError('maxLength') && this.pinCodeControl.touched
    );
  }

  get stateIDControl() {
    return this.companyForm.get('StateID') as FormControl;
  }

  get stateIDControlRequired() {
    return (
      this.stateIDControl.hasError('required') && this.stateIDControl.touched
    );
  }

  get GSTNoControl() {
    return this.companyForm.get('GSTNo') as FormControl;
  }

  get GSTNoControlInvalid() {
    return this.GSTNoControl.hasError('pattern') && this.GSTNoControl.touched;
  }

  get GSTNoControlMinLength() {
    return this.GSTNoControl.hasError('minLength') && this.GSTNoControl.touched;
  }

  get GSTNoControlMaxLength() {
    return this.GSTNoControl.hasError('maxLength') && this.GSTNoControl.touched;
  }

  get PANControl() {
    return this.companyForm.get('PAN') as FormControl;
  }

  get PANControlInvalid() {
    return this.PANControl.hasError('pattern') && this.PANControl.touched;
  }

  get PANControlMinLength() {
    return this.PANControl.hasError('minLength') && this.PANControl.touched;
  }

  get PANControlMaxLength() {
    return this.PANControl.hasError('maxLength') && this.PANControl.touched;
  }

  get FSSINOControl() {
    return this.companyForm.get('FSSINO') as FormControl;
  }

  get FSSINOControlRequired() {
    return (
      this.FSSINOControl.hasError('required') && this.FSSINOControl.touched
    );
  }

  get FSSINOControlMinLength() {
    return (
      this.FSSINOControl.hasError('minLength') && this.FSSINOControl.touched
    );
  }

  get FSSINOControlMaxLength() {
    return (
      this.FSSINOControl.hasError('maxLength') && this.FSSINOControl.touched
    );
  }

  get contactNoControl() {
    return this.companyForm.get('ContactNo') as FormControl;
  }

  get contactNoControlRequired() {
    return (
      this.contactNoControl.hasError('required') &&
      this.contactNoControl.touched
    );
  }

  get contactNoControlInvalid() {
    return (
      this.contactNoControl.hasError('pattern') && this.contactNoControl.touched
    );
  }

  get EmailAddressControl() {
    return this.companyForm.get('EmailAddress') as FormControl;
  }

  get EmailAddressControlRequired() {
    return (
      this.EmailAddressControl.hasError('required') &&
      this.EmailAddressControl.touched
    );
  }

  get EmailAddressControlInvalid() {
    return (
      this.EmailAddressControl.hasError('email') &&
      this.EmailAddressControl.touched
    );
  }
}
