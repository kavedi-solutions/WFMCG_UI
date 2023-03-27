export interface TaxPutRequest {
  taxName?: string;
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
  ModifiedBy?: string;
}
