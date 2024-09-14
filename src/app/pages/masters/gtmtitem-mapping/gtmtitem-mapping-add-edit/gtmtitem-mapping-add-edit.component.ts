import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, startWith, tap } from 'rxjs';
import {
  ItemGTMTMapping,
  ItemGTMTPostRequest,
  ItemGTMTPutRequest,
  itemsDropDownResponse,
} from 'src/app/shared';
import * as fromService from '../../../../shared/index';

@Component({
  selector: 'app-gtmtitem-mapping-add-edit',
  templateUrl: './gtmtitem-mapping-add-edit.component.html',
  styleUrls: ['./gtmtitem-mapping-add-edit.component.scss'],
})
export class GTMTItemMappingAddEditComponent implements OnInit {
  @ViewChild('GTItemID') GTtemID?: MatAutocomplete;
  @ViewChild('MTItemID') MTItemID?: MatAutocomplete;

  PageTitle: string = 'Create GT to MT Item Mapping';
  buttonText: string = 'Add New Mapping';
  isEditMode: boolean = false;
  selectedAutoId: number;
  mappingPostRequest?: ItemGTMTPostRequest;
  mappingPutRequest?: ItemGTMTPutRequest;
  editItem?: ItemGTMTMapping;
  isFromQuickMenu: boolean = false;

  gtItemsDropDown: itemsDropDownResponse[] = [];
  filteredgtItemsDropDown?: Observable<itemsDropDownResponse[]>;
  mtItemsDropDown: itemsDropDownResponse[] = [];
  filteredmtItemsDropDown?: Observable<itemsDropDownResponse[]>;

  mappingForm = this.fb.group({
    GTItemID: ['', [Validators.required]],
    MTItemID: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private itemMappingService: fromService.GTMTMapItemService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.isEditMode = false;
    this.selectedAutoId = 0;
    this.GetGtItemDropDown();
  }

  ngOnInit(): void {
    this.filteredgtItemsDropDown = this.GTItemIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.item_Name;
        return name
          ? this._filterGTItems(name as string)
          : this.gtItemsDropDown.slice();
      })
    );

    this.filteredmtItemsDropDown = this.MTItemIDControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.item_Name;
        return name
          ? this._filterMTItems(name as string)
          : this.mtItemsDropDown.slice();
      })
    );
  }

  private _filterGTItems(name: string): itemsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.gtItemsDropDown.filter((option) =>
      option.item_Name.toLowerCase().includes(filterValue)
    );
  }

  private _filterMTItems(name: string): itemsDropDownResponse[] {
    const filterValue = name.toLowerCase();

    return this.mtItemsDropDown.filter((option) =>
      option.item_Name.toLowerCase().includes(filterValue)
    );
  }

  get GTItemIDControl() {
    return this.mappingForm.get('GTItemID') as FormControl;
  }

  get GTItemIDControlRequired() {
    return (
      this.GTItemIDControl.hasError('required') && this.GTItemIDControl.touched
    );
  }

  get MTItemIDControl() {
    return this.mappingForm.get('MTItemID') as FormControl;
  }

  get MTItemIDControlRequired() {
    return (
      this.MTItemIDControl.hasError('required') && this.MTItemIDControl.touched
    );
  }

  GetGtItemDropDown() {
    this.itemMappingService.GTItemDropDown().subscribe((response) => {
      this.gtItemsDropDown = response;
      this.GTItemIDControl.setValue('');
    });
  }

  GetMtItemDropDown(GTItemID: number) {
    this.itemMappingService.MTItemDropDown(GTItemID).subscribe((response) => {
      this.mtItemsDropDown = response;
      this.MTItemIDControl.setValue('');
    });
  }

  BacktoList() {
    if (this.isFromQuickMenu == false) {
      this.router.navigate(['/master/gtmtmapping/list']);
    } else {
      //this.ResetItemForm(this.itemForm);
    }
  }

  SelectedGTItem(event: any) {
    this.GetMtItemDropDown(Number(event.option.value.item_Id));
  }

  OnGTItemblur() {
    if (this.GTtemID?.isOpen == false) {
      if (this.GTItemIDControl.value == '') {
        this.renderer.selectRootElement('#GTItemName', true).focus();
      } else if (this.GTItemIDControl.value != '') {
        this.renderer.selectRootElement('#MTItemName', true).focus();
      }
    }
  }

  DisplayGTItemName(items: itemsDropDownResponse) {
    return items && items.item_Name ? items.item_Name : '';
  }

  DisplayMTItemName(items: itemsDropDownResponse) {
    return items && items.item_Name ? items.item_Name : '';
  }

  SaveUpdateMapping(mappingForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateMapping(mappingForm);
    } else {
      this.SaveMapping(mappingForm);
    }
  }

  SaveMapping(mappingForm: FormGroup) {
    this.mappingPostRequest = {
      gTItemID: mappingForm.value.GTItemID.item_Id,
      mTItemID: mappingForm.value.MTItemID.item_Id,
    };
    this.itemMappingService
      .createItem(this.mappingPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateMapping(mappingForm: FormGroup) {
    this.mappingPutRequest = {
      gTItemID: mappingForm.value.GTItemID.item_Id,
      mTItemID: mappingForm.value.MTItemID.item_Id,
    };
    this.itemMappingService
      .updateItem(this.selectedAutoId, this.mappingPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }
}
