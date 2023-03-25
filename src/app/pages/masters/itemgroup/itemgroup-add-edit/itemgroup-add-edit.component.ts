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
  ItemGroup,
  ItemGroupDownDownResponse,
  ItemGroupPostRequest,
  ItemGroupPutRequest,
} from '../../../../shared/index';

@Component({
  selector: 'app-itemgroup-add-edit',
  templateUrl: './itemgroup-add-edit.component.html',
  styleUrls: ['./itemgroup-add-edit.component.scss'],
})
export class ItemgroupAddEditComponent implements OnInit {
  PageTitle: string = 'Create Item Group';
  buttonText: string = 'Add New Item Group';
  isEditMode: boolean = false;
  selectedItemGroupId: number;
  itemGroupPostRequest?: ItemGroupPostRequest;
  itemGroupPutRequest?: ItemGroupPutRequest;
  itemGroupDropDown: ItemGroupDownDownResponse[] = [];
  editItemGroup?: ItemGroup;
  isItemGroupNameValid: boolean = false;
  ItemGroupName: string = '';
  ItemGroupNameExists: Subject<any> = new Subject();

  itemGroupForm = this.fb.group({
    ItemGroupName: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    ItemGroupType: ['Parent'],
    ParentGroupItemGroupID: [''],
    isActive: [true],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private itemGroupService: fromService.ItemgroupService,
    private fb: FormBuilder
  ) {
    this.isEditMode = false;
    this.selectedItemGroupId = 0;
    this.itemGroupDropDown = [];
    this.FillParentItemGroup();
  }

  ngOnInit(): void {
    this.PageTitle = 'Create ItemGroup';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedItemGroupId = params['itemgroupid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedItemGroupId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update ItemGroup';
      this.getItemGroupByID();
    } else {
      this.isEditMode = false;
    }
    this.ItemGroupNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckItemGroupNameExists(this.ItemGroupName);
    });
  }

  get itemGroupnameControl() {
    return this.itemGroupForm.get('ItemGroupName') as FormControl;
  }

  get itemGroupnameControlRequired() {
    return (
      this.itemGroupnameControl.hasError('required') &&
      this.itemGroupnameControl.touched
    );
  }

  get itemGroupnameControlInvalid() {
    return (
      this.itemGroupnameControl.hasError('pattern') &&
      this.itemGroupnameControl.touched
    );
  }

  get ParentGroupItemGroupIDControl() {
    return this.itemGroupForm.get('ParentGroupItemGroupID') as FormControl;
  }

  get ParentGroupItemGroupIDControlRequired() {
    return (
      this.ParentGroupItemGroupIDControl.hasError('required') &&
      this.ParentGroupItemGroupIDControl.touched
    );
  }

  getItemGroupNameValidation() {
    if (this.isItemGroupNameValid) {
      this.itemGroupForm.controls.ItemGroupName.setErrors({
        isItemGroupNameValid: true,
      });
    } else {
      this.itemGroupForm.controls.ItemGroupName.updateValueAndValidity();
    }
    return this.isItemGroupNameValid;
  }

  onItemGroupNameKeyUp($event: any) {
    this.ItemGroupName = $event.target.value.trim();
    this.ItemGroupNameExists.next(this.ItemGroupName);
  }

  CheckItemGroupNameExists(ItemGroupName: string) {
    if (ItemGroupName != '') {
      this.itemGroupService
        .CheckItemGroupNameExists(this.selectedItemGroupId, ItemGroupName)
        .subscribe((response) => {
          this.isItemGroupNameValid = response;
        });
    }
  }

  getItemGroupByID() {
    this.itemGroupService
      .GetItemGroupbyID(this.selectedItemGroupId)
      .subscribe((response) => {
        this.editItemGroup = response;
        this.itemGroupForm.patchValue({
          ItemGroupName: this.editItemGroup!.itemGroupName,
          ItemGroupType: this.editItemGroup!.itemGroupType,
          ParentGroupItemGroupID:
            this.editItemGroup!.parentGroupItemGroupID.toString(),
          isActive: this.editItemGroup!.isActive,
        });
      });
  }

  BacktoList() {
    this.router.navigate(['/master/itemgroup/list']);
  }

  SaveUpdateItemGroup(itemGroupForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateItemGroup(itemGroupForm);
    } else {
      this.SaveItemGroup(itemGroupForm);
    }
  }

  SaveItemGroup(itemGroupForm: FormGroup) {
    this.itemGroupPostRequest = {
      itemGroupName: itemGroupForm.value.ItemGroupName.toString(),
      itemGroupType: itemGroupForm.value.ItemGroupType,
      parentGroupItemGroupID: Number(
        itemGroupForm.value.ParentGroupItemGroupID.toString()
      ),
      isActive: itemGroupForm.value.isActive,
    };

    this.itemGroupService
      .createItemGroup(this.itemGroupPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateItemGroup(itemGroupForm: FormGroup) {
    this.itemGroupPutRequest = {
      itemGroupName: itemGroupForm.value.ItemGroupName.toString(),
      itemGroupType: itemGroupForm.value.ItemGroupType,
      parentGroupItemGroupID: Number(
        itemGroupForm.value.ParentGroupItemGroupID.toString()
      ),
      isActive: itemGroupForm.value.isActive,
    };

    this.itemGroupService
      .updateItemGroup(this.selectedItemGroupId, this.itemGroupPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  FillParentItemGroup() {
    this.itemGroupService.ItemGroupDropDown('Parent').subscribe((response) => {
      this.itemGroupDropDown = response;
    });
  }
}
