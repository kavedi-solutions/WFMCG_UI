import { TestBed } from '@angular/core/testing';

import { DirectionalityService } from './directionality.service';

describe('DirectionalityService', () => {
  let service: DirectionalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectionalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
