export interface CreditNotePostRequest {
  bookAccountID: number;
  billNo: number;
  refNo: string | null;
  billDate: string;
  accountID: number;
  description: string;
  amount: number;
  isActive: boolean;
  createdBy?: string;
}
