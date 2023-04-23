export interface PurchaseItemDetail {
  AutoID: number;
  SrNo: number;
  ItemID: number;
  ItemName: string;
  Crt: number;
  Pcs: number;
  Qty: number;
  FCrt: number;
  FPcs: number;
  FQty: number;
  TQty: number;
  Rate: number;
  Amount: number;
  DiscPer: number;
  DiscAmount: number;
  GSTTaxID: number;
  GSTTaxName?: string;
  CGSTAmount: number;
  SGSTAmount: number;
  IGSTAmount: number;
  CessAmount: number;
  TotalTaxAmount: number;
  GrossAmount: number;
  SchPer: number;
  SchAmount: number;
  NetAmount: number;
  IsAdd: boolean;
  IsModified: boolean;
  IsDeleted: boolean;
}
