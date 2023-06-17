export interface VPaymentPostRequest {
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
  createdBy?: string;
}
