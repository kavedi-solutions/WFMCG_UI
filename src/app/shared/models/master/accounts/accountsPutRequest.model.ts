export interface AccountsPutRequest {
  accountName: string;
  legalName: string;
  groupID: number;
  balanceTransferToID: number;
  accountTypeID: number;
  transactionTypeID: number;
  salesTypeID: number;
  accountTradeTypeID: number;
  headAccountID: number;
  bookInit: string;
  address: string;
  cityName: string;
  pinCode: string;
  stateID: number;
  areaID: number;
  pAN: string;
  contactPerson: string;
  contactNo: string;
  invoiceLimit: number;
  isActive: boolean;
  ModifiedBy?: string;
  gstDetails: AccountGSTPutRequest[] | null;
}

export interface AccountGSTPutRequest {
  autoID: number;
  gstNo: string;
  status: string;
  dtReg: string;
  dtDReg: string;
  isAdd: boolean;
  isModified: boolean;
}

export interface AccountBalancePutRequest {
  balance: number;
}
