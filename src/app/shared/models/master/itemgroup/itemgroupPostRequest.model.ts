export interface ItemGroupPostRequest {
  itemGroupName?: string;
  itemGroupType: string;
  parentGroupItemGroupID: number;
  isActive: boolean;
  createdBy?: string;
}
