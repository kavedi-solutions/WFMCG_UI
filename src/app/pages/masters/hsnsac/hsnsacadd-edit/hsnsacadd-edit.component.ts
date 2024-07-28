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
import { HSNCode, HSNCodePostRequest, HSNCodePutRequest } from 'src/app/shared';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-hsnsacadd-edit',
  templateUrl: './hsnsacadd-edit.component.html',
  styleUrls: ['./hsnsacadd-edit.component.scss'],
})
export class HSNSACAddEditComponent implements OnInit {
  PageTitle: string = 'Create HSN/SAC';
  buttonText: string = 'Add New HSN/SAC';
  isEditMode: boolean = false;
  selectedAutoId: number;
  hsnCodePostRequest?: HSNCodePostRequest;
  hsnCodePutRequest?: HSNCodePutRequest;
  editHSNCode?: HSNCode;
  isHSNCodeCodeValid: boolean = false;
  HSNCode: string = '';
  HSNCodeExists: Subject<any> = new Subject();

  hsnForm = this.fb.group({
    HsnSacCode: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([0-9]*)+$/i),
        Validators.minLength(4),
        Validators.maxLength(8),
      ],
    ],
    HsnSacType: ['H'],
    HsnSacDescription: [''],
    isActive: [true],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private hsnCodeService: fromService.HSNCodeService,
    private fb: FormBuilder
  ) {
    this.isEditMode = false;
    this.selectedAutoId = 0;
  }

  ngOnInit(): void {
    this.PageTitle = 'Create HSN/SAC';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedAutoId = params['itemgroupid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedAutoId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update ItemGroup';
      this.getHSNSACByID();
    } else {
      this.isEditMode = false;
    }
    this.HSNCodeExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckHsnSacCodeExists(this.HSNCode);
    });
  }

  get hsnSacCodeControl() {
    return this.hsnForm.get('HsnSacCode') as FormControl;
  }

  get hsnSacCodeControlRequired() {
    return (
      this.hsnSacCodeControl.hasError('required') &&
      this.hsnSacCodeControl.touched
    );
  }

  get hsnSacCodeControlInvalid() {
    return (
      this.hsnSacCodeControl.hasError('pattern') &&
      this.hsnSacCodeControl.touched
    );
  }

  get hsnSacCodeControlMinLength() {
    return (
      this.hsnSacCodeControl.hasError('minLength') &&
      this.hsnSacCodeControl.touched
    );
  }

  get hsnSacCodeControlMaxLength() {
    return (
      this.hsnSacCodeControl.hasError('maxLength') &&
      this.hsnSacCodeControl.touched
    );
  }

  getHsnSacCodeValidation() {
    if (this.isHSNCodeCodeValid) {
      this.hsnForm.controls.HsnSacCode.setErrors({
        isHSNCodeCodeValid: true,
      });
    } else {
      this.hsnForm.controls.HsnSacCode.updateValueAndValidity();
    }
    return this.isHSNCodeCodeValid;
  }

  onHsnSacCodeKeyUp($event: any) {
    this.HSNCode = $event.target.value.trim();
    this.HSNCodeExists.next(this.HSNCode);
  }

  CheckHsnSacCodeExists(HsnSacCode: string) {
    if (HsnSacCode != '') {
      this.hsnCodeService
        .CheckHSNCodeExists(this.selectedAutoId, HsnSacCode)
        .subscribe((response) => {
          this.isHSNCodeCodeValid = response;
        });
    }
  }

  get hsnSacDescriptionControl() {
    return this.hsnForm.get('HsnSacDescription') as FormControl;
  }

  get hsnSacDescriptionControlRequired() {
    return (
      this.hsnSacDescriptionControl.hasError('required') &&
      this.hsnSacDescriptionControl.touched
    );
  }

  getHSNSACByID() {
    this.hsnCodeService
      .GetHSNCodebyID(this.selectedAutoId)
      .subscribe((response) => {
        this.editHSNCode = response;
        this.hsnForm.patchValue({
          HsnSacCode: this.editHSNCode!.hsN_SAC_Code,
          HsnSacDescription: this.editHSNCode!.hsN_SAC_Description,
          HsnSacType: this.editHSNCode!.hsN_SAC_Type,
          isActive: this.editHSNCode!.isActive,
        });
      });
  }

  BacktoList() {
    this.router.navigate(['/master/hsnsac/list']);
  }

  SaveUpdateHSN(itemGroupForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateHSNSAC(itemGroupForm);
    } else {
      this.SaveHSNSAC(itemGroupForm);
    }
  }

  SaveHSNSAC(hsnForm: FormGroup) {
    this.hsnCodePostRequest = {
      hSN_SAC_Code: hsnForm.value.HsnSacCode,
      hSN_SAC_Description: hsnForm.value.HsnSacDescription,
      hSN_SAC_Type: hsnForm.value.HsnSacType,
      isActive: hsnForm.value.isActive,
    };

    this.hsnCodeService
      .createHSNCode(this.hsnCodePostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateHSNSAC(hsnForm: FormGroup) {
    this.hsnCodePutRequest = {
      hSN_SAC_Code: hsnForm.value.HsnSacCode,
      hSN_SAC_Description: hsnForm.value.HsnSacDescription,
      hSN_SAC_Type: hsnForm.value.HsnSacType,
      isActive: hsnForm.value.isActive,
    };

    this.hsnCodeService
      .updateHSNCode(this.selectedAutoId, this.hsnCodePutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
