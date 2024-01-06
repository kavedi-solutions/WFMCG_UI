export interface VoucherPrintFilter {
    voucherType: string;
    bookAccountID: number;
    FromDate: string;
    ToDate: string;
  }

  export interface VoucherPrintResponse {
    autoID: number;
    refNo: string;
    voucherDate: string;
    accountName: string;
    amount: number;
  }