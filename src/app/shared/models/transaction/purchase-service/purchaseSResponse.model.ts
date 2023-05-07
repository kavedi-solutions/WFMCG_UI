import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface PurchaseSPagedResponse {
  headers?: PaginationHeaders;
  body: PurchaseS[];
}

export interface PurchaseS {
  companyID: string;
  autoID: number;
  bookAccountID: number;
  bookAccountName: string;
  billNo: number;
  refNo: string;
  billDate: string;
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

export interface PurchaseSResponse {
  autoID: number;
  companyID: string;
  bookAccountID: number;
  billNo: number;
  refNo: string | null;
  billDate: string;
  accountID: number;
  accountTradeTypeID: number;
  totalAmount: number;
  totalDiscAmount: number;
  totalTaxableAmount: number;
  totalCGSTAmount: number;
  totalSGSTAmount: number;
  totalIGSTAmount: number;
  totalCessAmount: number;
  totalTaxAmount: number;
  totalNetAmount: number;
  roundOffAmount: number;
  netAmount: number;
  details: PurchaseSItemResponse[] | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface PurchaseSItemResponse {
  autoID: number;
  parentAutoID: number;
  srNo: number;
  itemID: number;
  itemName: string;
  accountTradeTypeID: number;
  rate: number;
  amount: number;
  discPer: number;
  discAmount: number;
  taxableAmount: number;
  gstTaxID: number;
  gstTaxName: string;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  netAmount: number;
}
