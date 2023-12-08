import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface AccountsResponse {
  headers?: PaginationHeaders;
  body: Accounts[];
}

export interface Accounts {
  companyID: string;
  accountID: number;
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
  pan: string;
  contactPerson: string;
  contactNo: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  gstDetails: AccountGSTResponse[] | null;
}

export interface AccountGSTResponse {
  autoID: number;
  accountID: number;
  gstNo: string;
  status: string;
  dtReg: string;
  dtDReg: string;
}

export interface AccountBalanceResponse {
  companyID: string;
  accountID: number;
  accountName: string;
  creditBalance: number;
  debitBalance: number;
}



export interface CurrentAccountBalanceResponse {
  companyID: string;
  accountID: number;
  balance: number;
  balanceType: string;
}
