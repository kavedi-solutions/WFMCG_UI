export interface VReceiptB2BPostRequest {
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
  receivedBills: VReceiptB2BPendingBillsPostRequest[];
}

export interface VReceiptB2BPendingBillsPostRequest {
  salesType?: string;
  invoiceID: number;
  amount: number;
}
