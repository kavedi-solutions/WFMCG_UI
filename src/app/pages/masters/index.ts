import { AreaAddEditComponent } from "./area/area-add-edit/area-add-edit.component";
import { AreaComponent } from "./area/area.component";
import { GroupAddEditComponent } from "./group/group-add-edit/group-add-edit.component";
import { GroupComponent } from "./group/group.component";

export const MasterPages: any[] = [
  AreaComponent,
  AreaAddEditComponent,
  GroupComponent,
  GroupAddEditComponent
];

export * from "./area/area-add-edit/area-add-edit.component";
export * from "./area/area.component";
export * from "./group/group-add-edit/group-add-edit.component";
export * from "./group/group.component";
