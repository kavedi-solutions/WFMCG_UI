export interface SalesRegisterFilter {
  fromDate: string;
  toDate: string;
  outputType: string;
  monthWiseSummary: boolean;
  itemWiseSummary: boolean;
  accountsIds: number[];
}
