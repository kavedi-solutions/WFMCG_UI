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
  isActive: boolean;
  ModifiedBy?: string;
}

export interface AccountBalancePutRequest {
  balance: number;
}
