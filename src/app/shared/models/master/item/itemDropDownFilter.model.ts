export interface ItemFilter_DropDown {
  ItemType: number;
  AccountTradeTypeID?: Number;
  ReturnTypeID?: Number;  
  TransactionTypeID?: number;
  AccountID?: number;
  InvoiceID?: number;
  BillDate?: string;
}

export interface ItemFilter_DropDownReport {
  ItemType: number;
  TransactionTypeID?: number;
}
