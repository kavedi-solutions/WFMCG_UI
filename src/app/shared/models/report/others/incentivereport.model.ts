export interface accountsIncentiveDropDown {
  accountID: string;
  accountName: string;
}

export interface IncentiveReportFilter {
  reportType: string;
  fromDate: string;
  toDate: string;
  manufactureID: number;
  areaID: number;
  SelectedAccountID?: number[];
}
