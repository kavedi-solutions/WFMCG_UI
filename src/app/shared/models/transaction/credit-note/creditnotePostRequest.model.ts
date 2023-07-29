export interface CreditNotePostRequest {
  bookAccountID: number;
  billNo: number;
  refNo: string | null;
  billDate: string;
  accountID: number;
  description: string;
  amount: number;
  roundOffAmount: number;
  netAmount: number;
  isActive: boolean;
  createdBy?: string;
}
