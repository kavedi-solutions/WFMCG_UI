import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface SalesPagedResponse {
  headers?: PaginationHeaders;
  body: Sales[];
}

export interface Sales {
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
  eiStatus: boolean;
  eiCanceled: boolean;
  eiIrn: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface SalesResponse {
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
  totalGrossAmount: number;
  totalSchAmount: number;
  totalNetAmount: number;
  creditNoteAmount: number;
  otherAddText: string | null;
  otherAddAmount: number;
  otherLessText: string | null;
  otherLessAmount: number;
  roundOffAmount: number;
  netAmount: number;
  details: SalesItemResponse[] | null;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface SalesItemResponse {
  autoID: number;
  parentAutoID: number;
  srNo: number;
  itemID: number;
  itemName: string;
  accountTradeTypeID: number;
  crt: number;
  pcs: number;
  quantity: number;
  fCrt: number;
  fPcs: number;
  freeQuantity: number;
  totalQuantity: number;
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
  grossAmount: number;
  schPer: number;
  schAmount: number;
  netAmount: number;
}
