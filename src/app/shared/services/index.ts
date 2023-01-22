import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { LocalStorageService, MemoryStorageService } from './storage.service';

export const services: any[] = [
  AuthService,
  LoginService,
  LocalStorageService,
  MemoryStorageService,
];
export * from './auth.service';
export * from './login.service';
export * from './storage.service';
