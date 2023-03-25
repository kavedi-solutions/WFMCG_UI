import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface ManufactureResponse {
  headers?: PaginationHeaders;
  body: Manufacture[];
}

export interface Manufacture {
  companyID: string;
  manufactureID: number;
  manufactureName: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}