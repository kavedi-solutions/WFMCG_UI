export interface stateDownDownResponse {
  state_Id: string;
  state_Name: string;
}

export interface accountTradeTypeResponse {
  accountTradeTypeID: string;
  accountTradeTypeName: string;
  accountTypeID: string;
}

export interface accountTypeResponse {
  accountTypeID: string;
  accountTypeName: string;
}

export interface balanceTransferToResponse {
  balanceTransferToID: string;
  balanceTransferToName: string;
}

export interface salesTypeResponse {
  salesTypeID: string;
  salesTypeName: string;
  transactionTypeID: string;
}

export interface transactionTypeResponse {
  transactionTypeID: string;
  transactionTypeName: string;
  accountTypeID: string;
}

export interface voucherTypeResponse {
  voucherTypeID: string;
  voucherTypeShortName: string;
  voucherTypeFullName: string;
}

export interface scheduleResponse {
  scheduleID: string;
  scheduleName: string;
}

export interface DD_UnitResponse {
  unitID: string;
  unitName: string;
}

export interface returnTypeResponse {
  returnTypeID: string;
  returnTypeName: string;
}
