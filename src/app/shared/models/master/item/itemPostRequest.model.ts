export interface ItemPostRequest {
  itemName: string;
  displayItemName: string;
  hsnCodeId: number;
  itemType: number;
  itemGroupID: number;
  manufactureID: number;
  packing: number;
  weight: number;
  mainUnit: number;
  subUnit: number;
  accountTradeTypeID: number;
  mRP: number;
  isActive: boolean;
  createdBy?: string;
  gstDetails?: ItemGSTPostRequest[];
}


export interface ItemGSTPostRequest {
  applicableDate: string;
  gstTaxID: number;
  purchaseRate: number;
  salesRate: number;
  margin: number;
  isAdd: boolean;
  isModified: boolean;
}
