export interface e_invoice_api_balance_response {
  status: boolean;
  success: e_invoice_api_balance_success ;
  failed: e_invoice_api_balance_Failed ;
}

export interface e_invoice_api_balance_success {
  pubApiBal: number;
  pubApiBalExpDt: string ;
  ewbApiBal: number;
  ewbApiBalExpDt: string ;
  gstApiBal: number;
  gstApiBalExpDt: string ;
}

export interface e_invoice_api_balance_Failed {
  status_cd: string ;
  error: e_invoice_api_balance_error ;
}

export interface e_invoice_api_balance_error {
  error_cd: string ;
  message: string ;
}
