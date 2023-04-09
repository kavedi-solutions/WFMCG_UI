import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface PurchaseResponse {
  headers?: PaginationHeaders;
  body: Purchase[];
}

export interface Purchase {
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
