import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface ItemResponse {
  headers?: PaginationHeaders;
  body: Item[];
}

export interface Item {
  companyID: string;
  itemID: number;
  itemName: string;
  hsnCode: string;
  itemType: number;
  itemGroupID: number;
  manufactureID: number;
  packing: number;
  weight: number;
  mainUnit: number;
  subUnit: number;
  gstTaxID: number;
  accountTradeTypeID: number;
  accountTradeTypeName: string;
  mrp: number;
  purchaseRate: number;
  salesRate: number;
  margin: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface ItemOpeningResponse {
  headers?: PaginationHeaders;
  body: ItemOpening[];
}

export interface ItemOpening {
  companyID: string;
  itemID: number;
  itemName: string;
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
