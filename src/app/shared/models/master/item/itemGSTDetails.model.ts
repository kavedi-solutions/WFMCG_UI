export interface ItemGSTDetails {
  autoID: number;
  applicableDate: string;
  gstTaxID: number;
  taxName: string;
  totalTaxRate: number;
  purchaseRate: number;
  purchaseRateWT: number;
  salesRate: number;
  salesRateWT: number;
  margin: number;
  isAdd: boolean;
  isModified: boolean;
}
