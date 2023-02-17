import { ErrorCodeComponent } from "./error-code/error-code.component";
import { NotificationComponent } from "./notification/notification.component";
import { PageHeaderComponent } from "./page-header/page-header.component";

export const SharedComponent: any[] = [
  ErrorCodeComponent,
  NotificationComponent,
  PageHeaderComponent
]

export * from "./error-code/error-code.component";
export * from "./notification/notification.component";
export * from "./page-header/page-header.component";
