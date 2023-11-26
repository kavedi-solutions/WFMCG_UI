export interface DebitNoteItemDetail {
  AutoID: number;
  SrNo: number;
  ItemID: number;
  ItemName: string;
  Amount: number;
  GSTTaxID: number;
  GSTTaxName?: string;
  CGSTAmount: number;
  SGSTAmount: number;
  IGSTAmount: number;
  CessAmount: number;
  TotalTaxAmount: number;
  NetAmount: number;
  IsAdd: boolean;
  IsModified: boolean;
  IsDeleted: boolean;
}
