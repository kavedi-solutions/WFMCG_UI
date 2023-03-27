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
  igstInputPostingAc: number;
  igstOutputPostingAc: number;
  cgstRate: number;
  cgstInputPostingAc: number;
  cgstOutputPostingAc: number;
  sgstRate: number;
  sgstInputPostingAc: number;
  sgstOutputPostingAc: number;
  cessRate: number;
  cessInputPostingAc: number;
  cessOutputPostingAc: number;
  totalTaxRate: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
