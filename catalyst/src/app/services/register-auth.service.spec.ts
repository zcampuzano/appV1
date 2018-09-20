import { TestBed, inject } from '@angular/core/testing';

import { RegisterAuthService } from './register-auth.service';

describe('RegisterAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterAuthService]
    });
  });

  it('should be created', inject([RegisterAuthService], (service: RegisterAuthService) => {
    expect(service).toBeTruthy();
  }));
});
