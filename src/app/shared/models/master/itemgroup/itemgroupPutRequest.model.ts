export interface ItemGroupPutRequest {
  itemGroupName?: string;
  itemGroupType: string;
  parentGroupItemGroupID: number;
  isActive: boolean;
  ModifiedBy?: string;
}
