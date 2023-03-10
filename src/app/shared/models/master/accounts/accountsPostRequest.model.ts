export interface AccountsPostRequest {
  accountName?: string;
  legalName?: string;
  groupID: number;
  balanceTransferToID: number;
  accountTypeID: number;
  transactionTypeID: number;
  salesTypeID: number;
  accountTradeTypeID: number;
  headAccountID: number;
  bookInit?: string;
  address?: string;
  cityName?: string;
  pinCode?: string;
  stateID: number;
  areaID: number;
  gSTNo?: string;
  pAN?: string;
  contactPerson?: string;
  contactNo?: string;
  openingBalance: number;
  isActive: boolean;
  createdBy?: string;
}
