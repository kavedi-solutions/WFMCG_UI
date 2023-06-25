export interface PurchaseReturnPutRequest {
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
  details: PurchaseReturnItemPutRequest[] | null;
  isActive: boolean;
  ModifiedBy?: string;
}

export interface PurchaseReturnItemPutRequest {
  autoID: number;
  srNo: number;
  itemID: number;
  quantity: number;
  rate: number;
  amount: number;
  gSTTaxID: number;
  cGSTAmount: number;
  sGSTAmount: number;
  iGSTAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  netAmount: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}