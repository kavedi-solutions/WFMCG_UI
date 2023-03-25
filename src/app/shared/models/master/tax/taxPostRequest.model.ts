export interface TaxPostRequest {
    taxName?: string;
    igstRate: number;
    cgstRate: number;
    sgstRate: number;
    cessRate: number;
    totalTaxRate: number;
    postingACID: number;
    isActive: boolean;
    createdBy?: string;
  }