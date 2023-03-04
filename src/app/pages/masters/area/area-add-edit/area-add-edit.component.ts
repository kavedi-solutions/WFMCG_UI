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
  Area,
  AreaPostRequest,
  AreaPutRequest,
} from '../../../../shared/index';
@Component({
  selector: 'app-area-add-edit',
  templateUrl: './area-add-edit.component.html',
  styleUrls: ['./area-add-edit.component.scss'],
})
export class AreaAddEditComponent implements OnInit {
  PageTitle: string = 'Create Area';
  buttonText: string = 'Add New Area';
  isEditMode: boolean = false;
  selectedAreaId: number;
  areaPostRequest?: AreaPostRequest;
  areaPutRequest?: AreaPutRequest;
  editArea?: Area;
  isAreaNameValid: boolean = false;
  AreaName: string = '';
  AreaNameExists: Subject<any> = new Subject();

  areaForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    isActive: [true],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private areaService: fromService.AreaService,
    private fb: FormBuilder
  ) {
    this.isEditMode = false;
    this.selectedAreaId = 0;
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Area';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedAreaId = params['areaid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedAreaId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Role';
      this.getAreaByID();
    } else {
      this.isEditMode = false;
    }
    this.AreaNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckAreaNameExists(this.AreaName);
    });
  }

  get nameControl() {
    return this.areaForm.get('name') as FormControl;
  }

  get nameControlRequired() {
    return this.nameControl.hasError('required') && this.nameControl.touched;
  }

  get nameControlInvalid() {
    return this.nameControl.hasError('pattern') && this.nameControl.touched;
  }

  getAreaNameValidation() {
    if (this.isAreaNameValid) {
      this.areaForm.controls.name.setErrors({ isAreaNameValid: true });
    } else {
      this.areaForm.controls.name.updateValueAndValidity();
    }
    return this.isAreaNameValid;
  }

  onAreaNameKeyUp($event: any) {
    this.AreaName = $event.target.value.trim();
    this.AreaNameExists.next(this.AreaName);
  }

  CheckAreaNameExists(AreaName: string) {
    if (AreaName != '') {
      this.areaService
        .CheckAreaNameExists(this.selectedAreaId, AreaName)
        .subscribe((response) => {
          this.isAreaNameValid = response;
        });
    }
  }

  getAreaByID() {
    this.areaService.GetAreabyID(this.selectedAreaId).subscribe((response) => {
      this.editArea = response;
      this.areaForm.patchValue({
        name: this.editArea!.name,
        isActive: this.editArea!.isActive,
      });
    });
  }

  BacktoList() {
    this.router.navigate(['/master/area/list']);
  }

  SaveUpdateArea(areaForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateArea(areaForm);
    } else {
      this.SaveArea(areaForm);
    }
  }

  SaveArea(areaForm: FormGroup) {
    this.areaPostRequest = {
      name: areaForm.value.name.toString(),
      isActive: areaForm.value.isActive,
    };

    this.areaService.createArea(this.areaPostRequest).subscribe((response) => {
      this.BacktoList();
    });
  }

  UpdateArea(areaForm: FormGroup) {
    this.areaPutRequest = {
      name: areaForm.value.name.toString(),
      isActive: areaForm.value.isActive,
    };

    this.areaService
      .updateArea(this.selectedAreaId, this.areaPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
