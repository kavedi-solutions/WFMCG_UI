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
  balanceTransferToResponse,
  Group,
  GroupPostRequest,
  GroupPutRequest,
  scheduleResponse,
} from '../../../../shared/index';

@Component({
  selector: 'app-group-add-edit',
  templateUrl: './group-add-edit.component.html',
  styleUrls: ['./group-add-edit.component.scss'],
})
export class GroupAddEditComponent implements OnInit {
  PageTitle: string = 'Create Group';
  buttonText: string = 'Add New Group';
  isEditMode: boolean = false;
  selectedGroupId: number;
  groupPostRequest?: GroupPostRequest;
  groupPutRequest?: GroupPutRequest;
  editGroup?: Group;
  balanceTransferToDropDown: balanceTransferToResponse[] = [];
  scheduleDropDown: scheduleResponse[] = [];
  isGroupNameValid: boolean = false;
  GroupName: string = '';
  GroupNameExists: Subject<any> = new Subject();

  groupForm = this.fb.group({
    groupName: [
      '',
      [Validators.required, Validators.pattern(/^([\s]*[a-zA-Z0-9]+[\s]*)+$/i)],
    ],
    balanceTransferToID: ['', [Validators.required]],
    scheduleID: ['', [Validators.required]],
    isActive: [true],
  });

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private groupService: fromService.GroupService,
    private commonService: fromService.CommonService,
    private fb: FormBuilder
  ) {
    this.isEditMode = false;
    this.selectedGroupId = 0;
    this.balanceTransferToDropDown = [];
    this.scheduleDropDown = [];
    this.GetBalanceTransferToDropDown();
    this.GetScheduleDropDown();
  }

  ngOnInit(): void {
    this.PageTitle = 'Create Group';
    this.route.params
      .pipe(
        tap((params) => {
          this.selectedGroupId = params['groupid'] || 0;
        })
      )
      .subscribe();
    if (this.selectedGroupId != 0) {
      this.isEditMode = true;
      this.PageTitle = 'Update Group';
      this.getGroupByID();
    } else {
      this.isEditMode = false;
    }
    this.GroupNameExists.pipe(debounceTime(300)).subscribe(() => {
      this.CheckGroupNameExists(this.GroupName);
    });
  }

  get groupNameControl() {
    return this.groupForm.get('groupName') as FormControl;
  }

  get groupNameControlRequired() {
    return (
      this.groupNameControl.hasError('required') &&
      this.groupNameControl.touched
    );
  }

  get groupNameControlInvalid() {
    return (
      this.groupNameControl.hasError('pattern') && this.groupNameControl.touched
    );
  }

  getGroupNameValidation() {
    if (this.isGroupNameValid) {
      this.groupForm.controls.groupName.setErrors({ isGroupNameValid: true });
    } else {
      this.groupForm.controls.groupName.updateValueAndValidity();
    }
    return this.isGroupNameValid;
  }

  onGroupNameKeyUp($event: any) {
    this.GroupName = $event.target.value.trim();
    this.GroupNameExists.next(this.GroupName);
  }

  CheckGroupNameExists(GroupName: string) {
    if (GroupName != '') {
      this.groupService
        .CheckGroupNameExists(this.selectedGroupId, GroupName)
        .subscribe((response) => {
          this.isGroupNameValid = response;
        });
    }
  }

  getGroupByID() {
    this.groupService
      .GetGroupbyID(this.selectedGroupId)
      .subscribe((response) => {
        this.editGroup = response;

        this.groupForm.patchValue({
          groupName: this.editGroup!.groupName,
          balanceTransferToID: this.editGroup!.balanceTransferToID.toString(),
          scheduleID: this.editGroup!.scheduleID.toString(),
          isActive: this.editGroup!.isActive,
        });
      });
  }

  BacktoList() {
    this.router.navigate(['/master/group/list']);
  }

  SaveUpdateGroup(groupForm: FormGroup) {
    if (this.isEditMode == true) {
      this.UpdateGroup(groupForm);
    } else {
      this.SaveGroup(groupForm);
    }
  }

  SaveGroup(groupForm: FormGroup) {
    this.groupPostRequest = {
      groupName: groupForm.value.groupName.toString(),
      balanceTransferToID: groupForm.value.balanceTransferToID,
      scheduleID: groupForm.value.scheduleID,
      isActive: groupForm.value.isActive,
    };

    this.groupService
      .createGroup(this.groupPostRequest)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  UpdateGroup(groupForm: FormGroup) {
    this.groupPutRequest = {
      groupName: groupForm.value.groupName.toString(),
      balanceTransferToID: groupForm.value.balanceTransferToID,
      scheduleID: groupForm.value.scheduleID,
      isActive: groupForm.value.isActive,
    };

    this.groupService
      .updateGroup(this.selectedGroupId, this.groupPutRequest!)
      .subscribe((response) => {
        this.BacktoList();
      });
  }

  GetBalanceTransferToDropDown() {
    this.commonService.BalanceTransferToDropDown().subscribe((response) => {
      this.balanceTransferToDropDown = response;
    });
  }

  GetScheduleDropDown() {
    this.commonService.ScheduleDropDown().subscribe((response) => {
      this.scheduleDropDown = response;
    });
  }
}
