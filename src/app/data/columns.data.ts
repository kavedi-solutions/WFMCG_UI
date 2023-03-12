import { MtxGridColumn } from '@ng-matero/extensions/grid';

export function GetRoleColumns() {
  let RoleColumns: MtxGridColumn[] = [
    {
      header: 'RoleID',
      field: 'RoleID',
      hide: true,
    },
    {
      header: 'Role Name',
      field: 'name',
      sortable: true,
      disabled: true,
      minWidth: 200,
      width: '200px',
      pinned: 'left',
    },
    {
      header: 'Description',
      field: 'description',
      sortable: true,
      disabled: true,
      minWidth: 700,
      width: '700px',
    },
    {
      header: 'Is Active',
      field: 'isActive',
      sortable: true,
      disabled: true,
      type: 'tag',
      tag: {
        true: { text: 'Active', color: 'green-100' },
        false: { text: 'In Active', color: 'red-100' },
      },
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
  ];

  return RoleColumns;
}

export function GetUserColumns() {
  let UserColumns: MtxGridColumn[] = [
    {
      header: 'UserID',
      field: 'userID',
      hide: true,
    },
    {
      header: 'First Name',
      field: 'firstName',
      sortable: true,
      disabled: true,
      minWidth: 150,
      width: '150px',
      pinned: 'left',
    },
    {
      header: 'Last Name',
      field: 'lastName',
      sortable: true,
      disabled: true,
      minWidth: 150,
      width: '150px',
      pinned: 'left',
    },
    {
      header: 'User Name',
      field: 'userName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
    },
    {
      header: 'Role Name',
      field: 'roleName',
      sortable: true,
      disabled: true,
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Mobile (Work)',
      field: 'mobile_Work',
      sortable: true,
      disabled: true,
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'User Type',
      field: 'isCompanyOwner',
      sortable: true,
      disabled: true,
      type: 'tag',
      tag: {
        true: { text: 'Owner', color: 'green-100' },
        false: { text: 'User', color: 'red-100' },
      },
    },
    {
      header: 'Is Active',
      field: 'isActive',
      sortable: true,
      disabled: true,
      type: 'tag',
      tag: {
        true: { text: 'Active', color: 'green-100' },
        false: { text: 'In Active', color: 'red-100' },
      },
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
  ];
  return UserColumns;
}

export function GetAreaColumns() {
  let AreaColumns: MtxGridColumn[] = [
    {
      header: 'AreaID',
      field: 'AreaID',
      hide: true,
    },
    {
      header: 'Area Name',
      field: 'name',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
      pinned: 'left',
    },
    {
      header: 'Is Active',
      field: 'isActive',
      sortable: true,
      disabled: true,
      type: 'tag',
      tag: {
        true: { text: 'Active', color: 'green-100' },
        false: { text: 'In Active', color: 'red-100' },
      },
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
  ];

  return AreaColumns;
}

export function GetGroupColumns() {
  let GroupColumns: MtxGridColumn[] = [
    {
      header: 'GroupID',
      field: 'GroupID',
      hide: true,
    },
    {
      header: 'Group Name',
      field: 'groupName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
      pinned: 'left',
    },
    {
      header: 'Balance Transfer To',
      field: 'balanceTransferToName',
      sortable: true,
      disabled: true,
      minWidth: 250,
      width: '250px',
    },
    {
      header: 'Schedule Name',
      field: 'scheduleName',
      sortable: true,
      disabled: true,
      minWidth: 250,
      width: '250px',
    },
    {
      header: 'Status',
      field: 'isActive',
      sortable: true,
      disabled: true,
      type: 'tag',
      tag: {
        true: { text: 'Active', color: 'green-100' },
        false: { text: 'In Active', color: 'red-100' },
      },
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
  ];

  return GroupColumns;
}

export function GetAccountColumns() {
  let AccountsColumns: MtxGridColumn[] = [
    {
      header: 'AccountID',
      field: 'AccountID',
      hide: true,
    },
    {
      header: 'Account Name',
      field: 'accountName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
      pinned: 'left',
    },
    {
      header: 'Group Name',
      field: 'groupName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
    },
    {
      header: 'Area Name',
      field: 'areaName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
    },
    {
      header: 'GST No',
      field: 'gstNo',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
    },
    {
      header: 'Contact Person',
      field: 'contactPerson',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
    },
    {
      header: 'Contact No',
      field: 'contactNo',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
    },
    {
      header: 'Status',
      field: 'isActive',
      sortable: true,
      disabled: true,
      type: 'tag',
      tag: {
        true: { text: 'Active', color: 'green-100' },
        false: { text: 'In Active', color: 'red-100' },
      },
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
    },
  ];

  return AccountsColumns;
}
