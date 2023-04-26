import { AccessRights, PaginationHeaders } from '../shared';

export const defaultPaginationHeaders: PaginationHeaders = {
  page: 0,
  pageSize: 25,
  pageCount: 0,
  recordCount: 0,
};

export const pageSizeOptions = [10, 25, 50, 100];
