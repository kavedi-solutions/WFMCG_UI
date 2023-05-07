export interface PurchaseSPostRequest {
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
  details: PurchaseSItemPostRequest[] | null;
  isActive: boolean;
  createdBy?: string;
}

export interface PurchaseSItemPostRequest {
  srNo: number;
  itemID: number;
  amount: number;
  discPer: number;
  discAmount: number;
  taxableAmount:number;
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
