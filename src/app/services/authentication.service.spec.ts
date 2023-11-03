import { TestBed } from '@angular/core/testing';

import { AuthehnticationService } from './authentication.service';

describe('AuthehnticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthehnticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
