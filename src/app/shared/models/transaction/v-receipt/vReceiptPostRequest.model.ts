export interface VReceiptPostRequest {
  voucherType?: string;
  voucherNo: number;
  refNo?: string;
  voucherDate: string;
  transactionTypeID: number;
  bookAccountID: number;
  accountID: number;
  amount: number;
  paymentType:Number;
  transactionNo?: string;
  narration?: string;
  isActive: boolean;
  createdBy?: string;
}
