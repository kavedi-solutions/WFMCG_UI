import { AuthService } from './auth.service';
import { AppDirectionality } from './directionality.service';
import { LoginService } from './login.service';
import { PreloaderService } from './preloader.service';
import { SettingsService } from './settings.service';
import { LocalStorageService, MemoryStorageService } from './storage.service';

export const services: any[] = [
  AuthService,
  LoginService,
  LocalStorageService,
  MemoryStorageService,
  PreloaderService,
  SettingsService,
  AppDirectionality
];
export * from './auth.service';
export * from './login.service';
export * from './storage.service';
export * from './preloader.service';
export * from './settings.service';
export * from './directionality.service';
