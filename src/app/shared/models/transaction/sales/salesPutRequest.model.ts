export interface SalesPutRequest {
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
  otherAddText: string | null;
  otherAddAmount: number;
  otherLessText: string | null;
  otherLessAmount: number;
  roundOffAmount: number;
  netAmount: number;
  details: SalesItemPutRequest[] | null;
  isActive: boolean;
  ModifiedBy?: string;
}

export interface SalesItemPutRequest {
  autoID: number;
  srNo: number;
  itemID: number;
  quantity: number;
  freeQuantity: number;
  totalQuantity: number;
  rate: number;
  amount: number;
  discPer: number;
  discAmount: number;
  taxableAmount: number;
  gSTTaxID: number;
  cGSTAmount: number;
  sGSTAmount: number;
  iGSTAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  grossAmount: number;
  schPer: number;
  schAmount: number;
  netAmount: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
