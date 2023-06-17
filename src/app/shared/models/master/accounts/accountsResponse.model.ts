import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface AccountsResponse {
  headers?: PaginationHeaders;
  body: Accounts[];
}

export interface Accounts {
  companyID: string;
  accountID: number;
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
  gstNo: string | null;
  pan: string | null;
  contactPerson: string | null;
  contactNo: string | null;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface AccountBalanceResponse {
  companyID: string;
  accountID: number;
  accountName: string | null;
  creditBalance: number;
  debitBalance: number;
}

export interface CurrentAccountBalanceResponse {
  companyID: string;
  accountID: number;
  balance: number;
  balanceType: string;
}
