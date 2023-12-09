import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tokenGuardGuard } from './token-guard.guard';

describe('tokenGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tokenGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
