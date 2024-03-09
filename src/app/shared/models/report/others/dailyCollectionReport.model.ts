export interface DailyCollectionReportFilter {
  reportType: string;
  transactionTypeID: number;
  returnTypeID: number;
  fromDate: string;
  toDate: string;
  selectedBookAccountID: number[];
  selectedAccountID: number[];
}
