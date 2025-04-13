import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface ItemResponse {
  headers?: PaginationHeaders;
  body: Item[];
}

export interface Item {
  companyID: string;
  itemID: number;
  itemName: string;
  displayItemName: string;
  hsnCodeID: number;
  itemType: number;
  itemGroupID: number;
  manufactureID: number;
  packing: number;
  weight: number;
  mainUnit: number;
  subUnit: number;
  accountTradeTypeID: number;
  accountTradeTypeName: string;
  mrp: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  gstDetails?: ItemGSTResponse[];
  softwareDetails?: ItemSoftwareResponse[];
}

export interface ItemGSTResponse {
  autoID: number;
  itemID: number;
  applicableDate: string;
  gstTaxID: number;
  taxName: string;
  totalTaxRate: number;
  purchaseRate: number;
  purchaseRateWT: number;
  salesRate: number;
  salesRateWT: number;
  margin: number;
}

export interface ItemSoftwareResponse {
  autoID: number;
  companyID: string;
  itemID: number;
  softwareID: number;
  softwareInit: string;
  itemName: string;
}

export interface ItemOpeningResponse {
  headers?: PaginationHeaders;
  body: ItemOpening[];
}

export interface ItemOpening {
  companyID: string;
  itemID: number;
  itemName: string;
  displayItemName: string;
  accountTradeTypeID: number;
  accountTradeTypeName: string;
  returnTypeID: number;
  returnTypeName: string;
  packing: number;
  opening: number;
  openingCrt: number;
  openingPcs: number;
  openingSpoiled: number;
  openingSpoiledCrt: number;
  openingSpoiledPcs: number;
}
export interface GTMTItemResponse {
  companyID: string;
  gtItemID: number;
  mtItemID: number;
  itemName: string;
}
