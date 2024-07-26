export interface HSNCodePutRequest {
  hSN_SAC_Code: string;
  hSN_SAC_Description: string ;
  hSN_SAC_Type: string;
  isActive: boolean;
  modifiedBy?: string;
}
