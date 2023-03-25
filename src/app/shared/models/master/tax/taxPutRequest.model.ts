export interface TaxPutRequest {
  taxName?: string;
  igstRate: number;
  cgstRate: number;
  sgstRate: number;
  cessRate: number;
  totalTaxRate: number;
  postingACID: number;
  isActive: boolean;
  ModifiedBy?: string;
}
