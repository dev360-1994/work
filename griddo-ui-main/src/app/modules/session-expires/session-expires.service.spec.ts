import { TestBed } from '@angular/core/testing';

import { SessionExpiresService } from './session-expires.service';

describe('SessionExpiresService', () => {
  let service: SessionExpiresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionExpiresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
