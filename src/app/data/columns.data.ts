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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
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
      minWidth: 200,
      width: '200px',
    },
    {
      header: 'Area Name',
      field: 'areaName',
      sortable: true,
      disabled: true,
      minWidth: 200,
      width: '200px',
    },
    {
      header: 'GST No',
      field: 'gstNo',
      sortable: true,
      disabled: true,
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Contact Person',
      field: 'contactPerson',
      sortable: true,
      disabled: true,
      minWidth: 200,
      width: '200px',
    },
    {
      header: 'Contact No',
      field: 'contactNo',
      sortable: true,
      disabled: true,
      minWidth: 200,
      width: '200px',
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
  ];

  return AccountsColumns;
}

export function GetAccountBalanceColumns() {
  let BalanceColumns: MtxGridColumn[] = [
    {
      header: 'AccountID',
      field: 'accountID',
      hide: true,
    },
    {
      header: 'Account Name',
      field: 'accountName',
      sortable: true,
      disabled: true,
      minWidth: 500,
      width: '500px',
      summary: 'Total',
    },
    {
      header: 'Credit Balance',
      field: 'creditBalance',
      sortable: false,
      disabled: true,
      minWidth: 300,
      width: '300px',
      type: 'number',
      typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
    {
      header: 'Debit Balance',
      field: 'debitBalance',
      sortable: false,
      disabled: true,
      minWidth: 300,
      width: '300px',
      type: 'number',
      typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
  ];
  return BalanceColumns;
}

export function GetTaxColumns() {
  let TaxColumns: MtxGridColumn[] = [
    {
      header: 'TaxID',
      field: 'taxID',
      hide: true,
    },
    {
      header: 'Tax Name',
      field: 'taxName',
      sortable: true,
      disabled: true,
      minWidth: 250,
      width: '250px',
      pinned: 'left',
    },
    {
      header: 'Total Tax Rate',
      field: 'totalTaxRate',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
      type: 'number',
      typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
      pinned: 'left',
    },
    {
      header: 'IGST Rate',
      field: 'igstRate',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
      type: 'number',
      typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
    {
      header: 'CGST Rate',
      field: 'cgstRate',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
      type: 'number',
      typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
    {
      header: 'SGST Rate',
      field: 'sgstRate',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
      type: 'number',
      typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
    {
      header: 'Cess Rate',
      field: 'cessRate',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
      type: 'number',
      typeParameter: { digitsInfo: '0.2-2', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
  ];

  return TaxColumns;
}

export function GetManufactureColumns() {
  let ManufactureColumns: MtxGridColumn[] = [
    {
      header: 'ManufactureID',
      field: 'manufactureID',
      hide: true,
    },
    {
      header: 'Manufacture Name',
      field: 'manufactureName',
      sortable: true,
      disabled: true,
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
  ];

  return ManufactureColumns;
}

export function GetItemGroupColumns() {
  let ItemGroupColumns: MtxGridColumn[] = [
    {
      header: 'Item Group ID',
      field: 'itemGroupID',
      hide: true,
    },
    {
      header: 'Item Group Name',
      field: 'itemGroupName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
      pinned: 'left',
    },
    {
      header: 'Item Group Type',
      field: 'itemGroupType',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: 'Parent Item Group Name',
      field: 'parentItemGroupName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
  ];

  return ItemGroupColumns;
}

export function GetItemColumns() {
  let ItemColumns: MtxGridColumn[] = [
    {
      header: 'Item ID',
      field: 'itemID',
      hide: true,
    },
    {
      header: 'Item Name',
      field: 'itemName',
      sortable: true,
      disabled: true,
      minWidth: 300,
      width: '300px',
      pinned: 'left',
    },
    {
      header: 'Trade Type',
      field: 'accountTradeTypeName',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: 'HSN Code',
      field: 'hsnCode',
      sortable: true,
      disabled: true,
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Packing',
      field: 'packing',
      sortable: true,
      disabled: true,
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'MRP',
      field: 'mrp',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: 'Item Type',
      field: 'isServiceItem',
      sortable: true,
      disabled: true,
      type: 'tag',
      tag: {
        true: { text: 'Service', color: 'red-100' },
        false: { text: 'Inventory', color: 'green-100' },
      },
      minWidth: 75,
      width: '75px',
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
      minWidth: 75,
      width: '75px',
    },
    {
      header: 'Created Date',
      field: 'createdDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
    {
      header: 'Updated Date',
      field: 'modifiedDate',
      sortable: true,
      disabled: true,
      type: 'date',
      typeParameter: { format: 'dd-MM-yyyy HH:mm:ss' },
      minWidth: 150,
      width: '150px',
    },
  ];

  return ItemColumns;
}

export function GetItemOpeningColumns() {
  let ItemOpeningColumns: MtxGridColumn[] = [
    {
      header: 'Item ID',
      field: 'itemID',
      hide: true,
    },
    {
      header: 'Item Name',
      field: 'itemName',
      sortable: true,
      disabled: true,
      pinned: 'left',
    },
    {
      header: 'Trade Type',
      field: 'accountTradeTypeName',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
    },
    {
      header: 'Packing',
      field: 'packing',
      sortable: false,
      disabled: true,
      minWidth: 75,
      width: '75px',
      type: 'number',
      typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
    {
      header: 'Opening',
      field: 'opening',
      hide: true,
    },
    {
      header: 'Crt',
      field: 'openingCrt',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
      type: 'number',
      typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
    {
      header: 'Pcs',
      field: 'openingPcs',
      sortable: false,
      disabled: true,
      minWidth: 100,
      width: '100px',
      type: 'number',
      typeParameter: { digitsInfo: '0.0-0', locale: 'en-IN' },
      class: 'right-mat-header-cell right-mat-cell',
    },
  ];
  return ItemOpeningColumns;
}
