export interface ItemPutRequest {
  itemName: string;
  hSNCode: string;
  isServiceItem: boolean;
  isInventory: boolean;
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
  ModifiedBy?: string;
}

export interface OpeningItemPutRequest {
  opening: number;
}
