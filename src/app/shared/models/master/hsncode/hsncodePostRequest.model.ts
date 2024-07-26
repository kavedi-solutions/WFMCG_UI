export interface HSNCodePostRequest {
  hSN_SAC_Code: string;
  hSN_SAC_Description: string;
  hSN_SAC_Type: string;
  isActive: boolean;
  createdBy?: string;
}
