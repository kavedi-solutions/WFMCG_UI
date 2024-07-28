export interface CNDNSettlementResponse {
  autoID: number;
  companyID: string;
  cnDnType: string;
  cnDnTypeName: string;
  cnDnID: number;
  refNo: string;
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
