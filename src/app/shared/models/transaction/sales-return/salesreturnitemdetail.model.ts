export interface SalesReturnItemDetail {
  AutoID: number;
  SrNo: number;
  ItemID: number;
  ItemName: string;
  Crt: number;
  Pcs: number;
  Qty: number;
  Rate: number;
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
