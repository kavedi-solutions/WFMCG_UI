export interface VJournalPostRequest {
  voucherType?: string;
  voucherNo: number;
  refNo?: string;
  voucherDate: string;
  transactionTypeID: number;
  bookAccountID: number;
  receiverAccountID: number;
  giverAccountID: number;
  amount: number;
  narration?: string;
  isActive: boolean;
  createdBy?: string;
}
