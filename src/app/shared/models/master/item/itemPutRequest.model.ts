export interface ItemPutRequest {
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
  gSTTaxID: number;
  accountTradeTypeID: number;
  mRP: number;
  purchaseRate: number;
  salesRate: number;
  margin: number;
  isActive: boolean;
  modifiedBy?: string;
}

export interface OpeningItemPutRequest {
  returnTypeID: number;
  opening: number;
  openingSpoiled: number;
}
