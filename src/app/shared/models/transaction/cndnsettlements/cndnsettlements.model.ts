export interface CNDNSettlementResponse {
  autoID: number;
  companyID: string;
  cnDnType: string | null;
  cnDnTypeName: string | null;
  cnDnID: number;
  refNo: string | null;
  billDate: string;
  accountID: number;
  amount: number;
  pendingAmount: number;
  receiveAmount: number;
}

export interface CreditNoteSettlementRequest {
  autoID: number;
  companyID: string;
  accountID: number;
  cnDnType: string;
  cnDnID: number;
  amount: number;
}
