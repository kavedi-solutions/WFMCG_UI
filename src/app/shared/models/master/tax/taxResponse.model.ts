import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface TaxResponse {
  headers?: PaginationHeaders;
  body: Tax[];
}

export interface Tax {
  companyID: string;
  taxID: number;
  taxName: string;
  igstRate: number;
  cgstRate: number;
  sgstRate: number;
  cessRate: number;
  totalTaxRate: number;
  postingACID: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
