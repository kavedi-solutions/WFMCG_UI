export interface AccountsPutRequest {
  accountName: string | null;
  legalName: string | null;
  groupID: number;
  balanceTransferToID: number;
  accountTypeID: number;
  transactionTypeID: number;
  salesTypeID: number;
  accountTradeTypeID: number;
  headAccountID: number;
  bookInit: string | null;
  address: string | null;
  cityName: string | null;
  pinCode: string | null;
  stateID: number;
  areaID: number;
  gSTNo: string | null;
  pAN: string | null;
  contactPerson: string | null;
  contactNo: string | null;
  isActive: boolean;
  ModifiedBy?: string;
}

export interface AccountBalancePutRequest {
  balance: number;
}
