import { TestBed, inject } from '@angular/core/testing';

import { SportAuthService } from './sport-auth.service';

describe('SportAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SportAuthService]
    });
  });

  it('should be created', inject([SportAuthService], (service: SportAuthService) => {
    expect(service).toBeTruthy();
  }));
});
