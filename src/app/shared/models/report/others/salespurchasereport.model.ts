export interface SalesPurchaseReportFilter {
  fromDate: string;
  toDate: string;
  transactionTypeID: number;
  returnTypeID: number;
  hasBookSelected: boolean;
  selectedBookAccountID?: number[];
  hasFirstSelected: boolean;
  selectedFirstName: string;
  selectedFirstID?: number[];
  hasSecondSelected: boolean;
  selectedSecondName: string;
  selectedSecondID?: number[];
  hasThirdSelected: boolean;
  selectedThirdName: string;
  selectedThirdID?: number[];
  hasFourthSelected: boolean;
  selectedFourthName: string;
  selectedFourthID?: number[];
  hasFifthSelected: boolean;
  selectedFifthName: string;
  selectedFifthID?: number[];
  hasSixthSelected: boolean;
  selectedSixthName: string;
  selectedSixthID?: number[];
  monthWise: boolean;
  showInvoiceNo: boolean;
  showInvoiceDate: boolean;
  showQuantity: boolean;
  showAmount: boolean;
  showDiscountAmount: boolean;
  showTaxableAmount: boolean;
  showTaxAmount: boolean;
  showGrossAmount: boolean;
  showSchemeAmount: boolean;
  showNetAmount: boolean;
  sortFirst: string;
  sortSecond: string;
  sortThird: string;
  sortFourth: string;
  sortFifth: string;
  sortSixth: string;
}

export interface FilterList {
  SelType: string;
  SelName: string;
  IsSeleted: boolean;
}

export interface SalesPurchaseReportResponse {
  bookName: string;
  firstColVal: string;
  secondColVal: string;
  thirdColVal: string;
  fourthColVal: string;
  fifthColVal: string;
  sixthColVal: string;
  monthYear: string;
  invoiceNo: string;
  invoiceDate: string;
  crt: number;
  pcs: number;
  fCrt: number;
  fPcs: number;
  tCrt: number;
  tPcs: number;
  amount: number;
  discountAmount: number;
  taxableAmount: number;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  grossAmount: number;
  schemeAmount: number;
  netAmount: number;
}
