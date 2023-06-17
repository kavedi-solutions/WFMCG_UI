export interface VContraPutRequest {
  voucherType?: string;
  voucherNo: number;
  refNo?: string;
  voucherDate: string;
  transactionTypeID: number;
  bookAccountID: number;
  accountID: number;
  amount: number;
  transactionNo?: string;
  narration?: string;
  isActive: boolean;
  ModifiedBy?: string;
}
