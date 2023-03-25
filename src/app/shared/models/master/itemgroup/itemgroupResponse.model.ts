import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface ItemGroupResponse {
  headers?: PaginationHeaders;
  body: ItemGroup[];
}

export interface ItemGroup {
  companyID: string;
  itemGroupID: number;
  itemGroupName: string;
  itemGroupType: string;
  parentGroupItemGroupID: number;
  parentItemGroupName: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
