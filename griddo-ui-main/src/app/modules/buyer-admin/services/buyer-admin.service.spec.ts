import { TestBed } from '@angular/core/testing';

import { BuyerAdminService } from './buyer-admin.service';

describe('BuyerAdminService', () => {
  let service: BuyerAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyerAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
