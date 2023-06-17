import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface SalesReturnPagedResponse {
  headers?: PaginationHeaders;
  body: SalesReturn[];
}

export interface SalesReturn {
  companyID: string;
  autoID: number;
  bookAccountID: number;
  bookAccountName: string;
  billNo: number;
  refNo: string;
  billDate: string;
  returnTypeID: number;
  returnTypeName: string;
  accountID: number;
  accountName: string;
  accountTradeTypeID: number;
  accountTradeTypeName: string;
  netAmount: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface SalesReturnResponse {
  autoID: number;
  companyID: string;
  bookAccountID: number;
  billNo: number;
  refNo: string | null;
  billDate: string;
  returnTypeID: number;
  accountID: number;
  accountTradeTypeID: number;
  totalAmount: number;
  totalCGSTAmount: number;
  totalSGSTAmount: number;
  totalIGSTAmount: number;
  totalCessAmount: number;
  totalTaxAmount: number;
  totalNetAmount: number;
  roundOffAmount: number;
  netAmount: number;
  details: SalesReturnItemResponse[] | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface SalesReturnItemResponse {
  autoID: number;
  parentAutoID: number;
  srNo: number;
  itemID: number;
  itemName: string;
  accountTradeTypeID: number;
  crt: number;
  pcs: number;
  quantity: number;
  rate: number;
  amount: number;
  gstTaxID: number;
  gstTaxName: string;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  netAmount: number;
}
