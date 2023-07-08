// export interface CNDNSettlements {
//   cndnType: string;
//   cndnTypeName: string;
//   autoID: number;
//   refNo: string;
//   billDate: string;
//   amount: number;
//   PendingAmount: number;
//   ReceiveAmount: number;
// }

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