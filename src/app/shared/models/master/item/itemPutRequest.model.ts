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
  accountTradeTypeID: number;
  mRP: number;
  isActive: boolean;
  modifiedBy?: string;
  gstDetails?: ItemGSTPutRequest[];
  softwareDetails?: ItemSoftwarePutRequest[];
}
export interface ItemGSTPutRequest {
  autoID: number;
  applicableDate: string;
  gstTaxID: number;
  purchaseRate: number;
  salesRate: number;
  margin: number;
  isAdd: boolean;
  isModified: boolean;
}

export interface ItemSoftwarePutRequest {
  autoID: number;
  softwareID: number;
  itemName: string;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}

export interface OpeningItemPutRequest {
  returnTypeID: number;
  opening: number;
  openingSpoiled: number;
}
