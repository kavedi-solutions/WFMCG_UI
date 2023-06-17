export enum AccountTradeTypeMaster {
  None = 1,
  GT = 2,
  MT = 3,
}

export enum AccountTypeMaster {
  General = 1,
  Customer = 2,
  Supplier = 3,
  Head_Books = 4,
  Proprietor_Partners = 5,
}

export enum BalanceTransferToMaster {
  TradingAccount = 1,
  ProfitAndLossAccount = 2,
  BalanceSheet = 3,
}

export enum SalesTypeMaster {
  None = 1,
  Cash_Memo = 2,
  Credit_Memo = 3,
}

export enum ScheduleMaster {
  Expenditure_Trading_AC = 1,
  Income_Trading_AC = 2,
  Expenditure_ProfitAndLoss_AC = 3,
  Income_ProfitAndLoss_AC = 4,
  Liabilities = 5,
  Assets = 6,
}

export enum TransactionTypeMaster {
  None = 1,
  Cash = 2,
  Bank = 3,
  Journal_Voucher = 4,
  Purchase_Inventory = 11,
  Purchase_Service = 12,
  Purchase_Assets = 13,
  Sales_Inventory = 21,
  Sales_Service = 22,
  Sales_Assets = 23,
  Purchase_Return = 31,
  Sales_Return = 32,
  Credit_Note = 33,
  Debit_Note = 34,
  TransferStockMTtoGT = 41,
  TransferStockGTtoMT = 42,
  TransferStocktoOther = 43,
}

export enum ReturnType {
  Normal = 1,
  Spoiled = 2,
}
