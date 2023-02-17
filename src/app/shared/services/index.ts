import { RoleService } from './admin/role.service';
import { AuthService } from './common/auth.service';
import { AppDirectionality } from './common/directionality.service';
import { PreloaderService } from './common/preloader.service';
import { SettingsService } from './common/settings.service';
import { SpinnerService } from './common/spinner.service';
import {
  LocalStorageService,
  MemoryStorageService,
} from './common/storage.service';

export const services: any[] = [
  AuthService,
  LocalStorageService,
  MemoryStorageService,
  PreloaderService,
  SettingsService,
  AppDirectionality,
  RoleService,
  SpinnerService,
];

export * from './admin/role.service';

export * from './common/auth.service';
export * from './common/storage.service';
export * from './common/preloader.service';
export * from './common/settings.service';
export * from './common/directionality.service';
export * from './common/spinner.service';
