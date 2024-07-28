import { PaginationHeaders } from "../../common/PaginationHeaders.model";

export interface HSNCodeResponse {
  headers?: PaginationHeaders;
  body: HSNCode[];
}

export interface HSNCode {
  companyID: string;
  autoID: number;
  hsN_SAC_Code: string;
  hsN_SAC_Description: string ;
  hsN_SAC_Type: string ;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
