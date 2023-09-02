export interface VPaymentPutRequest {
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
  ModifiedBy?: string;
}
