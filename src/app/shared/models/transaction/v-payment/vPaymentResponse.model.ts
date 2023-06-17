import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface VPaymentPagedResponse {
  headers?: PaginationHeaders;
  body: VPayment[];
}

export interface VPayment {
  autoID: number;
  companyID: string;
  voucherNo: number;
  refNo?: string;
  voucherDate: string;
  bookAccountID: number;
  bookAccountName?: string;
  accountID: number;
  accountName?: string;
  amount: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface VPaymentResponse {
  autoID: number;
  companyID: string;
  voucherType: string;
  voucherNo: number;
  refNo: string;
  voucherDate: string;
  transactionTypeID: number;
  bookAccountID: number;
  accountID: number;
  amount: number;
  transactionNo: string;
  narration: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

