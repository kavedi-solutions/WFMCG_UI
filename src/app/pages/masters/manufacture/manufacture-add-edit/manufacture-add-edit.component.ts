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
  Manufacture,
  ManufacturePostRequest,
  ManufacturePutRequest,
} from '../../../../shared/index';

@Component({
  selector: 'app-manufacture-add-edit',
  templateUrl: './manufacture-add-edit.component.html',
  styleUrls: ['./manufacture-add-edit.component.scss']
})
export class ManufactureAddEditComponent implements OnInit {
  PageTitle: string = 'Create Manufacture';
  buttonText: string = 'Add New Manufacture';
  isEditMode: boolean = false;
  selectedManufactureId: number;
  manufacturePostRequest?: ManufacturePostRequest;
  manufacturePutRequest?: ManufacturePutRequest;
  editManufacture?: Manufacture;
  isManufactureNameValid: boolean = false;
  ManufactureName: string = '';
  ManufactureNameExists: Subject<any> = new Subject();

  manufactureForm = this.fb.group({
    manufactureName: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    isActive: [true],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private manufactureService: fromService.ManufactureService,
    private fb: FormBuilder
  ) {
    this.isEditMode = false;
    this.selectedManufactureId = 0;
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Manufacture';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedManufactureId = params['manufactureid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedManufactureId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Manufacture';
      this.getManufactureByID();
    } else {
      this.isEditMode = false;
    }
    this.ManufactureNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckManufactureNameExists(this.ManufactureName);
    });
  }

  get manufacturenameControl() {
    return this.manufactureForm.get('manufactureName') as FormControl;
  }

  get manufacturenameControlRequired() {
    return this.manufacturenameControl.hasError('required') && this.manufacturenameControl.touched;
  }

  get manufacturenameControlInvalid() {
    return this.manufacturenameControl.hasError('pattern') && this.manufacturenameControl.touched;
  }

  getManufactureNameValidation() {
    if (this.isManufactureNameValid) {
      this.manufactureForm.controls.manufactureName.setErrors({ isManufactureNameValid: true });
    } else {
      this.manufactureForm.controls.manufactureName.updateValueAndValidity();
    }
    return this.isManufactureNameValid;
  }

  onManufactureNameKeyUp($event: any) {
    this.ManufactureName = $event.target.value.trim();
    this.ManufactureNameExists.next(this.ManufactureName);
  }

  CheckManufactureNameExists(ManufactureName: string) {
    if (ManufactureName != '') {
      this.manufactureService
        .CheckManufactureNameExists(this.selectedManufactureId, ManufactureName)
        .subscribe((response) => {
          this.isManufactureNameValid = response;
        });
    }
  }

  getManufactureByID() {
    this.manufactureService.GetManufacturebyID(this.selectedManufactureId).subscribe((response) => {
      this.editManufacture = response;
      this.manufactureForm.patchValue({
        manufactureName: this.editManufacture!.manufactureName,
        isActive: this.editManufacture!.isActive,
      });
    });
  }

  BacktoList() {
    this.router.navigate(['/master/manufacture/list']);
  }

  SaveUpdateManufacture(manufactureForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateManufacture(manufactureForm);
    } else {
      this.SaveManufacture(manufactureForm);
    }
  }

  SaveManufacture(manufactureForm: FormGroup) {
    this.manufacturePostRequest = {
      manufactureName: manufactureForm.value.manufactureName.toString(),
      isActive: manufactureForm.value.isActive,
    };

    this.manufactureService.createManufacture(this.manufacturePostRequest).subscribe((response) => {
      this.BacktoList();
    });
  }

  UpdateManufacture(manufactureForm: FormGroup) {
    this.manufacturePutRequest = {
      manufactureName: manufactureForm.value.manufactureName.toString(),
      isActive: manufactureForm.value.isActive,
    };

    this.manufactureService
      .updateManufacture(this.selectedManufactureId, this.manufacturePutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
