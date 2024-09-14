import { PaginationHeaders } from "../../common/PaginationHeaders.model";

export interface ItemGTMTMappingResponse {
  headers?: PaginationHeaders;
  body: ItemGTMTMapping[];
}

export interface ItemGTMTMapping {
  companyID: string;
  autoID: number;
  gtItemID: number;
  gtItemName: string;
  mtItemID: number;
  mtItemName: string;
}
