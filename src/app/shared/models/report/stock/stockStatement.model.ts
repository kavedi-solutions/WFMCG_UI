export interface StockStatementFilter {
  returnTypeID: number;
  fromDate: string;
  toDate: string;
  accountTradeTypeID: number;
  withAmount: boolean;
  withAllAmount: boolean;
  amountCalculatedOn: number;
  isChildGroups: boolean;
  itemGroups: number[];
}
