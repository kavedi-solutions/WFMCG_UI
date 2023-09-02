export interface VReceiptB2BPutRequest {
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
  receivedBills: VReceiptB2BPendingBillsPutRequest[];
}

export interface VReceiptB2BPendingBillsPutRequest {
  autoID: number;
  salesType: string | null;
  invoiceID: number;
  amount: number;
}
