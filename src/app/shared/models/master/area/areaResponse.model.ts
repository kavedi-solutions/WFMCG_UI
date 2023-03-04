import { GridAreasStyleBuiler } from '@angular/flex-layout';
import { FilterValues } from '../../common/FilterValues.model';
import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface AreaResponse {
  headers?: PaginationHeaders;
  body: Area[];
  sort?: string;
  filter?: FilterValues[];
  searchText?: string;
}

export interface Area {
  companyID: string;
  areaID: number;
  name: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
