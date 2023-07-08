import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject, tap } from 'rxjs';
import {
  accountsDropDownResponse,
  Tax,
  TaxPostRequest,
  TaxPutRequest,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-tax-add-edit',
  templateUrl: './tax-add-edit.component.html',
  styleUrls: ['./tax-add-edit.component.scss'],
})
export class TaxAddEditComponent implements OnInit {
  PageTitle: string = 'Create Tax';
  buttonText: string = 'Add New Tax';
  isEditMode: boolean = false;
  selectedTaxId: number;
  taxPostRequest?: TaxPostRequest;
  taxPutRequest?: TaxPutRequest;
  editTax?: Tax;
  isTaxNameValid: boolean = false;
  TaxName: string = '';
  TaxNameExists: Subject<any> = new Subject();
  accountsDropDown: accountsDropDownResponse[] = [];
  hasCessRate: boolean = false;
  taxForm = this.fb.group({
    TaxName: [
      '',
      [
        Validators.required,
        Validators.pattern(/^([\s]*[a-zA-Z0-9()%&-.,/]+[\s]*)+$/i),
      ],
    ],
    IGSTRate: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(/^([0-9,-/+])+$/i),
      ],
    ],
    IGSTInputPostingAc: ['', [Validators.required]],
    IGSTOutputPostingAc: ['', [Validators.required]],
    CGSTRate: [0],
    CGSTInputPostingAc: ['', [Validators.required]],
    CGSTOutputPostingAc: ['', [Validators.required]],
    SGSTRate: [0],
    SGSTInputPostingAc: ['', [Validators.required]],
    SGSTOutputPostingAc: ['', [Validators.required]],
    CessRate: [
      0,
      [
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(/^([0-9,-/+])+$/i),
      ],
    ],
    CessInputPostingAc: ['', [Validators.required]],
    CessOutputPostingAc: ['', [Validators.required]],
    TotalTaxRate: [0],
    isActive: [true],
  });

  constructor(
    private accountService: fromService.AccountsService,
    private router: Router,
    public route: ActivatedRoute,
    private taxService: fromService.TaxService,
    private fb: FormBuilder
  ) {
    this.FillAccountDropDown(1);
    this.isEditMode = false;
    this.selectedTaxId = 0;
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Tax';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedTaxId = params['taxid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedTaxId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Tax';
      this.getTaxByID();
    } else {
      this.isEditMode = false;
    }
    this.TaxNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckTaxNameExists(this.TaxName);
    });
  }

  get taxNameControl() {
    return this.taxForm.get('TaxName') as FormControl;
  }

  get nameControlRequired() {
    return (
      this.taxNameControl.hasError('required') && this.taxNameControl.touched
    );
  }

  get nameControlInvalid() {
    return (
      this.taxNameControl.hasError('pattern') && this.taxNameControl.touched
    );
  }

  get igstRateControl() {
    return this.taxForm.get('IGSTRate') as FormControl;
  }

  get igstRateControlRequired() {
    return (
      this.igstRateControl.hasError('required') && this.igstRateControl.touched
    );
  }

  get igstRateControlInvalid() {
    return (
      this.igstRateControl.hasError('pattern') && this.igstRateControl.touched
    );
  }

  get igstRateControlmin() {
    return this.igstRateControl.hasError('min') && this.igstRateControl.touched;
  }

  get igstRateControlmax() {
    return this.igstRateControl.hasError('max') && this.igstRateControl.touched;
  }

  get IGSTInputPostingAcControl() {
    return this.taxForm.get('IGSTInputPostingAc') as FormControl;
  }

  get IGSTInputPostingAcControlRequired() {
    return (
      this.IGSTInputPostingAcControl.hasError('required') &&
      this.IGSTInputPostingAcControl.touched
    );
  }

  get IGSTOutputPostingAcControl() {
    return this.taxForm.get('IGSTOutputPostingAc') as FormControl;
  }

  get IGSTOutputPostingAcControlRequired() {
    return (
      this.IGSTOutputPostingAcControl.hasError('required') &&
      this.IGSTOutputPostingAcControl.touched
    );
  }

  get sgstRateControl() {
    return this.taxForm.get('SGSTRate') as FormControl;
  }

  get SGSTInputPostingAcControl() {
    return this.taxForm.get('SGSTInputPostingAc') as FormControl;
  }

  get SGSTInputPostingAcControlRequired() {
    return (
      this.SGSTInputPostingAcControl.hasError('required') &&
      this.SGSTInputPostingAcControl.touched
    );
  }

  get SGSTOutputPostingAcControl() {
    return this.taxForm.get('SGSTOutputPostingAc') as FormControl;
  }

  get SGSTOutputPostingAcControlRequired() {
    return (
      this.SGSTOutputPostingAcControl.hasError('required') &&
      this.SGSTOutputPostingAcControl.touched
    );
  }

  get cgstRateControl() {
    return this.taxForm.get('CGSTRate') as FormControl;
  }

  get CGSTInputPostingAcControl() {
    return this.taxForm.get('CGSTInputPostingAc') as FormControl;
  }

  get CGSTInputPostingAcControlRequired() {
    return (
      this.CGSTInputPostingAcControl.hasError('required') &&
      this.CGSTInputPostingAcControl.touched
    );
  }

  get CGSTOutputPostingAcControl() {
    return this.taxForm.get('CGSTOutputPostingAc') as FormControl;
  }

  get CGSTOutputPostingAcControlRequired() {
    return (
      this.CGSTOutputPostingAcControl.hasError('required') &&
      this.CGSTOutputPostingAcControl.touched
    );
  }

  get cessRateControl() {
    return this.taxForm.get('CessRate') as FormControl;
  }

  get cessRateControlRequired() {
    return (
      this.cessRateControl.hasError('required') && this.cessRateControl.touched
    );
  }

  get cessRateControlInvalid() {
    return (
      this.cessRateControl.hasError('pattern') && this.cessRateControl.touched
    );
  }

  get cessRateControlmin() {
    return this.cessRateControl.hasError('min') && this.cessRateControl.touched;
  }

  get cessRateControlmax() {
    return this.cessRateControl.hasError('max') && this.cessRateControl.touched;
  }

  get CessInputPostingAcControl() {
    return this.taxForm.get('CessInputPostingAc') as FormControl;
  }

  get CessInputPostingAcControlRequired() {
    return (
      this.CessInputPostingAcControl.hasError('required') &&
      this.CessInputPostingAcControl.touched
    );
  }

  get CessOutputPostingAcControl() {
    return this.taxForm.get('CessOutputPostingAc') as FormControl;
  }

  get CessOutputPostingAcControlRequired() {
    return (
      this.CessOutputPostingAcControl.hasError('required') &&
      this.CessOutputPostingAcControl.touched
    );
  }

  get totalTaxRateControl() {
    return this.taxForm.get('TotalTaxRate') as FormControl;
  }

  getTaxNameValidation() {
    if (this.isTaxNameValid) {
      this.taxForm.controls.TaxName.setErrors({ isTaxNameValid: true });
    } else {
      this.taxForm.controls.TaxName.updateValueAndValidity();
    }
    return this.isTaxNameValid;
  }

  onTaxNameKeyUp($event: any) {
    this.TaxName = $event.target.value.trim();
    this.TaxNameExists.next(this.TaxName);
  }

  CheckTaxNameExists(TaxName: string) {
    if (TaxName != '') {
      this.taxService
        .CheckTaxNameExists(this.selectedTaxId, TaxName)
        .subscribe((response) => {
          this.isTaxNameValid = response;
        });
    }
  }

  getTaxByID() {
    this.taxService.GetTaxbyID(this.selectedTaxId).subscribe((response) => {
      this.editTax = response;
      this.taxForm.patchValue({
        TaxName: this.editTax!.taxName,
        IGSTRate: this.editTax!.igstRate,
        IGSTInputPostingAc: this.editTax!.igstInputPostingAc.toString(),
        IGSTOutputPostingAc: this.editTax!.igstOutputPostingAc.toString(),
        CGSTRate: this.editTax!.cgstRate,
        CGSTInputPostingAc: this.editTax!.cgstInputPostingAc.toString(),
        CGSTOutputPostingAc: this.editTax!.cgstOutputPostingAc.toString(),
        SGSTRate: this.editTax!.sgstRate,
        SGSTInputPostingAc: this.editTax!.sgstInputPostingAc.toString(),
        SGSTOutputPostingAc: this.editTax!.sgstOutputPostingAc.toString(),
        CessRate: this.editTax!.cessRate,
        CessInputPostingAc: this.editTax!.cessInputPostingAc.toString(),
        CessOutputPostingAc: this.editTax!.cessOutputPostingAc.toString(),
        TotalTaxRate: this.editTax!.totalTaxRate,
        isActive: this.editTax!.isActive,
      });

      this.hasCessRate = this.editTax!.cessRate > 0 ? true : false;
    });
  }

  BacktoList() {
    this.router.navigate(['/master/tax/list']);
  }

  SaveUpdateTax(taxForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateTax(taxForm);
    } else {
      this.SaveTax(taxForm);
    }
  }

  SaveTax(taxForm: FormGroup) {
    this.taxPostRequest = {
      taxName: taxForm.value.TaxName.toString(),
      igstRate: taxForm.value.IGSTRate,
      igstInputPostingAc: taxForm.value.IGSTInputPostingAc,
      igstOutputPostingAc: taxForm.value.IGSTOutputPostingAc,
      cgstRate: taxForm.value.CGSTRate,
      cgstInputPostingAc: taxForm.value.CGSTInputPostingAc,
      cgstOutputPostingAc: taxForm.value.CGSTOutputPostingAc,
      sgstRate: taxForm.value.SGSTRate,
      sgstInputPostingAc: taxForm.value.SGSTInputPostingAc,
      sgstOutputPostingAc: taxForm.value.SGSTOutputPostingAc,
      cessRate: taxForm.value.CessRate,
      cessInputPostingAc: taxForm.value.CessInputPostingAc,
      cessOutputPostingAc: taxForm.value.CessOutputPostingAc,
      totalTaxRate: taxForm.value.TotalTaxRate,
      isActive: taxForm.value.isActive,
    };

    this.taxService.createTax(this.taxPostRequest).subscribe((response) => {
      this.BacktoList();
    });
  }

  UpdateTax(taxForm: FormGroup) {
    this.taxPutRequest = {
      taxName: taxForm.value.TaxName.toString(),
      igstRate: taxForm.value.IGSTRate,
      igstInputPostingAc: taxForm.value.IGSTInputPostingAc,
      igstOutputPostingAc: taxForm.value.IGSTOutputPostingAc,
      cgstRate: taxForm.value.CGSTRate,
      cgstInputPostingAc: taxForm.value.CGSTInputPostingAc,
      cgstOutputPostingAc: taxForm.value.CGSTOutputPostingAc,
      sgstRate: taxForm.value.SGSTRate,
      sgstInputPostingAc: taxForm.value.SGSTInputPostingAc,
      sgstOutputPostingAc: taxForm.value.SGSTOutputPostingAc,
      cessRate: taxForm.value.CessRate,
      cessInputPostingAc: taxForm.value.CessInputPostingAc,
      cessOutputPostingAc: taxForm.value.CessOutputPostingAc,
      totalTaxRate: taxForm.value.TotalTaxRate,
      isActive: taxForm.value.isActive,
    };

    this.taxService
      .updateTax(this.selectedTaxId, this.taxPutRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  FillAccountDropDown(accountTypeID: number) {
    let filters = {
      GroupID: [],
      BalanceTransferToID: [],
      AccountTypeID: [accountTypeID],
      TransactionTypeID: [],
      SalesTypeID: [],
      AccountTradeTypeID: [],
      AreaID: [],
      HeadBookId: [],
    };
    this.accountService.AccountsDropDown(filters).subscribe((response) => {
      this.accountsDropDown = response;
    });
  }

  SetCGST_SGST() {
    let IGSTValue = this.igstRateControl.value || 0;
    let C_S_GSTRate = Number(IGSTValue) / 2;
    this.cgstRateControl.setValue(C_S_GSTRate);
    this.sgstRateControl.setValue(C_S_GSTRate);
  }

  SetTotal() {
    let IGSTValue = this.igstRateControl.value || 0;
    let CessValue = this.cessRateControl.value || 0;
    this.hasCessRate = CessValue > 0 ? true : false;
    let TotalTaxRate = Number(IGSTValue) + Number(CessValue);
    this.totalTaxRateControl.setValue(TotalTaxRate);
  }
}
