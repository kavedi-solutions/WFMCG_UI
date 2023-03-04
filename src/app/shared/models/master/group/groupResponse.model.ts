import { FilterValues } from '../../common/FilterValues.model';
import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface GroupResponse {
  headers?: PaginationHeaders;
  body: Group[];
  sort?: string;
  filter?: FilterValues[];
  searchText?: string;
}

export interface Group {
  companyID: string;
  groupID: number;
  groupName: string;
  balanceTransferToID: number;
  balanceTransferToName: string;
  scheduleID: number;
  scheduleName: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
