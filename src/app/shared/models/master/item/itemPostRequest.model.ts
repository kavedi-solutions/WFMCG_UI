export interface ItemPostRequest {
  itemName: string | null;
  hSNCode: string | null;
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
  createdBy?: string;
}
