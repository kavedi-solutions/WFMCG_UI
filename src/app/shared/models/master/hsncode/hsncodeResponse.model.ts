import { PaginationHeaders } from "../../common/PaginationHeaders.model";

export interface HSNCodeResponse {
  headers?: PaginationHeaders;
  body: HSNCode[];
}

export interface HSNCode {
  companyID: string;
  autoID: number;
  hSN_SAC_Code: string;
  hSN_SAC_Description: string ;
  hSN_SAC_Type: string ;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
